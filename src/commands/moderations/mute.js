const ms = require("ms");
const { stripIndents } = require("common-tags");
const { toSentenceCase } = require("../../functions.js");
const mongoose = require('mongoose');
const muteTimers = require('../../models/timers.js');

mongoose.connect(process.env.TIMERSURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).catch(err => console.log("Error on mute.js\n",err));

module.exports = {
    name: "mute",
    category: "moderations",
    description: "Mutes the member",
    usage: `\`-<command | alias> <time>\``,
    run: async (bot, message, args) => {


        // No args
        if (!args[0]) {
            return message.reply("Please provide a person to mute.")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        // No author permissions
        if (!message.member.hasPermission("MANAGE_ROLES")) {
            return message.reply("❌ You do not have permissions to mute members. Please contact a staff member")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));

        }
        // No bot permissions
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
            return message.reply("❌ I do not have permissions to mute members. Please contact a staff member")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        const toMute = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toMute) {
            return message.reply("Couldn't find that member, try again")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        // Can't ban urself
        if (toMute.id === message.author.id) {
            return message.reply("You can't mute yourself...")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        const position = message.guild.roles.cache.find(role => role.name === 'Member').position;
        let restrictedCategory = ["Server Stats","Welcome","Admin area", "BEHAVE YOURSELF"];
        let muted = message.guild.roles.cache.find(role => role.name === "tuporsiksOwan");
        if (!muted) {
            try {
                muted = await message.guild.roles.create({
                    data: {
                        name: 'tuporsiksOwan',
                        color: 'BLACK',
                        position: position + 1,
                        permissions: []
                    }
                });
                message.guild.channels.cache.forEach(async (channel) => {
                    if (channel.type === 'category') {
                        if (!restrictedCategory.includes(channel.name)) {
                            await channel.updateOverwrite(muted, {
                                'VIEW_CHANNEL': null,
                                'SEND_MESSAGES': false,
                                'ADD_REACTIONS': false,
                                'CONNECT': false,
                                'SPEAK': false
                            });
                        }
                    }

                    //message.reply(channel);
                });
            } catch (e) {
                console.log(e.stack);
            }
        }

        //If member is already muted
        if (toMute.roles.cache.has(muted.id)) {
            return message.channel.send(`\`${toMute.user.tag}\` is already muted, are you sure that's the right one?`);
        }

        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 'hour12': true };

        //If no time provided
        if (!args[1]) {

            await toMute.roles.add(muted).then(member => {

                let reason;
                //If no reason provided
                if (!args[2]) {
                    reason = "None Specified.";
                }else {
                    //If there is
                    reason = args.splice(2).join(" ");
                }
                member.send(stripIndents `**${member}**, 🔇 You have been muted!
                **Reason:** ${toSentenceCase(reason)}`);
            });

            muteTimers.findOne({ userID: toMute.id }, function (err, doc) {
                if (doc) {
                    doc.isMuted = true;
                    doc.save();
                    console.log(doc);
                } else {
                    const mutedMember = new muteTimers({
                        guildID: message.guild.id.toString(),
                        userID: toMute.id,
                        channelID: message.channel.id,
                        isMuted: true,
                        timeMuted: message.createdAt.toLocaleTimeString('en-PH', options),
                        timeUnmuted: null,
                        timer: null
                    });

                    mutedMember.save()
                    .then(item => {
                        console.log("✅ Successfully to the database!\n",item);
                    }).catch(err => {
                        console.log("❌ A Fatal Error occurred:\n",err);
                    });
                }

                if (err) {
                    console.log(err);
                }
            });

            message.channel.send(`🔇 Muted \`${toMute.user.tag}\` indefinitely!`);

        } else {

            //if time is provided.
            let timer = args[1];
            await toMute.roles.add(muted).then(member => {
                let reason;
                if (!args[2]) {
                    reason = "None Specified.";
                }else {
                    reason = args.splice(2).join(" ");
                }
                member.send(stripIndents `**${member}**, 🔇 You have been muted for ${ms(ms(timer), { long: true })}!
                **Reason:** ${toSentenceCase(reason)}`);
            });

            Date.prototype.addMillisecs= function(s) {
                this.setMilliseconds(this.getMilliseconds()+s);
                return this;
            };

            let time = new Date();
            // let document = await muteTimers.find({ userID: toMute.id});
            muteTimers.findOne({ userID: toMute.id }, function (err, doc) {
                if (doc) {
                    doc.isMuted = true;
                    doc.timeMuted = message.createdAt.toLocaleTimeString('en-PH', options);
                    doc.time = time.addMillisecs(ms(timer)).toLocaleTimeString('en-PH', options);
                    doc.timer = ms(timer);
                    doc.save();
                    console.log(doc);
                    console.log(doc.time.toLocaleTimeString('en-PH', options));
                } else {
                    const mutedMember = new muteTimers({
                        guildID: message.guild.id.toString(),
                        userID: toMute.id,
                        channelID: message.channel.id,
                        isMuted: true,
                        timeMuted: message.createdAt.toLocaleTimeString('en-PH', options),
                        timeUnmuted: null,
                        time: time.addMillisecs(ms(timer)).toLocaleTimeString('en-PH', options),
                        timer: ms(timer)
                    });

                    mutedMember.save()
                    .then(item => {
                        console.log("✅ Successfully to the database!\n",item);
                    }).catch(err => {
                        console.log("❌ A Fatal Error occurred:\n",err);
                    });
                }

                if (err) {
                    console.log(err);
                }
            });

            message.channel.send(`🔇 Muted \`${toMute.user.tag}\` for ${ms(ms(timer), { long: true })}!`)
            .then(() => {
                setTimeout(async function(){
                    toMute.roles.remove(muted).then(member => {
                        member.send(stripIndents `**${member}**, 🔊 You have been unmuted!`);
                    });
                    message.channel.send(`🔊 Unmuted \`${toMute.user.tag}\``);

                    let query = { userID: toMute.id };
                    let mongoOptions = { new: true };
                    const document = await muteTimers.findOneAndUpdate(query, {
                        isMuted: false,
                        timeUnmuted: Date(),
                        timer: null
                    }, mongoOptions);

                    console.log(document);
                }, ms(timer));
            });
        }

    }
};
