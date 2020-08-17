const colors = require("../../colors.json");
const { MessageEmbed } = require('discord.js');
const { getMember } = require('../../functions.js');
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();


module.exports = {
    name: "pokemon",
    aliases: ["pkmn", "pokemon"],
    category:"entertainment",
    description: "Aggressive Gooodtalker's Pokédex",
    usage: [`\`-<command | alias>\``],
    run: async (bot, message, args) => {

        if (!args) {
            return message.channel.send(`❌ ERROR: Please provide a category!`);
        }

        let interval = {
            limit: 10,
            offset: 34
        };

        if (args[0].toLowerCase() === 'plist') {

            P.getPokemonsList() // with Promise
            .then(function(response) {

                console.log(response);

                // let moves = [];
                // for (let i = 0; i < response.stats.length; i++) {
                //     console.log(response.stats[i].stat.name);
                // }
                // let mEmbed = new MessageEmbed()
                //     .setColor(colors.Lumber)
                //     .setAuthor(`Welcome to ${bot.user.username}'s Pokédex!`, bot.user.displayAvatarURL())
                //     .setTitle(`**${response[0].name[0].toUpperCase()}${response[0].name.slice(1)}**`)
                //     .setThumbnail(data[0].sprites.animated)
                //     .setTimestamp()
                //     .setFooter(`${bot.user.username} | By MahoMuri`, bot.user.displayAvatarURL());

                // message.channel.send(mEmbed);
                // nsg.delete();

            })
            .catch(function(error) {
                console.log('There was an ERROR: ', error);
            });

        }

        if (args[0].toLowerCase() === 'berry') {
            const berry = args.slice(1).join(" ");

            P.getBerryByName(berry)
            .then(function(response) {

                console.log(response.flavors[0].flavor);

            })
            .catch(function(error) {
                console.log('There was an ERROR: ', error);
            });
        }
    }
};
