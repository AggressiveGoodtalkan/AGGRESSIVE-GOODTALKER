const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "ban",
    category: "moderations",
    description: "Bans the member",
    usage: `\`-<command | alias> <@user> <reason>\``,
    run: async (bot, message, args) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === "kicks-and-bans") || message.channel;

        if (message.deletable) {
            message.delete();
        }

        // No args
        if (!args[0]) {
            return message.reply("Please provide a person to ban.")
                .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        // No reason
        if (!args[1]) {
            return message.reply("Please provide a reason to ban.")
                .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        // No author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ You do not have permissions to ban members. Please contact a staff member")
                .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));

        }
        // No bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ I do not have permissions to ban members. Please contact a staff member")
                .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toBan) {
            return message.reply("Couldn't find that member, try again")
                .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        // Can't ban urself
        if (toBan.id === message.author.id) {
            return message.reply("You can't ban yourself...")
                .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        // Check if the user's banable
        if (!toBan.bannable) {
            return message.reply("I can't ban that person due to role hierarchy, I suppose.")
                .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
        }

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()
            .setDescription(stripIndents`**> Baned member:** ${toBan} (${toBan.id})
            **> Baned by:** ${message.member} (${message.member.id})
            **> Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to ban ${toBan}?`);

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();
                message.channel.send(`Successfuly Banned ${args[0]}!`).then(m => m.delete({timeout: 15000, reason :"It had to be done."}));

                toBan.ban(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) {

                            return message.channel.send(`Well.... the ban didn't work out. Here's the error ${err}`);
                        }
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`ban canceled.`)
                    .then(m => m.delete(10000));
            }
        });
    }
};
