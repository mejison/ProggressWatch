const express = require('express')
const app = express()
const reqeust = require('reqeust');
const mongoose = require('mongoose');

app.use(express.static('public'));

/* mongoose db */
mongoose.connect('mongodb://mjs:knopka100@ds245680.mlab.com:45680/progress-watch');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
const Emploee = require('./application/models/emploee');
const emploee_seed = require('./application/seeds/emploee_seed');
//emploee_seed();
/* mongoose db */

app.put('/api/watcher', (req, res) => {
    
});

app.get('/api/progress', (req, res) => {
    reqeust('https://infograph.venngage.com/rest/multipage/load_page/3070e415-383e-4d64-8b72-770064d31a81?access_token=xj9Qvewc3w&access_token_type=public&_=1527883445411', (error, response, body) => {
        if ( ! error) {
            let json = JSON.parse(body),
                attach = {};
            
            Emploee.find({}, function(error, emploee) {
                emploee.map(i => attach[i.index] = i.name);

                const { order, widget_list } = json.payload;
            
                const result = widget_list
                    .filter(i => i.data.settings.general.shape_fill && i.data.settings.general.shape_fill.value != 100)
                    .map((value, index) => {
                        return { name: attach[index], progress: value.data.settings.general.shape_fill.value, index: index }
                    })
                res.send(result);
            });
        }
    });
})

app.listen(3000)