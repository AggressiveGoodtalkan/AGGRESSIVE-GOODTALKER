const botconfig = require("../../botconfig.json");
const colors = require("../../colors.json");
const { stripIndents } = require("common-tags");
const Discord = require('discord.js');
const { getMember, formatDate } = require("../../functions.js");


module.exports = {
  name: "serverinfo",
  aliases: ["info", "aboutme"],
  category:"info",
  usage: "<prefix>[command | alias]",
  run: async (bot, message, args) => {
    //const member = getMember(message, args.join(" "));

    const admins = message.guild.roles.cache
    .get('694810450637881345').members
    .map(m => m.user.username).join(", ");

    let sEmbed = new Discord.MessageEmbed()
    .setColor(colors.Turquoise)
    .setTitle("Server Info")
    .setThumbnail(bot.user.displayAvatarURL())
    .setAuthor(`${message.guild.name}`, bot.user.displayAvatarURL())
    .addField('Server information:', stripIndents`**Display name:** ${message.guild.name}
    **Server Owner:** ${message.guild.owner}
    **Member Count:** ${message.guild.memberCount}
    **Admins:** ${admins} 
    **Role Count:** ${message.guild.roles.cache.size}
    **Created At:** ${message.guild.createdAt}`, true)
  //.setImage('https://i.imgur.com/8jpHYlr.jpg')
    .setTimestamp()
    .setFooter(`AGGRESSIVE GOODTALKER | Footer`, bot.user.displayAvatarURL());
    message.channel.send(sEmbed);

  }

}

