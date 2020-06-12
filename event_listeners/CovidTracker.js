const rp = require('request-promise');
const $ = require('cheerio');
const ms = require('ms');
const url = 'https://www.worldometers.info/coronavirus/?';
const phurl = 'https://www.worldometers.info/coronavirus/country/philippines/';
const { MessageEmbed } = require('discord.js');
const colors = require("../colors.json");

module.exports = bot => {

    bot.on('ready', async () => {

        setInterval(function(){
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

                    embed
                    .setTitle('**Coronavirus Tracker**')
                    .addFields(
                        { name: `${title[0]}`, value: `${data[0]}`},
                        { name: `${title[1]}`, value: `${data[1]}`},
                        { name: `${title[2]}`, value: `${data[2]}`},
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

                    embed
                    .addFields(
                        { name: `\u2800`, value: `**${title[0].trim()}**`},
                        { name: `${title[1]}`, value: `${data[0]}`},
                        { name: `${title[2]}`, value: `${data[1]}`},
                        { name: `${title[3]}`, value: `${data[2]}`}
                    );
                    channel.send(embed);

                })
                .catch(function(err){
                    //handle error
                    console.log(err);
                });


            });

        },ms('1d'));
        //end of setIterval
    });
};
