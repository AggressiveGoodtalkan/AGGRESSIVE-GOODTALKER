const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const muteTimers = new Schema({
    guildID: String,
    userID: String,
    channelID: String,
    isMuted: Boolean,
    timeMuted: Date,
    timeUnmuted: Date,
    time: Date,
    timer: Number

});

module.exports = mongoose.model("muted_list", muteTimers);
