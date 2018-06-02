const express = require('express')
const app = express()
const reqeust = require('reqeust');


app.get('/', (req, res) => {
    reqeust('https://infograph.venngage.com/rest/multipage/load_page/3070e415-383e-4d64-8b72-770064d31a81?access_token=xj9Qvewc3w&access_token_type=public&_=1527883445411', (error, response, body) => {
        if ( ! error) {
            let json = JSON.parse(body),
            attach = {
                0: 'Vladislav Boychenko',
                1: 'Vitaliy Baychura',
                2: 'Scope',
                3: 'Julian Beletskyy',
                4: 'Ilya Petriv',
                5: 'Denys Horbachevskyi',
                6: 'Olexandr Kovalchuk'
            };
        
            const { order, widget_list } = json.payload;
            
            let result = widget_list
                .filter(i => i.data.settings.general.shape_fill && i.data.settings.general.shape_fill.value != 100)
                .map((value, index) => { return {[attach[index]] : value.data.settings.general.shape_fill.value} })
            
            res.send(result);
        }
    });
})

app.listen(3000)