const { getMember } = require('../../functions.js');
const { stripIndents } = require('common-tags');
module.exports = {
    name: "next",
    aliases: ["susunod"],
    category: "queue",
    description: "Moves the queue to the next performer",
    usage: [`\`-<command | alias>\``],
    run: async(bot, message, args)=>{

        const role = message.guild.roles.cache.find(role => role.name === "Performer");
        const dj = message.guild.roles.cache.find(role => role.name === "Queue Master");
        const member = getMember(message, args.join(" "));

        if (bot.queue.length === 0 && message.author !== bot.queue[0]) {
            message.reply("The queue is paking empty! Go and add more people!")
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 5000, reason:"It had to be done"});
            return;
        }
        else if (member.roles.cache.has(role.id) || member.roles.cache.has(dj.id)){

            const performer = bot.queue[1];

            if (bot.queue.length === 1) {
                message.channel.send(`👏 **Thank you for your BEAUTIFUL PAKING PERFORMANCE ${bot.queue[0]}! There are no more people in the queue!**`)
                .then(member.roles.remove(role));
                bot.queue.shift();

            }
            else if (bot.queue.length > 1) {
                message.channel.send(stripIndents `👏 **Thank you for your BEAUTIFUL PAKING PERFORMANCE ${bot.queue[0]}!
                Next up is none other than ${performer}! 👏👏👏**`)
                .then(member.roles.remove(role)).then(performer.roles.add(role));
                bot.queue.shift();

            }

        }
        else{
            message.reply(`🛑 **You are currently not performing, please wait for the performer to finish or contact someone with the ${dj.name} role to fix the queue.**`)
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 5000, reason:"It had to be done"});
        }

    }
};
