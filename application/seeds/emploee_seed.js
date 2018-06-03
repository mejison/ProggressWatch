const Emploee = require('../models/emploee');
const data = [
    {name: 'Vladislav Boychenko', index: 0, progress: 0},
    {name: 'Vitaliy Baychura', index: 1, progress: 0},
    {name: 'Julian Beletskyy', index: 3, progress: 0},
    {name: 'Ilya Petriv', index: 4, progress: 0},
    {name: 'Denys Horbachevskyi', index: 5, progress: 0},
    {name: 'Olexandr Kovalchuk', index: 6, progress: 0},
];

module.exports = () => {
    data.map((i) => {
        new Emploee({name: i.name, index: i.index, progress: i.progress}).save();
    })
}