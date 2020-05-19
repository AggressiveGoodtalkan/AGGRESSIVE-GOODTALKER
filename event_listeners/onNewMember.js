/**
 * @file guildMemberAdd listener
 */

const { MessageEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const colors = require(`${__dirname}/../colors.json`);

module.exports = bot => {
    bot.on('guildMemberAdd', async member => {
        const rules = bot.channels.cache.get('694810450637881348');
        const embed = new MessageEmbed()
            .setTitle("Welcome to the AGGRESSIVE GOODTALKAN Server!")
            .setColor(colors.Green_Sheen)
            .addField("**How to enter the server:**", stripIndents`**1.** Please make sure to read the ${rules} first!
          **2.** Then, react "✅" to the ${rules} message then I will tell you how to enter the server!`, true);

        member.user.send(embed);

    });
};
