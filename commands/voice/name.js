module.exports = {
    name: 'voice name',
    aliases: ["vname"],
    category: "voice",
    description: "Changes the name of your voice channel.",
    usage: [`\`-<command | alias> <name of voice channel>\``],
    run: async (bot, message, args) => {

        if (message.member.voice.channel) {
            const guild = bot.guilds.cache.get(message.guild.id);
            const channel = guild.channels.cache.find(c => c.id === bot.channelsChace.channelID);

        } else if (!message.member.voice.channel) {
            return message.channel.send("**You need to be in a voice channel first!**");
        } else if (message.author.id !== bot.channelsChace.owner){
            return message.channel.send("**You're not the owner of this channel!**");
        }



    }

};
