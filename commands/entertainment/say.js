const { MessageEmbed } = require("discord.js");
const colors = require("../../colors.json");

module.exports = {
    name: "say",
    aliases: ["bc", "broadcast"],
    description: "Says your input via the bot",
    category:"entertainment",
    usage: "<input>",
    run: (bot, message, args) => {
        message.delete();

        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.reply("You don't have the required permissions to use this command.").then(m => m.delete({timeout: 5000, reason :"It had to be done."}));

        if (args.length === 0)
            return message.reply("Nothing to say?").then(m => m.delete({timeout: 5000, reason :"It had to be done."}));

        
        if (args[0].toLowerCase() === "embed") {
            const embed = new MessageEmbed()
                .setDescription(args.slice(1).join(" "))
                .setColor(colors.Green_Sheen);

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}