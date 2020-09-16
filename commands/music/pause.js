module.exports = {
    name: 'pause',
    aliases: [""],
    category: "music",
    description: "",
    usage: [`\`-<command | alias> \``],
    run: async (bot, message, args) => {

        let server = await bot.servers[message.guild.id];

        if (server.dispatcher) {
            server.dispatcher.pause();
        }
    }

};
