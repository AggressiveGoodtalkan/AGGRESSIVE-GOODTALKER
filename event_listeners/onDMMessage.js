/**
 * @file DM listener for Q-Den complaints
 */
const { TextChannel, MessageEmbed } = require('discord.js');
const colors = require('../colors.json');

 module.exports = async bot =>{
     bot.on('message', message => {
         let text = message.content.toLowerCase();

         if (text === 'report') {

            if (message.channel instanceof TextChannel) {
                return;
            }

            const guild = bot.guilds.cache.get('694810450621366282');
            const channel = guild.channels.cache.find(c => c.id === '696001138088214599');

            message.reply("Hello there, please type your report now.");
            const filter = m => m.author.id !== bot.user.id;


            message.channel.awaitMessages(filter, { max: 1 }).then(collected => {
                if (collected) {
                    message.reply('Thank you for your report! Have a nice day!');
                    const embed = new MessageEmbed()
                        .setTitle("**New Report!**")
                        .addFields(
                            {
                                name: "──────────────── ∘°❉°∘ ─────────────────",
                                value: `**Reported by:**
                                ${message.author}`,
                                inline: true
                            },
                            {
                                name: "Reason for report:",
                                value: `${collected.first().content}`,
                            },
                            {
                                name: "──────────────── °∘❉∘° ─────────────────",
                                value: `\u2800`
                            }
                        )
                        .setColor(colors.Turquoise)
                        .setFooter(`${bot.user.username} | By MahoMuri`, bot.user.displayAvatarURL())
                        .setTimestamp();
                    channel.send(embed);
                }
            });

         }
     });
 };
