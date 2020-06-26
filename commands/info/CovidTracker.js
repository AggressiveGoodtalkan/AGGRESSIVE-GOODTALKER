const rp = require('request-promise');
const $ = require('cheerio');
const CronJob = require('cron').CronJob;
const url = 'https://www.worldometers.info/coronavirus/?';
const phurl = 'https://www.worldometers.info/coronavirus/country/philippines/';
const { MessageEmbed } = require('discord.js');
const colors = require("../../colors.json");
const { addCommas } = require("../../functions.js");
let nextDates = 0;
let hrs = 0;
let mins = 0;
let channel;


module.exports = {
    name: "covid",
    aliases: ["ctracker"],
    category:"info",
    usage: ["<prefix>command here"],
    run: async(bot, message, args)=> {

        const guild = bot.guilds.cache.get('694810450621366282');
        const member = guild.member(message.author);
        const Modmin = guild.roles.cache.find(role => role.name === "Modmin");


        if(member.roles.cache.has(Modmin.id) && args[0] !== 'update'){

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
            channel = bot.channels.cache.find(c => c.id === channelName.id);

            message.react('👌');
            message.delete({timeout: 5000, reason: 'it had to be done'});
            hrs = parseInt(HrsMins[0]);
            mins = parseInt(HrsMins[1]);

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

            let job = new CronJob(`0 ${mins} ${hrs} * * *`, async () => {

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
                    .setTimestamp()
                    .setFooter(`AGGRESSIVE GOODTALKER | By MahoMuri`, bot.user.displayAvatarURL());

                    channel.startTyping();
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
                        { name: `💕Recovered:`, value: `**${data[2].trim()}**`, inline: true },

                    );
                    channel.send(embed);
                    channel.stopTyping();
                })
                .catch(function(err){
                    //handle error
                    console.log(err);
                });


            });
        //end of job
        });
        job.start();
        nextDates = 1;
        }
        else if(!member.roles.cache.has(Modmin.id) || args[0] === 'update'){

            if (nextDates === 1) {
                let today = new Date();
                let tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, hrs, mins);

                message.channel.send(`The next update would be posted on ${channel} at ${tomorrow.toLocaleTimeString().replace(/:00/g, '')}, ${tomorrow.toDateString()}.`)
                .then(m => m.delete({timeout: 10000, reason :"It had to be done."}));
            }
            else{

                message.reply('The Modmins has not yet setup the covid tracker!').then(m => m.delete({timeout: 5000, reason :"It had to be done."}));

            }
        }


    }

};

