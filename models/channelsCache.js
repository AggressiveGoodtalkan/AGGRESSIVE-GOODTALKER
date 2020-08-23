const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelsCache = new Schema({
    channelID: String,
    name: String,
    ownerID: String
});

module.exports = mongoose.model("channelCache", channelsCache);
