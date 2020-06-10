const { MessageEmbed } = require('discord.js');
const colors = require('../colors.json');
const { promptMessage } = require('../functions.js');
const { stripIndents } = require("common-tags");


module.exports = bot => {

    bot.on('channelDelete', async channel =>{

        const regex = /(\d+)/g;
        const channelName = channel.name;
        let numbers = channelName.match(regex);

        if (channelName === `ticket-${numbers}`) {

            const guild = bot.guilds.cache.get('694810450621366282');
            const feedbacks = guild.channels.cache.get('715114655059542105');
            const member = guild.member(numbers[0]);

            const promptFeedback = new MessageEmbed()
                .setColor(colors.Green)
                .setTitle('Thank you for using our ticket system!')
                .setFooter('This message becomes invalid after 60s')
                .setDescription('Would you like to provide feedback to help us improve our system?');

            await member.send(promptFeedback).then(async msg => {

                const response = await promptMessage(msg, member, 60, ["✅", "❌"]);

                if (response === "✅") {

                    await member.send("Great! Please enter your feedback now.");
                    const filter = m => m.content !== "Great! Please enter your feedback now." && m.author.is !== bot.user.id;

                    msg.channel.awaitMessages(filter, { max:1 }).then(collected => {
                        if (collected){
                            msg.reply('Thank you for your response! Have a nice paking day!');

                            const embed = new MessageEmbed()
                                .setTitle("New Feedback!")
                                .setColor(colors.Thisle)
                                .setTimestamp()
                                .setFooter(member.displayName, member.user.displayAvatarURL())
                                .setDescription(stripIndents `**${member.user.username} gave us feedback!:**
                                ${collected.first().content}`);

                            feedbacks.send(embed);
                        }
                    });
                }else if (response === "❌"){
                    msg.reply(`Thank you for your time! Have a nice day!`);
                    return;
                }
            });

        }
        else{
            return;
        }

    });
};
