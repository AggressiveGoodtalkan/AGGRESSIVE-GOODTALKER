const { MessageEmbed } = require('discord.js');
const colors = require('../../colors.json');

module.exports = {
    name: "list",
    aliases: ["listahan"],
    category:"queue",
    description: "Displays the list of the queue",
    usage: [`\`-<command | alias>\``],
    run: async(bot, message, args)=>{

        if (bot.queue.length === 0) {
            message.reply("🙁 **The queue is paking empty! Go and add more people!**")
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 5000, reason:"It had to be done"});
            return;
        }

        const role = message.guild.roles.cache.find(role => role.name === "Performer");
        // const member = bot.guilds.cache.get(message.guild.id).member(bot.queue[0]);
        const performer = bot.queue[0].roles.cache.has(role.id);

        if (bot.queue.length > 0) {

            let queueList = [];
            for (let i = 0; i < bot.queue.length; i++) {

                if (queueList.length === 0 && performer) {
                    queueList = `${i + 1}. ${bot.queue[i]}  ➡  (Currently Performing)\n\n`;
                }
                else {
                    queueList = queueList + `${i + 1}. ${bot.queue[i]}\n\n`;
                }
            }

            let lEmbed = new MessageEmbed()
                .setColor(colors.Green_Sheen)
                .setTitle("**THE GOOD PAKING LIST**")
                .setDescription(queueList)
                .setTimestamp()
                .setFooter(`${bot.user.username} | By MahoMuri`, bot.user.displayAvatarURL());

            message.channel.send(lEmbed);

            message.delete({timeout: 5000, reason:"It had to be done"});
        }

    }
};
