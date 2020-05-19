/**
 * @file message listener (1/2)
 */

const { TextChannel, MessageEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { formatDate, computeAge } = require(`${__dirname}/../functions.js`);
const colors = require(`${__dirname}/../colors.json`);

module.exports = bot => {
    bot.on('message', async message => {

        let member = bot.guilds.cache.get('694810450621366282').member(message.author);
        let role = member.guild.roles.cache.find(role => role.name === "Member");
        let logs = await bot.channels.cache.get('710795359844171797');

        if (message.content === `-start`) {
            if (message.channel instanceof TextChannel) {
                message.reply("This command is not supported here, it only works on DM channels.").then(m => m.delete({ timeout: 5000, reason: "It had to be done." }));
                message.delete({ timeout: 6000, reason: "It had to be done" });
                return;
            }

            if (member.roles.cache.has(role.id)) {
                message.reply("You are already a member!");
                return;
            }

            let dob_filter = response => response.content;
            message.reply(`Hello! Welcome to the server! Please enter your birthday in this format: \`yyyy-mm-dd\``).then(() => {
                message.channel.awaitMessages(dob_filter, { max: 1, time: 60000 })
                    .then(collected => {

                        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        let birthDate = collected.first().content;
                        let regex = /(\d+)/g;
                        let parts = birthDate.match(regex);
                        let dob = new Date(birthDate);
                        let birthday = months[dob.getMonth()] + ", " + dob.getDate() + " " + dob.getFullYear();


                        if (parts[1] > 13 || parts[1] < 1) {
                            message.reply('Invalid month! Please try again.');
                            return;
                        }
                        else if (parts[2] > 31 || parts[2] < 1) { // this is broken for all 28-30 day months
                            message.reply('Invalid day! Please try again.');
                            return;
                        }
                        else if (parts[0] > 1000 && !parts[1]) {
                            message.reply('Invalid input! Please enter a valid month.');
                            return;
                        }
                        else if (parts[0] > 1000 && !parts[2]) {
                            message.reply('Invalid input! Please enter a valid day.');
                            return;
                        }
                        else if (parts[0] < 1000) {
                            message.reply('Invalid input! Please enter a valid year.');
                            return;
                        }

                        let age = computeAge(birthDate);

                        //message.reply(age);

                        if (age < 13) {
                            const watchlist = bot.channels.cache.get('695169621757788210');
                            message.reply(`I'm sorry, but according to the Discord ToS, only users with the age 13 and above are eligable to enter the server.`);

                            const embed = new MessageEmbed()
                                .setTitle(`**${member.displayName}** tried to enter the server!`)
                                .setColor(colors.Red)
                                .setThumbnail(member.user.displayAvatarURL())
                                .addField(`**${member.displayName}**'s information:`, stripIndents`
                        ${member.displayName}'s birthday: ${birthday}
                        ${member.displayName}'s age: ${age} years old.
                        **Please keep an eye out for him**`, true)
                                .setTimestamp()
                                .setFooter(`AGGRESSIVE GOODTALKER | By MahoMuri`, bot.user.displayAvatarURL());

                            watchlist.send(embed);
                            return;
                        }
                        else {
                            message.reply(`Great! Now please type the verification phrase.`);
                            const filter = m => m.content && m.author.id !== bot.user.id;
                            const channel = message.channel;
                            const collector = channel.createMessageCollector(filter, { time: 60000 });
                            console.log("Collector started");
                            logs.send("Collector started");


                            collector.on('collect', async m => {

                                const verify = m.content === 'I have read the rules of this server and have agreed to follow them accordingly';

                                if (verify) {
                                    message.reply(`Thank you for your cooperation, welcome ${member}!`);
                                    member.roles.add(role);
                                    collector.stop();

                                }
                                else {
                                    message.reply("Invalid input: Please check your spelling and try again.");
                                }

                            });


                            collector.on('end', collected => {

                                const logging = bot.channels.cache.get('697105399836573756');
                                const created = formatDate(member.user.createdAt);

                                if (collected.size === 0 || !collected.find(m => m.content === 'I have read the rules of this server and have agreed to follow them accordingly')) {
                                    message.reply("*Yaaaaaawwnnnn* I'm gonna stop listening to you for now...");
                                    console.log("Collector stopped");
                                    logs.send("Collector stopped");
                                    return;
                                }
                                else if (collected.size > 0 && !collected.find(m => m.content === 'I have read the rules of this server and have agreed to follow them accordingly')) {
                                    message.reply("*Yaaaaaawwnnnn* I'm gonna stop listening to you for now...");
                                    console.log("Collector stopped");
                                    logs.send("Collector stopped");
                                    return;
                                }
                                else {

                                    const verify = collected.find(m => m.content === 'I have read the rules of this server and have agreed to follow them accordingly');
                                    const general = bot.channels.cache.get('694810451065962505');

                                    const embed = new MessageEmbed()
                                        .setTitle(`${member.displayName} has successfully verified!`)
                                        .setTimestamp()
                                        .setFooter(member.displayName, member.user.displayAvatarURL())
                                        .setThumbnail(member.user.displayAvatarURL())
                                        .setColor(colors.Green)
                                        .addField('User information:', stripIndents`**ID:** ${member.user.id}
                            **Username:** ${member.user.username}
                            **Tag:** ${member.user.tag}
                            **Created:** ${created}
                            **${member.displayName}'s:** ${age} years old`, true);
                                    logging.send(embed);
                                    general.send(`Welcome to da good paking server ${member}! Have fun!`).then(m => m.delete({ timeout: 60000, reason: "It had to be done." }));
                                    console.log("Collector stopped");
                                    logs.send("Collector stopped");
                                    console.log("Collected item: ");
                                    console.log(`${verify}`);

                                    const lEmbed = new MessageEmbed()
                                        .setTitle("New Verification!")
                                        .setThumbnail(member.user.displayAvatarURL())
                                        .setTimestamp()
                                        .setColor(colors.Green)
                                        .addField(`**${member.user.username} has sucessfully entered the server!**`, `${member} has completed the verification method and entered this phrase:
                            \`${verify}\``);

                                    logs.send(lEmbed);

                                }

                            });
                        }
                    });
            });
        }
    });
};
