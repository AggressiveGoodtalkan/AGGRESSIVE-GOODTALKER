const superagent = require("superagent")
const botconfig = require("../../botconfig.json");
const colors = require("../../colors.json");
const Discord = require('discord.js');

module.exports = {
  name: "dog",
  aliases: ["bark", "howl"],
  category:"entertainment",
  usage: ["<prefix>command here"],
  run: async (bot, message, args) => {
 
    let nsg = await message.channel.send("Generating...")

    let {body} = await superagent
    .get('https://dog.ceo/api/breeds/image/random')
    //console.log(body.file)
    if(!{body}) return message.channel.send ("My processors didn't cooperate with me, Please Try again.")

        let dEmbed = new Discord.MessageEmbed()
        .setColor(colors.Wild_Blue_Yonder)
        .setAuthor(`HAVE SOME DOGS YOU BEAUTIFUL SLAP SOILS!!!`, message.guild.iconURL)
        .setImage(body.message)
        .setTimestamp()
        .setFooter(`AGGRESSIVE GOODTALKER | By MahoMuri`, bot.user.displayAvatarURL());
    
    message.channel.send(dEmbed);
    nsg.delete();
  }
}
