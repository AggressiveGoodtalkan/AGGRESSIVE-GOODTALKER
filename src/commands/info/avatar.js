const colors = require("../../colors.json");
const { MessageEmbed } = require("discord.js");
const { getMember } = require("../../functions.js");

module.exports = {
    name: "avatar",
    aliases: ["me", "about"],
    category:"info",
    description: "Gives your avatar or the avatar of another user",
    usage: `\`-<command | alias> [@user]\``,
    run: async (bot, message, args) => {
        const member = getMember(message, args.join(" "));

        // Member variables
        const embed = new MessageEmbed()
            .setTitle(`${member.user.tag}`)
            .setDescription(`**[Avatar URL](${member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 256 })})**`)
            .setImage(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 256 }))
            .setColor(colors.Black);

        message.channel.send(embed);
    }

};
