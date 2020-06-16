const rp = require('request-promise');
const $ = require('cheerio');
const ms = require('ms');
const url = 'https://www.worldometers.info/coronavirus/?';
const phurl = 'https://www.worldometers.info/coronavirus/country/philippines/';
const { MessageEmbed } = require('discord.js');
const colors = require("../colors.json");
const { addCommas } = require("../functions.js");

module.exports = bot => {

    bot.on('ready', async () => {

        setInterval(function(){

            let date = new Date();
            if (date.getHours() === 10 && date.getMinutes() === 0 && date.getSeconds() <= 59) {

                let title = [];
                let data = [];
                const embed = new MessageEmbed();
                const channel = bot.channels.cache.get('720592478612226100');

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
                        .setTitle('**Coronavirus Tracker**')
                        .addFields(

                            { name: '\u2800' , value: '**Worldwide**' },
                            { name: `${title[0]}`, value: `${data[0]}` },
                            { name: `Active Cases:`, value: `${addCommas(ActiveCases)}` },
                            { name: `${title[1]}`, value: `${data[1]}` },
                            { name: `${title[2]}`, value: `${data[2]}` },
                            { name: '\u2800' , value: `✩｡:*•.────────────  ❁ ❁  ────────────.•*:｡✩` }

                        )
                        .setColor(colors.Covid)
                        .setTimestamp();

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
                            { name: `\u2800`, value: `**${title[0].trim()}**` },
                            { name: `${title[1]}`, value: `${data[0]}` },
                            { name: `Active Cases:`, value: `${addCommas(ActiveCases)}` },
                            { name: `${title[2]}`, value: `${data[1]}` },
                            { name: `${title[3]}`, value: `${data[2]}` }
                        );
                        channel.send(embed);

                    })
                    .catch(function(err){
                        //handle error
                        console.log(err);
                    });


                });
            }else {
                return;
            }

        }, ms('10s'));
        //end of setIterval
    });
};
