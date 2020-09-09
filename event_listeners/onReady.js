/**
 * @file ready listener
 */
const ms = require('ms');
const mongoose = require('mongoose');
const muteTimers = require('../models/timers.js');
const { stripIndents } = require("common-tags");
const { unmute } = require("../functions.js");

module.exports = bot => {
    let statuses = [
        "laugh at your problems, everybody else does.",
        "worrying works! 90% of the things I worry about never happen.",
        "I thought I wanted a career, turns out I just wanted paychecks.",
        "never get into fights with ugly people, they have nothing to lose.",
        "artificial intelligence is no match for natural stupidity.",
        "the longer the title the less important the job.",
        "just remember…if the world didn’t suck, we’d all fall off.",
        "if I agreed with you we’d both be wrong.",
        "eat right, exercise, die anyway.",
        "I may be fat, but you’re ugly – I can lose weight!",
        "without ME, it’s just AWESO.",
        "-help | with you"
    ];
    bot.on('ready', async () => {

        await mongoose.connect(process.env.TIMERSURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).catch(err => console.log("Error on mute.js\n",err));

        const logChannel = await bot.channels.cache.get('710795359844171797');
        const logMsg = `✅ ${bot.user.username} is online on ${bot.guilds.cache.size} server${bot.guilds.cache.size > 1 ? 's' : ''}!`;

        console.log(logMsg);
        logChannel.send(logMsg)
        .catch(err => console.log(err));

        bot.user.setActivity("-help | with you", {
            type: "PLAYING"

        }).then(() => {
            setInterval(function() {
            let status = statuses[Math.floor(Math.random() * statuses.length)];

            bot.user.setActivity( status, {
                    type: "PLAYING"

                });

            }, ms('10m'));
        });

        //setTimeout checker
        const date = new Date();
        Date.prototype.subMillisecs= function(s) {
            this.setMilliseconds(s-this.getMilliseconds());
            return this;
        };

        const cursor = await muteTimers.find({ isMuted: true }).cursor();
        // let temporaryArray = [];
        for (let doc = await cursor.next(); doc !== null; doc = await cursor.next()) {
            // console.log(doc); // Prints documents one at a time
            const channelID = doc.channelID;
            const guild = bot.guilds.cache.get(doc.guildID);
            const member = guild.member(doc.userID);
            const muted = guild.roles.cache.find(role => role.name === "tuporsiksOwan");
            const channel = guild.channels.cache.find(channel => channel.id === channelID);
            // temporaryArray.push(doc);
            if (doc.time === null) {
                console.log('null');
                return;

            }else if (doc.time.getTime() <= date.getTime()) {
                console.log('true');
                console.log(doc);
                member.roles.remove(muted).then(member => {
                    member.send(stripIndents `**${member}**, 🔊 You have been unmuted!`);
                });
                channel.send(`🔊 Unmuted \`${member.user.tag}\``);
            }else if (doc.time.getTime() >= date.getTime()) {
                console.log('false');
                console.log(doc);
                const timer = doc.time.getTime() - date.getTime();
                // console.log(timer);
                unmute(member, channel, muted,timer);
                console.log("function called!");
            }
        }


        // //console.log(temporaryArray[0].timer);




    });
};
