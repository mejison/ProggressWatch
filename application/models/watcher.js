const mongoose = require('mongoose');

var watchersSchema = mongoose.Schema({
    name: String,
    signal_id: String,
});

module.exports = mongoose.model('Watcher', watchersSchema);