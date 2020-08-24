const {getMember} = require('../../functions.js');

module.exports = {
    name: "begin",
    aliases: ["magsimula"],
    category:"queue",
    description: "Begins the queue",
    usage: [`\`-<command | alias>\``],
    run: async(bot, message, args)=>{

        const role = message.guild.roles.cache.find(role => role.name === "Performer");
        const dj = message.guild.roles.cache.find(role => role.name === "Queue Master");
        const member = getMember(message, args.join(" "));
        const performer = bot.queue[0];

        if (bot.queue.length === 0) {
            message.reply("🙁 **The queue is paking empty! We can't start with an empty list!**")
            .then(m => m.delete({timeout: 10000, reason:"It had to be done"}));
            message.delete({timeout: 10000, reason:"It had to be done"});
        }
        else if (bot.queue.length > 0 && member.roles.cache.has(dj.id)) {
            message.channel.send(`🎉 **Let's begin! For our first performer, give it up for ${performer}! 👏👏👏**`)
            .then(performer.roles.add(role)).then(m => m.delete({timeout: 10000, reason:"It had to be done"}));
            message.delete({timeout: 10000, reason:"It had to be done"});
        }
        else {
            message.reply(`🛑 **You don't have the ${dj.name} role!**`).then(m => m.delete({timeout: 10000, reason:"It had to be done"}));
            message.delete({timeout: 10000, reason:"It had to be done"});
        }
    }
};
