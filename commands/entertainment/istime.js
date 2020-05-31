const { MessageEmbed } = require("discord.js");
const colors = require("../../colors.json");

module.exports = {
    name: 'itstime',
    aliases: [''],
    description: "For baro ki'teer",
    usage: '<prefix>itstime',
    run: async (bot, message, args) => {

        const guild = bot.guilds.cache.get('694810450621366282');
        const baro = guild.roles.cache.get('699328742157320253');
        const announcement = guild.channels.cache.find(c => c.name === 'announcements');
        const barochat = guild.channels.cache.find(c => c.name === 'baro-ki-shiet');
        const programmer = guild.roles.cache.find(r => r.name === 'Programmer');

        if (!message.member.roles.cache.has(baro.id)) {
            return;
        }

        const embed = new MessageEmbed()
            .setTitle("Baro Ki'Teer has arrived!")
            .setDescription(`Head to ${barochat} now before time runs out!`)
            .setColor(colors.Beige)
            .setTimestamp()
            .setFooter(`AGGRESSIVE GOODTALKER | By MahoMuri`, bot.user.displayAvatarURL());
        announcement.send(embed);

    }
};
