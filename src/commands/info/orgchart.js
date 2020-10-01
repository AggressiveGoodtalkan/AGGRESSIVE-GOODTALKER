const colors = require("../../colors.json");
const { stripIndents } = require("common-tags");
const Discord = require("discord.js");

module.exports = {
    name: "orgchart",
    aliases: ["oc", "org"],
    category: "info",
    description: "Displays the Information of the Server",
    usage: `\`-<command | alias>\``,
    run: async (bot, message, args) => {
        //const member = getMember(message, args.join(" "));

        const president = message.guild.roles.cache.find(role => role.name === "President").members.map((m) => m);
        const vpExt = message.guild.roles.cache.find(role => role.name === "VP Ext").members.map((m) => m);
        const vpInt = message.guild.roles.cache.find(role => role.name === "VP Int").members.map((m) => m);
        const mmmDep = message.guild.roles.cache.find(role => role.name === "MMM Dept. Head").members.map((m) => m);
        const techDev = message.guild.roles.cache.find(role => role.name === "Tech Dev Dept. Head").members.map((m) => m);
        const memberAffairs = message.guild.roles.cache.find(role => role.name === "Member Affairs Dept. Head").members.map((m) => m);

        const createdAt = new Date(message.createdAt);
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };

        let sEmbed = new Discord.MessageEmbed()
            .setColor(colors.Dark_Pastel_Blue)
            .setTitle(`${message.guild.name}'s Organization Chart`)
            .setThumbnail(bot.user.displayAvatarURL())
            .addFields(
                {
                    name: "President:",
                    value: president,
                    inline: true
                },
                {
                    name: "VP External:",
                    value: vpExt,
                    inline: true
                },
                {
                    name: "VP Internal:",
                    value: vpInt,
                    inline: true
                },
                {
                    name: "✩｡:*•.────────────  ❁ ❁  ─────────────.•*:｡✩",
                    value: "\u2800",
                },
                {
                    name: "MMM Dept Head:",
                    value: mmmDep,
                    inline: true
                },
                {
                    name: "Tech Dev Head:",
                    value: techDev,
                    inline: true
                },
                {
                    name: "Member Affairs Head:",
                    value: memberAffairs,
                    inline: true
                },

            )
            .setTimestamp()
            .setFooter(
                `AGGRESSIVE GOODTALKER | By MahoMuri`,
                bot.user.displayAvatarURL()
            );
        await message.channel.send(sEmbed);
        message.delete();
    },
};
