const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var emploeeSchema = mongoose.Schema({
    name: String,
    index: Number
});

module.exports = mongoose.model('Emploee', emploeeSchema);