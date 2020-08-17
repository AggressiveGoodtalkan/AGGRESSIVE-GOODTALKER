const colors = require("../../colors.json");
const { stripIndents } = require("common-tags");
const Discord = require("discord.js");

module.exports = {
    name: "serverinfo",
    aliases: ["info", "aboutme"],
    category: "info",
    description: "Displays the Information of the Server",
    usage: `\`-<command | alias>\``,
    run: async (bot, message, args) => {
        //const member = getMember(message, args.join(" "));

        const admins = message.guild.roles.cache
            .get("694810450637881345")
            .members.map((m) => m)
            .sort();

        let adminList = [];

        for (let i = 0; i < admins.length; i++) {
            if (adminList.length === 0) {
                adminList = `${i + 1}. ${admins[i]}\n`;
            } else {
                adminList = adminList + `${i + 1}. ${admins[i]}\n`;
            }
        }

        const mods = message.guild.roles.cache
            .get("694810450621366291")
            .members.map((m) => m)
            .sort();

        let modList = [];

        for (let i = 0; i < mods.length; i++) {
            if (modList.length === 0) {
                modList = `${i + 1}. ${mods[i]}\n`;
            } else {
                modList = modList + `${i + 1}. ${mods[i]}\n`;
            }
        }

        const online = message.guild.members.cache.filter(
            (m) =>
                m.user.presence.status === "online" ||
                m.user.presence.status === "idle" ||
                m.user.presence.status === "dnd"
        );
        const bots = message.guild.members.cache.filter((m) => m.user.bot).size;
        const textChannel = message.guild.channels.cache.filter(
            (c) => c.type === "text"
        ).size;
        const voiceChannel = message.guild.channels.cache.filter(
            (c) => c.type === "voice"
        ).size;

        const createdAt = new Date(message.createdAt);
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };

        let sEmbed = new Discord.MessageEmbed()
            .setColor(colors.Turquoise)
            .setTitle(`Server Info for ${message.guild.name}`)
            .setThumbnail(bot.user.displayAvatarURL())
            .setAuthor(`${message.guild.name}`, bot.user.displayAvatarURL())
            .addFields(
                {
                    name: `**Users (Online/Total)**`,
                    value: `${online.size}/${message.guild.memberCount - bots}`,
                    inline: true,
                },
                {
                    name: ` **Created At:**`,
                    value: `${createdAt.toLocaleDateString("en-US", options)}`,
                    inline: true,
                },
                {
                    name: `**Voice/Text Channels**`,
                    value: `${voiceChannel}/${textChannel}`,
                    inline: true,
                },
                {
                    name: `**Server Owner:**`,
                    value: `${message.guild.owner.user.tag}`,
                    inline: true,
                },
                {
                    name: `**Region**`,
                    value: `${
                        message.guild.region[0].toUpperCase() +
                        message.guild.region.slice(1)
                    }`,
                    inline: true,
                },
                {
                    name: `**Role Count:**`,
                    value: `${message.guild.roles.cache.size}`,
                    inline: true,
                },
                {
                    name: `**Modmins:** `,
                    value: `${adminList}`,
                    inline: true
                },
                {
                    name: `**Mods:** `,
                    value: `${modList}`,
                    inline: true
                }
            )
            .setTimestamp()
            .setFooter(
                `AGGRESSIVE GOODTALKER | By MahoMuri`,
                bot.user.displayAvatarURL()
            );
        message.channel.send(sEmbed);
    },
};
