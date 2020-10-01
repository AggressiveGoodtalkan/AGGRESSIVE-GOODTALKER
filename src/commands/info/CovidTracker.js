const axios = require("axios").default;
const cheerio = require("cheerio");

const { MessageEmbed } = require("discord.js");
const colors = require("../../colors.json");
const { addCommas, intify } = require("../../functions.js");

/**
 * Where all the magic begins
 * @type {import("axios").AxiosInstance}
 */
const coronaStats = axios.create({
    baseURL: "https://www.worldometers.info/coronavirus",
    responseType: "document",
    timeout: 5000,
    transformResponse: [function(data) {
        return cheerio.load(data);
    }]
});

module.exports = {
    name: "covid",
    aliases: ["ctracker"],
    category: "info",
    description: "Sends a message about the current status of COVID-19",
    usage: ["-<command | alias>"],
    run: async (bot, message, args) => {
        const guild = bot.guilds.cache.get("694810450621366282");
        const channel = guild.channels.cache.find(c => c.name === 'corona-updates');

        let data = [];
        const embed = new MessageEmbed();

        message.react('👌');
        // Get global stats
        coronaStats.get("/?").then(
        (response) => {
            channel.startTyping();
            response.data(".maincounter-number").each(function(i) {
                data[i] = cheerio(this).text().trim();
            });
            const activeCases = intify(data[0]) - intify(data[1]) - intify(data[2]);

            embed
                .setTitle(
                    `
                    ┌─────────── ∘°❉°∘ ────────────┐
                            **Corona Tracker**
└─────────── °∘❉∘° ────────────┘`
                )
                .setDescription("🌎 **Worldwide**\n")
                .addFields(
                    {
                        name: `🦠 Confirmed Cases:`,
                        value: `**${data[0]}**`,
                        inline: true,
                    },
                    {
                        name: `🤒 Active Cases:`,
                        value: `**${addCommas(activeCases)}**`,
                        inline: true,
                    },
                    {
                        name: `☠️ Deaths:`,
                        value: `**${data[1]}**`,
                        inline: true,
                    },
                    {
                        name: `💕 Recovered:`,
                        value: `**${data[2]}**`,
                        inline: true,
                    },
                    {
                        name: "\u2800",
                        value: `✩｡:*•.────────────  ❁ ❁  ─────────────.•*:｡✩`,
                    }
                )
                .setColor(colors.Covid)
                .setTimestamp()
                .setFooter(
                    `AGGRESSIVE GOODTALKER | By MahoMuri`,
                    bot.user.displayAvatarURL()
                );
        },
        (err) => console.error(err))
        // Get local stats
        .finally(() => {
            coronaStats.get("/country/philippines").then(
                async (response) => {
                    response.data(".maincounter-number").each(function(i) {
                        data[i] = cheerio(this).text().trim();
                    });
                    const activeCases = intify(data[0]) - intify(data[1]) - intify(data[2]);
                    embed.addFields(
                        {
                            name: `\u2800`,
                            value: `:flag_ph: **Philippines**`,
                        },
                        {
                            name: `🦠 Confirmed Cases:`,
                            value: `**${data[0]}**`,
                            inline: true,
                        },
                        {
                            name: `🤒 Active Cases:`,
                            value: `**${addCommas(activeCases)}**`,
                            inline: true,
                        },
                        {
                            name: `☠️ Deaths:`,
                            value: `**${data[1]}**`,
                            inline: true,
                        },
                        {
                            name: `💕 Recovered:`,
                            value: `**${data[2]}**`,
                            inline: true,
                        }
                    );
                    await channel.send(embed);
                    channel.stopTyping();
                    message.delete();
                },
                (err) => console.error(err)
            );
        });
    }
};
