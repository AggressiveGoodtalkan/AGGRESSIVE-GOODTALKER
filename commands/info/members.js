const botconfig = require("../../botconfig.json");
const colors = require("../../colors.json");
const { stripIndents } = require("common-tags");
const Discord = require('discord.js');
const { getMember, formatDate } = require("../../functions.js");


module.exports = {
  name: "members",
  aliases: ["mmbrs", "count"],
  category:"info",
  usage: "[command | alias]",
  run: async (bot, message, args) => {

    let sEmbed = new Discord.MessageEmbed()
    .setColor(colors.Thisle)
    .setTitle("Member Count")
    .setThumbnail(bot.user.displayAvatarURL())
    .setAuthor(`${message.guild.name}`, bot.user.displayAvatarURL())
    .addField('Server information:', stripIndents
    `**Member Count:** ${message.guild.memberCount}`, true)

  //.setImage('https://i.imgur.com/8jpHYlr.jpg')
    .setTimestamp()
    .setFooter(`AGGRESSIVE GOODTALKER | Footer`, bot.user.displayAvatarURL());
    message.channel.send(sEmbed);

  }

}