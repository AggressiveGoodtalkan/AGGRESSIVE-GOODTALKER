const colors = require("../../colors.json");
const { MessageEmbed } = require("discord.js");
const { getMember } = require("../../functions.js");

module.exports = {
    name: "avatar",
    aliases: ["me", "about"],
    category:"info",
    usage: "<prefix>[command | alias]",
    run: async (bot, message, args) => {
        const member = getMember(message, args.join(" "));

        // Member variables
        const embed = new MessageEmbed()

            .setAuthor(`${member.user.tag}`)
            .setTitle('Avatar URL')
            .setURL(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 256 }))
            .setImage(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 256 }))
            .setColor(colors.Black);

        message.channel.send(embed);
    }

};
