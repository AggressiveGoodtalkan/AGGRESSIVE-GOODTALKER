/**
 * @file messageReactionAdd listener
 */

const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const colors = require(`${__dirname}/../colors.json`);


module.exports = bot => {
    bot.on('messageReactionAdd', async (reaction, user) => {

        const logChannel = await bot.channels.cache.get('710795359844171797');
        const rulesChannel = await bot.channels.cache.get('694810450637881348');
        const DaRules = await rulesChannel.messages.fetch('702899668903788615');
        const logs = bot.channels.cache.get('710795359844171797');

        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (err) {
                console.log('Something went wrong while fetching the message.', err);
            }
        }

        const member = bot.guilds.cache.get('694810450621366282').member(user);
        const role = member.guild.roles.cache.find(role => role.name === "Member");
        const silenced = member.guild.roles.cache.find(role => role.name === "Global Silencer");

        if (reaction.emoji.name === '✅' && reaction.message.content === DaRules.content) {
            if (member.roles.cache.has(silenced.id)) {
                user.send(`You have been silenced! You cannot access the server for now.`);
                return;
            }else if (member.roles.cache.has(role.id)) {
                user.send(`You are already a member!`);
                return;
            }else {
                const embed = new MessageEmbed()
                .setTitle("How to enter the server:")
                .setColor(colors.Turquoise)
                .addFields(
                    { name: '__**Step 1:**__', value: stripIndents`Enter \`-verify\` to start, the dash is required.
                    **(Make it quick because you would only have 5 minutes to complete this.)**`},
                    { name: '__**Step 2:**__', value: stripIndents`Enter your birthday to continue.
                    **Please use the format: MM/DD/YYYY (Words are accepted to e.g. January 1, 1970)**` },
                    { name: '__**Step 3:**__', value: stripIndents`Then type:
                    \`I have read the rules of this server and have agreed to follow them accordingly\`
                    **(Please write it as plain text.)**`},
                    { name: '__**Step 4:**__', value: stripIndents`If I stop listening to you or an error occurs, just repeat **Steps 1 - 3**.` }
                );
                user.send(embed);

                try {
                    logs.send("Message has been sent!");

                } catch (error) {
                    logs.send(error);
                }
            }

            let lEmbed = new MessageEmbed()
                .setTitle("New Reaction!")
                .setColor(colors.Green)
                .setDescription(`**${member.displayName}** has reacted ${reaction.emoji.name} to the ${rulesChannel} message!`);

            logChannel.send(lEmbed);
        }

        //console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!: ${reaction.emoji.name}`);
    });
};
