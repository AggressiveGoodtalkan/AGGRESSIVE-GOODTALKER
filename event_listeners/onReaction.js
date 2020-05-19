/**
 * @file messageReactionAdd listener
 */

const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const colors = require(`${__dirname}/../colors.json`);

module.exports = bot => {
    bot.on('messageReactionAdd', (reaction, user) => {

        let logChannel = bot.channels.cache.get('710795359844171797');
        let rulesChannel = bot.channels.cache.get('694810450637881348');
        let DaRules = rulesChannel.messages.fetch('702899668903788615');

        if (reaction.partial) {
            try {
                reaction.fetch();
            } catch (err) {
                console.log('Something went wrong while fetching the message.', err);
            }
        }

        let member = bot.guilds.cache.get('694810450621366282').member(user);
        let role = member.guild.roles.cache.find(role => role.name === "Member");

        if (reaction.emoji.name === '✅' && reaction.message.content === DaRules.content) {
            if (member.roles.cache.has(role.id)) {
                user.send(`You are already a member!`);
                return;
            } else {
                let embed = new MessageEmbed()
                    .setTitle("How to enter the server:")
                    .setColor(colors.Green_Sheen)
                    .addFields(
                        {
                            name: '__**Step 1:**__', value: stripIndents`Enter \`-start\` to start, the dash is required.
                        **(Make it quick because you would only have 1 minute to complete this.)**`},
                        { name: '__**Step 2:**__', value: stripIndents`**Enter your birthday to continue.**` },
                        {
                            name: '__**Step 3:**__', value: stripIndents`Then type:
                        \`I have read the rules of this server and have agreed to follow them accordingly\`
                        **(Please write it as plain text.)**`},
                        { name: '__**Step 4:**__', value: stripIndents`If I stop listening to you, just repeat **Steps 1 - 3**.` }
                    );
                user.send(embed);
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
