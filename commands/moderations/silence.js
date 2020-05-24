const ms = require('ms');

module.exports = {
    name: "silence",
    category: "moderations",
    description: "silences the member",
    usage: "<id | mention>",
    run: async (bot, message, args) => {

        if (message.deletable) {
            message.delete();
        }

        // No args
        if (!args[0]) {
            return message.reply("Please provide a person to silence.")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        // No author permissions
        if (!message.member.hasPermission("MUTE_MEMBERS")) {
            return message.reply("❌ You do not have permissions to silence members. Please contact a staff member")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));

        }
        // No bot permissions
        if (!message.guild.me.hasPermission("MUTE_MEMBERS")) {
            return message.reply("❌ I do not have permissions to silence members. Please contact a staff member")
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
            return message.reply("You can't silence yourself...")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        let silenced = message.guild.roles.cache.find(role => role.name === "Global Silencer");
        let role = message.guild.roles.cache.find(role => role.name === "Member");
        if (!silenced) {
            try {
                silenced = await message.guild.roles.create({
                    data: {
                        name: 'Global Silencer',
                        color: 'RED',
                        permissions: []
                    }
                });
            } catch (e) {
                console.log(e.stack);
            }
        }

        let timer = '1d';

        await toMute.roles.remove(role);
        await toMute.roles.add(silenced);
        message.channel.send(`Successfuly silenced ${args[0]} for ${ms(ms(timer))}!`).then(m => m.delete({timeout: 15000, reason :"It had to be done."}));

        setTimeout(function(){
            toMute.roles.remove(silenced);
            message.channel.send(`${toMute} has been successfully unmuted!`).then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }, ms(timer));

    }
};
