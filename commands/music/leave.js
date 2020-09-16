module.exports = {
    name: 'leave',
    aliases: [""],
    category: "music",
    description: "",
    usage: [`\`-<command | alias> \``],
    run: async (bot, message, args) => {
        if (message.member.voice.channel) {
            message.member.voice.channel.leave();
            message.channel.send("**👋 Successfully Disconnected!**");
        }
        else{
            return message.channel.send("**❌ You're not in a voice channel!**");
        }
    }

};
