const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var watchersSchema = mongoose.Schema({
    hash: String,
    emploee: [{ type: Schema.Types.ObjectId, ref: 'emploee' }]
});

module.exports = mongoose.model('Watcher', watchersSchema);