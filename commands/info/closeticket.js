const { MessageEmbed } = require('discord.js');
const { promptMessage, getMember } = require('../../functions.js');
const colors = require("../../colors.json");
const { stripIndents } = require("common-tags");

module.exports = {
    name: 'closeticket',
    aliases: [""],
    category:"info",
    usage: [`prefix <desired prefix here>`],
    run: async(bot, message, args)=>{

        const guild = bot.guilds.cache.get('694810450621366282');
        const member = getMember(message, args.join(" "));
        const feedbacks = guild.channels.cache.get('715114655059542105');
        const ticket = guild.roles.cache.find(r => r.name === `ticket# ${message.author.id}`);
        const ticketchannel = guild.channels.cache.find(c => c.name === `ticket-${message.author.id}`);

        ticketchannel.delete();

        if (!member.roles.cache.has(ticket.id)) {
            message.reply("You cannot use this command!");
            return;
        }


        const promptFeedback = new MessageEmbed()
            .setColor(colors.Green)
            .setTitle("Thank you for using our ticket system!")
            .setFooter(`This message becomes invalid after 60s`)
            .setDescription('Would you like to provide feedback to help us improve our system?');

        await member.send(promptFeedback).then(async msg => {

            const response = await promptMessage(msg, message.author, 60, ["✅", "❌"]);

            if (response === "✅") {

                await member.send("Great! Please enter your feedback now.");
                const filter = m => m.content !== "Great! Please enter your feedback now." && m.author.is !== bot.user.id;

                msg.channel.awaitMessages(filter, { max:1 }).then(collected => {
                    if (collected){
                        msg.reply(`Thank you for your response! Have a nice paking day!`);

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

        ticket.delete();

    }
};
