const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryCache = new Schema({
    channelID: String,
    parentID: String,
    name: String,
    isSetup: Boolean
});

module.exports = mongoose.model("categoryCache", categoryCache);
