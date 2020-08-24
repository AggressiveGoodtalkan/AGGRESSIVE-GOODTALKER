const ms = require("ms");

module.exports = {
    name: "mute",
    category: "moderations",
    description: "Mutes the member",
    usage: `\`-<command | alias> <time>\``,
    run: async (bot, message, args) => {

        if (message.deletable) {
            message.delete();
        }

        // No args
        if (!args[0]) {
            return message.reply("Please provide a person to mute.")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please specify the time!")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        // No author permissions
        if (!message.member.hasPermission("MUTE_MEMBERS")) {
            return message.reply("❌ You do not have permissions to mute members. Please contact a staff member")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));

        }
        // No bot permissions
        if (!message.guild.me.hasPermission("MUTE_MEMBERS")) {
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
                        if (channel.name !== "Server Stats" && channel.name !== "Welcome" && channel.name !== "Admin area") {
                            await channel.updateOverwrite(muted, {
                                'VIEW_CHANNEL': true,
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

        let timer = args[1];
        const memberRole = message.guild.roles.cache.find(role => role.name === 'Member');
        await toMute.roles.add(muted).then(m => {
            m.roles.remove(memberRole);
        });
        message.channel.send(`Successfuly Muted ${toMute} for ${ms(ms(timer))}!`).then(m => m.delete({timeout: 15000, reason :"It had to be done."}));

        setTimeout(function(){
            toMute.roles.add(memberRole);
            toMute.roles.remove(muted);
            message.channel.send(`${toMute} has been successfully unmuted!`).then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }, ms(timer));

    }
};
