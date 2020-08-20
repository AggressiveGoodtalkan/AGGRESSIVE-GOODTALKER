const { promptMessage } = require('../../functions.js');
const colors = require('../../colors.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'setup',
    aliases: [""],
    category:"voice",
    description: "Sets up custom voice channels.",
    usage: [`\`-<command | alias> setup\``],
    run: async (bot, message, args) => {

        const promptSetup = new MessageEmbed()
                .setColor(colors.Turquoise)
                .setTitle(`Welcome to ${bot.user.username}'s custom voice!`)
                .setFooter('This message becomes invalid after 60s')
                .setDescription('Would you like me to make a separate category for the channels?');

        await message.channel.send(promptSetup).then(async msg => {

            const response = await promptMessage(msg, message.author, 60, ["✅", "❌"]);

            if (response === "✅") {
                const filter = m => m.author.id !== bot.user.id;
                await msg.channel.send("**Enter the name of the catergory: (e.g. Custom Voice Channels!)**");

                await msg.channel.awaitMessages(filter, { max: 1 }).then(async collected => {
                    if (collected){
                        msg.guild.channels.create(collected.first().content, {
                            type: "category"
                        }).then(async category => {

                            await msg.channel.send("**Enter the name of the voice channel: (e.g. Voice Channel)**");

                            msg.channel.awaitMessages(filter, { max: 1 }).then(async collected => {
                                if (collected){
                                    msg.guild.channels.create(collected.first().content, {
                                        type: "voice",
                                        parent: category
                                    }).then(async () => {
                                        await msg.channel.send("✅ **Done! You're all set and ready to go!**");
                                    });
                                }
                            });
                        });
                    }
                });




            }
        });
    }

};
