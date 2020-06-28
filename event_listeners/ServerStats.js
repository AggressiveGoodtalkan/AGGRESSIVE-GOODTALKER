let stats = {
    total: "726701574541279323",
    members: "726701677679214712",
    channels: "726702004076019722",
    roles: "726702050725068821",
    bots: "726702086494093352"

};

module.exports = bot => {

    //New members
    bot.on('guildMemberAdd', member => {
        bot.channels.cache.get(stats.total).setName(`Total Users: ${member.guild.memberCount}`);
        bot.channels.cache.get(stats.members).setName(`Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
        bot.channels.cache.get(stats.bots).setName(`Bot Count: ${member.guild.members.cache.filter(m => m.user.bot).size}`);
    });

    //Leaving members
    bot.on('guildMemberRemove', member => {
        bot.channels.cache.get(stats.total).setName(`Total Users: ${member.guild.memberCount}`);
        bot.channels.cache.get(stats.members).setName(`Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
        bot.channels.cache.get(stats.bots).setName(`Bot Count: ${member.guild.members.cache.filter(m => m.user.bot).size}`);
    });

    //New channels
    bot.on('channelCreate', channel => {
        const guild = bot.guilds.cache.get('694810450621366282');
        bot.channels.cache.get(stats.channels).setName(`Channel Count: ${guild.channels.cache.size}`);
    });

    //Deleted channels
    bot.on('channelDelete', channel => {
        const guild = bot.guilds.cache.get('694810450621366282');
        bot.channels.cache.get(stats.channels).setName(`Channel Count: ${guild.channels.cache.size}`);
    });

    //New roles
    bot.on('roleCreate', role =>{
        const guild = bot.guilds.cache.get('694810450621366282');
        bot.channels.cache.get(stats.roles).setName(`Role Count: ${guild.roles.cache.size}`);
    });

    //Deleted roles
    bot.on('roleDelete', role =>{
        const guild = bot.guilds.cache.get('694810450621366282');
        bot.channels.cache.get(stats.roles).setName(`Role Count: ${guild.roles.cache.size}`);
    });

};
