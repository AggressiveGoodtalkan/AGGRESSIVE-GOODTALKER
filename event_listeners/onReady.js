/**
 * @file ready listener
 */

module.exports = bot => {
    bot.on('ready', async () => {
        const logChannel = await bot.channels.cache.get('710795359844171797');
        const logMsg = `✅ ${bot.user.username} is online on ${bot.guilds.cache.size} server${bot.guilds.cache.size > 1 ? 's' : ''}!`;

        console.log(logMsg);
        logChannel.send(logMsg)
        .catch(err => console.log(err));
        bot.user.setActivity("AGGRESSIVELY | https://discord.gg/ptQ3RE9", {
            type: "STREAMING",
            url: "https://www.twitch.tv/aggressive_goodtalkan"
        });
    });
};
