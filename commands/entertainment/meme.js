const axios = require("axios");
const colors = require("../../colors.json");
const Discord = require('discord.js');

module.exports = {
    name: "meme",
    aliases: ["hitme"],
    category:"entertainment",
    description: "Displays a random meme",
    usage: [`\`-<command | alias>\``],
    run: async (bot, message, args) => {

    let nsg = await message.channel.send("Generating...");

    const { data } = await axios.get('https://some-random-api.ml/meme');
    //console.log(data.data.title, data.data.body, data.data.image);
    if(!{data}) {
        return message.channel.send ("My processors didn't cooperate wiht me, Please Try again.");
    }

        let mEmbed = new Discord.MessageEmbed()
        .setColor(colors.Beige)
        .setAuthor(`${data.caption}`, bot.user.displayAvatarURL())
        .setImage(data.image)
        .setTimestamp()
        .setFooter(`AGGRESSIVE GOODTALKER | By MahoMuri`, bot.user.displayAvatarURL());

    message.channel.send(mEmbed);
    nsg.delete();
    }
};

// module.exports.config = {
//     name: "meme",
//     aliases:["meme", "hitme"]
// }
