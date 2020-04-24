const superagent = require("superagent")
const botconfig = require("../../botconfig.json");
const colors = require("../../colors.json");
const Discord = require('discord.js');

module.exports = {
    name: "cat",
    aliases: ["meow", "purr"],
    category:"entertainment",
    usage: ["<prefix>command here"],
    run: async(bot, message, args)=>{
        let nsg = await message.channel.send("Generating...")

        let {body} = await superagent
        .get('http://aws.random.cat/meow')
        //console.log(body.file)
        if(!{body}) return message.channel.send ("My processors didn't cooperate wiht me, Please Try again.")

            let cEmbed = new Discord.MessageEmbed()
            .setColor(colors.Pastel_Violet)
            .setAuthor(`HAVE SOME CATS YOU BEAUTIFUL SLAP SOILS!!!`, message.guild.iconURL)
            .setImage(body.file)
            .setTimestamp()
            .setFooter(`AGGRESSIVE GOODTALKER | By MahoMuri`, bot.user.displayAvatarURL());
    
         message.channel.send(cEmbed);
        nsg.delete();
    }
}
