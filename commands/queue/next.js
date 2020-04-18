const {getMember} = require('../../functions.js')

module.exports = {
    name: "next",
    aliases: ["susunod"],
    category:"queue",
    usage: ["<prefix>command here"],
    run: async(bot, message, args)=>{

        const role = message.guild.roles.cache.find(role => role.name === "Performer")
        const dj = message.guild.roles.cache.find(role => role.name === "DJ")
        const member = getMember(message, args.join(" "));
        
        if (bot.queue.length === 0 && message.author !== bot.queue[0]) {
            message.reply("The queue is paking empty! Go and add more people!")
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}))
            message.delete({timeout: 5000, reason:"It had to be done"});
            return;
        }
        else if (member.roles.cache.has(role.id) || member.roles.cache.has(dj.id)){
            bot.queue.shift();
            const performer = bot.guilds.cache.get('694810450621366282').member(bot.queue[0])
            
            if (bot.queue.length === 0) {
                message.channel.send(`Thank you for your BEAUTIFUL PAKING PERFORMANCE <@${message.author.id}>! There are no more people in the queue!`)
                .then(member.roles.remove(role)).then(m => m.delete({timeout: 5000, reason:"It had to be done"}))
                message.delete({timeout: 5000, reason:"It had to be done"})
                
            }
            else{
                message.channel.send(`Thank you for your BEAUTIFUL PAKING PERFORMANCE <@${message.author.id}>! Next up is ${bot.queue[0]}`)
                .then(member.roles.remove(role)).then(performer.roles.add(role)).then(m => m.delete({timeout: 5000, reason:"It had to be done"}))
                message.delete({timeout: 5000, reason:"It had to be done"})       
                
            }

        }
        else{
            message.reply("You are currently not performing, please wait for the performer to finish or contact someone with the DJ role to fix the queue.")
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}))
            message.delete({timeout: 5000, reason:"It had to be done"})
        }   
        
    }
}