const rp = require("request-promise");
const $ = require("cheerio");
const schedule = require("node-schedule");
const url = "https://www.worldometers.info/coronavirus/?";
const phurl = "https://www.worldometers.info/coronavirus/country/philippines/";
const { MessageEmbed } = require("discord.js");
const colors = require("../../colors.json");
const { addCommas } = require("../../functions.js");
let nextDates = 0;
let hrs = 0;
let mins = 0;
let channel;

module.exports = {
    name: "covid",
    aliases: ["ctracker"],
    category: "info",
    description: "Sends a message about the current status of COVID-19",
    usage: ["-<command | alias>"],
    run: async (bot, message, args) => {
        const guild = bot.guilds.cache.get("694810450621366282");
        const channel = guild.channels.cache.find(c => c.name === 'corona-updates');

        let title = [];
        let data = [];
        const embed = new MessageEmbed();

        message.react('👌');
        rp(url)
            .then(function (html) {
                let allCases = 0;
                let deaths = 0;
                let recovered = 0;
                let ActiveCases = 0;

                //success!
                $("h1", html).each(function (i, elem) {
                    title[i] = $(this).text();
                });
                $(".maincounter-number", html).each(function (i, elem) {
                    data[i] = $(this).text();
                });

                allCases = parseInt(data[0].replace(/,/g, ""));
                deaths = parseInt(data[1].replace(/,/g, ""));
                recovered = parseInt(data[2].replace(/,/g, ""));
                ActiveCases = allCases - deaths - recovered;

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
                            value: `**${data[0].trim()}**`,
                            inline: true,
                        },
                        {
                            name: `🤒 Active Cases:`,
                            value: `**${addCommas(ActiveCases)}**`,
                            inline: true,
                        },
                        {
                            name: `☠️ Deaths:`,
                            value: `**${data[1].trim()}**`,
                            inline: true,
                        },
                        {
                            name: `💕 Recovered:`,
                            value: `**${data[2].trim()}**`,
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

                channel.startTyping();
            })
            .catch(function (err) {
                //handle error
                console.log(err);
            })
            .finally(function () {
                rp(phurl)
                    .then(async function (html) {
                        let allCases = 0;
                        let deaths = 0;
                        let recovered = 0;
                        let ActiveCases = 0;

                        //success!
                        $("h1", html).each(function (i, elem) {
                            title[i] = $(this).text();
                        });

                        $(".maincounter-number", html).each(function (i, elem) {
                            data[i] = $(this).text();
                        });

                        allCases = parseInt(data[0].replace(/,/g, ""));
                        deaths = parseInt(data[1].replace(/,/g, ""));
                        recovered = parseInt(data[2].replace(/,/g, ""));
                        ActiveCases = allCases - deaths - recovered;

                        embed.addFields(
                            {
                                name: `\u2800`,
                                value: `:flag_ph: **${title[0].trim()}**`,
                            },
                            {
                                name: `🦠 Confirmed Cases:`,
                                value: `**${data[0].trim()}**`,
                                inline: true,
                            },
                            {
                                name: `🤒 Active Cases:`,
                                value: `**${addCommas(ActiveCases)}**`,
                                inline: true,
                            },
                            {
                                name: `☠️ Deaths:`,
                                value: `**${data[1].trim()}**`,
                                inline: true,
                            },
                            {
                                name: `💕 Recovered:`,
                                value: `**${data[2].trim()}**`,
                                inline: true,
                            }
                        );
                        await channel.send(embed);
                        channel.stopTyping();
                        message.delete();
                    })
                    .catch(function (err) {
                        //handle error
                        console.log(err);
                    });
            });
    },
};
