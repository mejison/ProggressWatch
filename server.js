const express = require('express')
const app = express()
const reqeust = require('reqeust');
const mongoose = require('mongoose');
var OneSignal = require('onesignal-node');

var bp = require('body-parser')
app.use(bp.json());
app.use(bp.urlencoded({extended: true})); 


app.use(express.static('public'));

/* mongoose db */
mongoose.connect('mongodb://mjs:knopka100@ds245680.mlab.com:45680/progress-watch');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
const Emploee = require('./application/models/emploee');
const Watcher = require('./application/models/watcher');
const emploee_seed = require('./application/seeds/emploee_seed');
/* mongoose db */

app.get('/api/seed', (req, res) => {
    emploee_seed();
});

app.put('/api/watcher', (req, res) => {
    var  { emploee, hash } = req.body;
    
    Emploee
        .find()
        .where('index')
        .in(emploee)
        .exec((error, records) => {
            Watcher.findOneAndUpdate({hash:hash}, {emploee : records}, {upsert: true}).exec();
        });

    res.send({status: 'success', message: 'Watcher updated!'});
});

app.get('/api/watcher', (req, res) => {
    var  { hash } = req.query;
    
    Watcher
        .findOne({hash: hash}, (error, watcher) => { 
            if (watcher) {
                let ids = watcher.emploee;
                Emploee
                    .find()
                    .where('_id')
                    .in(ids)
                    .exec((err, records) => {
                        res.send(records);        
                    });
                return;
            }
            res.send([]);
        });
});


app.get('/api/progress', (req, res) => {
    Emploee.find().exec((err, emploees) => {
        res.send(emploees);
    });
});

app.get('/api/scrap', (req, res) => {
    reqeust('https://infograph.venngage.com/rest/multipage/load_page/3070e415-383e-4d64-8b72-770064d31a81?access_token=xj9Qvewc3w&access_token_type=public&_=1527883445411', (error, response, body) => {
        if ( ! error) {
            let json = JSON.parse(body),
                attach = {};
            
            Emploee.find({}, function(error, emploee) {
                emploee.map(i => attach[i.index] = i.name);

                const { order, widget_list } = json.payload;
            
                widget_list
                    .filter(i => i.data.settings.general.shape_fill && i.data.settings.general.shape_fill.value != 100)
                    .map((value, index) => {
                        return {name: attach[index], progress: value.data.settings.general.shape_fill.value, index: index }
                    }).map((e) => {
                        Emploee.findOne({index: e.index}, function(err, emp) {
                            if ( ! err && emp) {

                                if (emp.progress != e.progress) {
                                    
                                    Watcher.find().exec((err, watchers) => {
                                        watchers.filter(w => w.emploee.indexOf(emp._id) + 1).map(w => {
                                            
                                            var client = new OneSignal.Client({
                                                userAuthKey: 'N2E4ZDdkZGEtZDRhMS00ZWI4LWIyN2MtNGI5N2MxY2QwNmI2',
                                                app: { appAuthKey: 'N2E4ZDdkZGEtZDRhMS00ZWI4LWIyN2MtNGI5N2MxY2QwNmI2', appId: '97c99300-b91a-4549-839c-4cfaa3074e4b' }
                                            });
                                            
                                            var firstNotification = new OneSignal.Notification({
                                                contents: {
                                                    en: "Progress changed!"
                                                }
                                            });
                                            
                                            firstNotification.setTargetDevices([w.hash]);
                                            
                                            client.sendNotification(firstNotification, function (err, httpResponse,data) {
                                               if (err) {
                                                   console.log('Something went wrong...');
                                               } else {
                                                   console.log(data);
                                               }
                                            });
                                        });
                                    });
                                }

                                emp.progress = e.progress;
                                emp.save();
                            }
                        });
                    });
                res.send({status: 'ok', message: 'scrap'});
            });
        }
    });
});

app.listen(3000)