const rp = require('request-promise');
const $ = require('cheerio');
const ogs = require('open-graph-scraper');
const url = 'https://www.worldometers.info/coronavirus/?';
const phurl = 'https://www.worldometers.info/coronavirus/country/philippines/';
const { MessageEmbed } = require('discord.js');
const colors = require("../../colors.json");

module.exports = {
    name: "covid",
    aliases: ["ctracker", "coronastats"],
    category:"info",
    usage: ["<prefix>command here"],
    run: async(bot, message, args)=>{

        const title = [];
        const data = [];
        rp(url)
        .then(function(html){
            //success!


            $('h1',html).each(function(i , elem){
                title[i] = $(this).text();
            });
            $('.maincounter-number',html).each(function(i , elem){
                data[i] = $(this).text();
            });

            const embed = new MessageEmbed()
                .setTitle('**Coronavirus Tracker**')
                .addFields(
                    { name: `${title[0]}`, value: `${data[0]}`},
                    { name: `${title[1]}`, value: `${data[1]}`},
                    { name: `${title[2]}`, value: `${data[2]}`}
                )
                .setColor(colors.Covid)
                .setTimestamp();

            message.channel.send(embed);


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

                const embed = new MessageEmbed()
                    .setTitle('**Coronavirus Tracker**')
                    .addFields(
                        { name: `Country`, value: `**${title[0].trim()}**`},
                        { name: `${title[1]}`, value: `${data[0]}`},
                        { name: `${title[2]}`, value: `${data[1]}`},
                        { name: `${title[3]}`, value: `${data[2]}`}
                    )
                    .setColor(colors.Covid)
                    .setTimestamp();

                message.channel.send(embed);

                // console.log(title[0]);
                // console.log(data[0]);
            })
            .catch(function(err){
                //handle error
                console.log(err);
            });
        });



        // const options = { url: 'https://www.worldometers.info/coronavirus/worldwide-graphs/#total-cases' };


        // ogs(options, (error, reults, response) => {
        //     console.log('Error:', error);
        //     console.log('Results:',reults);
        //     console.log('Response:',response);
        // });
    }
};
