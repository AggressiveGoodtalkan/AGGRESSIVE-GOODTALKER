const colors = require("../../colors.json");
const { stripIndents } = require("common-tags");
const Discord = require('discord.js');


module.exports = {
  name: "members",
  aliases: ["mmbrs", "count"],
  category:"info",
  description: "Displays the total number of members in the server. (Including bots)",
  usage: `\`-<command | alias>\``,
  run: async (bot, message, args) => {

    let sEmbed = new Discord.MessageEmbed()
    .setColor(colors.Thisle)
    .setTitle("Member Count")
    .setThumbnail(bot.user.displayAvatarURL())
    .setAuthor(`${message.guild.name}`, bot.user.displayAvatarURL())
    .addField('Server information:', stripIndents    `**Member Count:** ${message.guild.memberCount}`, true)
    .setTimestamp()
    .setFooter(`AGGRESSIVE GOODTALKER | by MahoMuri`, bot.user.displayAvatarURL());
    message.channel.send(sEmbed);
    //.setImage('https://i.imgur.com/8jpHYlr.jpg')

  }

};
