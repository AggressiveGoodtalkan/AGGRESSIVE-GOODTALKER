const { MessageEmbed, MessageManager } = require("discord.js");
const colors = require("../../colors.json");
const { stripIndents } = require("common-tags");

module.exports = {
    name: 'itstime',
    aliases: [''],
    description: "For baro ki'teer",
    category: "entertainment",
    usage: '<prefix>itstime',
    run: async (bot, message, args) => {

        const guild = bot.guilds.cache.get('694810450621366282');
        const baro = guild.roles.cache.get('699328742157320253');
        const announcement = guild.channels.cache.find(c => c.name === 'announcements');
        const barochat = guild.channels.cache.find(c => c.name === 'baro-ki-shiet');
        const programmer = guild.roles.cache.find(r => r.name === 'Programmer');
        const everyone = guild.roles.cache.find(r => r.id === '694810450621366282');


        if(message.member.roles.cache.has(baro.id) || message.guild.owner){
            const embed = new MessageEmbed()
            .setTitle("Baro Ki'Teer has arrived!")
            .setDescription(stripIndents`The wait is over tenno. I, Baro Ki'teer, have returned with more treasures from the Void.

            All Tenno of means are invited to pursue my latest treasures in the ${barochat} Text Channel on Earth.

            I Implore you not to hesitate, for, as always my visit will be brief and my items exquisite.

            Graciously,
            Baro Ki'Teer `)
            .setColor(colors.Beige)
            .setTimestamp()
            .setFooter(`AGGRESSIVE GOODTALKER | By MahoMuri`, bot.user.displayAvatarURL());
            await announcement.send(`**[ATTENTION]** ${everyone}`);
            announcement.send(embed);
        }
        else {

        }

    }
};
