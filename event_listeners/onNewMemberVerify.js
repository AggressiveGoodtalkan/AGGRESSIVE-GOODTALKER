/**
 * @file message listener (1/2)
 */

const { TextChannel, MessageEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { formatDate, computeAge, isLeapYear } = require(`${__dirname}/../functions.js`);
const colors = require(`${__dirname}/../colors.json`);

module.exports = bot => {
    bot.on('message', message => {

        if (message.content === `-start`) {

            if (message.channel instanceof TextChannel) {
                message.reply("This command is not supported here, it only works on DM channels.").then(m => m.delete({ timeout: 5000, reason: "It had to be done." }));
                message.delete({ timeout: 6000, reason: "It had to be done" });
                return;
            }

            const guild = bot.guilds.cache.get('694810450621366282');
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

            let dob_filter = response => response.content;
            message.reply(`Hello! Welcome to the server! Please enter your birthday in this format: \`DD/MM/YYYY\``).then(() => {
                message.channel.awaitMessages(dob_filter, { max: 1, time: 60000 })
                    .then(collected => {
                        if (collected.size === 0 || !collected.first().content) {
                            message.reply("You ran out of time to respond. Please try again.");
                            return;
                        }

                        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        let days = ["31", "28" , "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
                        let userInput = collected.first().content; //GETS THE RAW INPUT OF DD/MM/YYYY format
                        let regex = /(\d+)/g; //regex to get all digits from the user's input.
                        let parts = userInput.match(regex); //seprates the numbers from the user's input and puts them in an array.
                        if (!parts[0] || !parts[1] || !parts[2]) {
                            message.reply("Invalid birth date! Please enter a valid birth date.");
                            return;
                        }
                        let birthDate = parts[2] + "/" + parts[1] + "/" + parts[0]; //rearranges the input to YYYY/MM/DD
                        let dob = new Date(birthDate);
                        let date = new Date(Date.now());
                        let birthday = months[dob.getMonth()] + " " + dob.getDate() + ", " + dob.getFullYear(); //sets birthday to regular format DD/MM/YYYY
                        let leapYear = isLeapYear(parts[2]); //returns true if year is a leap year

                        //leap year check
                        if (leapYear === true) {
                            days[1] = "29";
                        }

                        /*
                        parts[0] = days
                        parts[1] = months
                        parts[2] = years
                        */

                        if (parts[1] > 13 || parts[1] < 1) {
                            message.reply('Invalid month! Please try again.');
                            return;
                        }
                        else if (parts[0] > days[parts[1] - 1]) {
                            message.reply('Invalid day! Please try again.');
                            return;
                        }
                        else if (parts[2] > 1000 && !parts[1]) {
                            message.reply('Invalid input! Please enter a valid month.');
                            return;
                        }
                        else if (parts[2] < 1000 || parts[2] >= date.getFullYear()){
                            message.reply('Invalid input! Please enter a valid year.');
                            return;
                        }

                        let age = computeAge(birthDate);

                        //message.reply(age);

                        //start of the age verification
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
                        } //end of age verification
                        else {
                            //start of verification process
                            message.reply(`Great! Now please type the verification phrase.`);
                            const filter = m => m.content && m.author.id !== bot.user.id;
                            const channel = message.channel;
                            const collector = channel.createMessageCollector(filter, { time: 60000 });
                            console.log("Collector started");
                            logs.send("Collector started");

                            //collects messages from the user in DM channel
                            collector.on('collect', async m => {

                                const verify = m.content === 'I have read the rules of this server and have agreed to follow them accordingly';

                                if (verify) {
                                    message.reply(`Thank you for your cooperation, welcome ${member}!`);
                                    member.roles.remove(unregisteredRole);
                                    member.roles.add(role);
                                    collector.stop();

                                }
                                else {
                                    message.reply("Invalid input: Please check your spelling and try again.");
                                }

                            });

                            //sends the log that the user has entered the server
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
                                    //another long embed...
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
                                        **${member.displayName}'s birthday:** ${birthday}
                                        **${member.displayName}'s age:** ${age} years old`, true);
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
                        //end off verifications
                    });
            });
        }
    });
};
