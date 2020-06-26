const rp = require('request-promise');
const $ = require('cheerio');
const ms = require('ms');
const url = 'https://www.worldometers.info/coronavirus/?';
const phurl = 'https://www.worldometers.info/coronavirus/country/philippines/';
const { MessageEmbed } = require('discord.js');
const colors = require("../../colors.json");
const { addCommas } = require("../../functions.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "covid",
    aliases: ["ctracker"],
    category:"info",
    usage: ["<prefix>command here"],
    run: async(bot, message, args)=> {

        if (!message.mentions.channels.first()) {
            message.reply('Please provide a channel tag!');
            return;
        }

        if (message.mentions.channels.first() && !args[1]) {
            message.reply('Please provide a specific time!');
            return;
        }


        const regex = /(\d+)/g;
        const regexTime = /[apm]/g;
        let HrsMins = await args[1].match(regex);
        const AmPm = await args[1].match(regexTime);
        const channelName = message.mentions.channels.first();
        const channel = bot.channels.cache.find(c => c.id === channelName.id);

        message.react('👌');
        message.delete({timeout: 5000, reason: 'it had to be done'});
        let hrs = parseInt(HrsMins[0]);
        let mins = parseInt(HrsMins[1]);

        if (AmPm[0] === 'p' && AmPm[1] === 'm') {
            if (hrs === 12) {
                hrs = 12;
            }
            else{
                hrs += 12;
            }
        }

        if (AmPm[0] === 'a' && AmPm[1] === 'm') {
            if (hrs === 12) {
                hrs = 0;
            }
            else{
                hrs = parseInt(hrs);
            }
        }

        setInterval(function(){

            let date = new Date();
            // message.channel.send(`${hrs}:${mins}`);
            if (date.getHours() === hrs && date.getMinutes() === mins) {

                let title = [];
                let data = [];
                const embed = new MessageEmbed();

                rp(url)
                .then(function(html){
                    //success!
                    $('h1',html).each(function(i , elem){
                        title[i] = $(this).text();
                    });
                    $('.maincounter-number',html).each(function(i , elem){
                        data[i] = $(this).text();
                    });

                    let allCases = parseInt(data[0].replace(/,/g, ''));
                    let deaths = parseInt(data[1].replace(/,/g, ''));
                    let recovered = parseInt(data[2].replace(/,/g, ''));
                    let ActiveCases = allCases - deaths - recovered;

                    embed
                        .setTitle( `
                        ┌─────────── ∘°❉°∘ ────────────┐
                                **Corona Tracker**
└─────────── °∘❉∘° ────────────┘`)
                        .setDescription('🌎 **Worldwide**\n')
                        .addFields(

                            { name: `🦠 Confirmed Cases:`, value: `**${data[0].trim()}**`, inline: true },
                            { name: `🤒 Active Cases:`, value: `**${addCommas(ActiveCases)}**`, inline: true },
                            { name: `☠️ Deaths:`, value: `**${data[1].trim()}**`, inline: true },
                            { name: `💕Recovered:`, value: `**${data[2].trim()}**`, inline: true },
                            { name: '\u2800' , value: `✩｡:*•.────────────  ❁ ❁  ─────────────.•*:｡✩` }

                        )
                        .setColor(colors.Covid)
                        .setTimestamp();

                        channel.startTyping();
                    // console.log(title[0]);
                    // console.log(data[0]);
                })
                .catch(function(err){
                    //handle error
                    console.log(err);
                })
                .finally(function(){

                    rp(phurl)
                    .then(function(html){
                        //success!

                        $('h1',html).each(function(i , elem){
                            title[i] = $(this).text();
                        });

                        $('.maincounter-number',html).each(function(i , elem){
                            data[i] = $(this).text();
                        });

                        let allCases = parseInt(data[0].replace(/,/g, ''));
                        let deaths = parseInt(data[1].replace(/,/g, ''));
                        let recovered = parseInt(data[2].replace(/,/g, ''));
                        let ActiveCases = allCases - deaths - recovered;

                        embed
                        .addFields(

                            { name: `\u2800`, value: `:flag_ph: **${title[0].trim()}**` },
                            { name: `🦠 Confirmed Cases:`, value: `**${data[0].trim()}**`, inline: true },
                            { name: `🤒 Active Cases:`, value: `**${addCommas(ActiveCases)}**`, inline: true },
                            { name: `☠️ Deaths:`, value: `**${data[1].trim()}**`, inline: true },
                            { name: `💕Recovered:`, value: `**${data[2].trim()}**`, inline: true }

                        );
                        channel.send(embed);
                        channel.stopTyping();
                    })
                    .catch(function(err){
                        //handle error
                        console.log(err);
                    });


                });

                return;
            }else {
                return;
            }

        }, ms('1m'));
        //end of setIterval
    }

};

