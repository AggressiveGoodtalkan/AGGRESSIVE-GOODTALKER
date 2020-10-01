/**
 * @file message listener (1/2)
 */

const { TextChannel, MessageEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { formatDate, computeAge, isLeapYear } = require(`${__dirname}/../functions.js`);
const colors = require(`${__dirname}/../colors.json`);

module.exports = bot => {
    bot.on('message', message => {

        if (message.content === `-verify`) {

            if (message.channel instanceof TextChannel) {
                message.reply("This command is not supported here, it only works on DM channels.").then(m => m.delete({ timeout: 5000, reason: "It had to be done." }));
                message.delete({ timeout: 6000, reason: "It had to be done" });
                return;
            }

            const guild = bot.guilds.cache.get('694810450621366282');
            const general = bot.channels.cache.get('694810451065962505');
            const member = guild.member(message.author);
            const logs = bot.channels.cache.get('710795359844171797');
            const silenced = guild.roles.cache.find(role => role.name === "Global Silencer");
            const role = guild.roles.cache.find(role => role.name === "Member");
            const unregisteredRole = guild.roles.cache.find(role => role.id === "714464085160362046");


            if (member.roles.cache.has(silenced.id)) {
                message.reply(`You have been silenced! You cannot access the server for now.`);
                return;
            }

            if (member.roles.cache.has(role.id)) {
                message.reply("You are already a member!");
                return;
            }

            const filter = m => m.content && m.author.id !== bot.user.id;
            message.reply(`**Hello! Welcome to the server! Please enter your birthday in this format:** \`MM/DD/YYYY\` ** or **\`January, 1 1970\``).then(() => {
                const channel = message.channel;
                const collector = channel.createMessageCollector(filter, { time: 300000 });
                let age = null, birthday;
                const options = {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                };

                collector.on('collect', async collected =>{

                    let userInput = Date.parse(collected.content); //GETS THE RAW INPUT OF MM/DD/YYYY format
                    if (isNaN(userInput)) {
                        message.reply('Invalid Date! Please try again.');
                        console.log('Invalid Date! Please try again.');
                    }else{
                        birthday = new Date(userInput);
                        let date = new Date();
                        if (birthday.getFullYear() <= 1800 || birthday.getFullYear() >= date.getFullYear() ) {
                            message.reply('Invalid input! Please enter a valid year.');
                        }else{
                            age = computeAge(birthday.toLocaleDateString());
                            if (age > 100) {
                                message.reply(`Invalid birthday! You cannot be ${age} years old!`);
                            }else if (age < 0) {
                                message.reply(`Invalid birthday! You cannot be ${age} years old!`);
                                // message.reply('Accepted!\nBirthday is: ' + birthday.toLocaleDateString('en-US', options) + '\nAge: ' + age);
                                // console.log('Accepted!\nBirthday is: ' + birthday.toLocaleDateString() + '\nAge: ' + age);
                            }else {
                                console.log('Accepted!\nBirthday is: ' + birthday.toLocaleDateString() + '\nAge: ' + age);
                                collector.stop();
                            }

                        }
                    }


                });

                collector.on('end', collected => {
                    //message.reply(age);
                    if (age === null) {
                        return message.reply('You ran out of time to complete the verification process, please try again.');
                    }
                    //start of the age verification
                    if (age < 13) {
                        const watchlist = bot.channels.cache.get('695169621757788210');
                        message.reply(`I'm sorry, but according to the Discord ToS, only users with the age 13 and above are eligable to enter the server.`);

                        const embed = new MessageEmbed()
                            .setTitle(`**${member.displayName}** tried to enter the server!`)
                            .setColor(colors.Red)
                            .setThumbnail(member.user.displayAvatarURL())
                            .addField(`**${member.displayName}**'s information:`, stripIndents`
                            ${member.displayName}'s birthday: ${birthday.toLocaleDateString('en-US', options)}
                            ${member.displayName}'s age: ${age} years old.
                            **Please keep an eye out for him**`, true)
                            .setTimestamp()
                            .setFooter(`${bot.user.username} | By MahoMuri`, bot.user.displayAvatarURL());

                        watchlist.send(embed);
                        return;
                    } //end of age verification
                    else {
                        //start of verification process
                        message.reply(`Great! Now please type the verification phrase.`);
                        const filter = m => m.content && m.author.id !== bot.user.id;
                        const channel = message.channel;
                        const collector = channel.createMessageCollector(filter, { time: 300000 });
                        console.log("Collector started");
                        logs.send("Collector started");

                        //collects messages from the user in DM channel
                        collector.on('collect', async m => {

                            const verify = m.content === 'I have read the rules of this server and have agreed to follow them accordingly';

                            if (verify) {
                                await member.roles.remove(unregisteredRole).then(async member => {
                                    await member.roles.add(role).then(() => {
                                        message.reply(`**Thank you for your cooperation, Welcome ${member}! Please proceed to ${general} and start chatting!**`);
                                    });
                                    collector.stop();
                                });
                            }
                            else {
                                message.reply("Invalid input: Please check your spelling and try again.");
                            }

                        });

                        //sends the log that the user has entered the server
                        collector.on('end', collected => {

                            const logging = bot.channels.cache.get('697105399836573756');
                            const created = formatDate(member.user.createdAt);
                            const welcome = guild.roles.cache.find(role => role.name === 'Welcoming Committee');

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
                                //another long embed...
                                const verify = collected.find(m => m.content === 'I have read the rules of this server and have agreed to follow them accordingly');

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
                                    **${member.displayName}'s birthday:** ${birthday.toLocaleDateString('en-US', options)}
                                    **${member.displayName}'s age:** ${age} years old`, true)
                                    .setFooter(`${bot.user.username} | By MahoMuri`, bot.user.displayAvatarURL());
                                logging.send(embed);
                                general.send(`**Welcome to da good paking server ${member}! You can contact the ${welcome} to get started!**`).then(m => m.delete({ timeout: 120000, reason: "It had to be done." }));
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
                    //end off verifications
                });
            });
        }
    });
};
