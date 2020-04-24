const { MessageEmbed } = require('discord.js')
const colors = require('../../colors.json')

module.exports = {
    name: "list",
    aliases: ["listahan"],
    category:"queue",
    usage: ["<prefix>command here"],
    run: async(bot, message, args)=>{
       
        if (bot.queue.length === 0) {
            message.reply("The queue is paking empty! Go and add more people!")
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}))
            message.delete({timeout: 5000, reason:"It had to be done"});
        }

        if (bot.queue.length > 0) {
           
            let queueList;
            for (let i = 0; i < bot.queue.length; i++) {

                queueList = queueList + `${i + 1}. ${bot.queue[i].username}\n\n`;
            }

            let lEmbed = new MessageEmbed()
                .setColor(colors.Green_Sheen)
                .setTitle("**THE GOOD PAKING LIST**")
                .setDescription(queueList.slice(9))
                .setTimestamp()
                .setFooter("THE GOOD PAKING LIST | By MahoMuri")

            message.channel.send(lEmbed);

            message.delete({timeout: 5000, reason:"It had to be done"})
                  
        }
       
    }
}