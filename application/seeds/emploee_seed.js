const Emploee = require('../models/emploee');
const data = [
    {name: 'Vladislav Boychenko', index: 0},
    {name: 'Vitaliy Baychura', index: 1},
    {name: 'Julian Beletskyy', index: 3},
    {name: 'Ilya Petriv', index: 4},
    {name: 'Denys Horbachevskyi', index: 5},
    {name: 'Olexandr Kovalchuk', index: 6},
];

module.exports = () => {
    data.map((i) => {
        new Emploee({name: i.name, index: i.index, watcher: []}).save();
    })
}