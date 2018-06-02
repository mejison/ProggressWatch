const mongoose = require('mongoose');

var emploeeSchema = mongoose.Schema({
    name: String,
    index: Number
});

module.exports = mongoose.model('Emploee', emploeeSchema);