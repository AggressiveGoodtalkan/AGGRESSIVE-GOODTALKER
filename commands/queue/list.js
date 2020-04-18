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
           
           message.channel.send("The GOOD PAKING List:\n")

           for (let index = 0; index < bot.queue.length; index++) {
               message.channel.send(`${index + 1}. ${bot.queue[index]}`);
               
           }
           message.delete({timeout: 5000, reason:"It had to be done"})
        
        }
       
    }
}