const { paginationEmbed,promptMessage, getMember } = require("../../functions.js");
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const colors = require("../../colors.json");

module.exports = {
    name: 'ticket',
    aliases: [""],
    category:"info",
    usage: [`prefix <desired prefix here>`],
    run: async(bot, message, args)=>{

        const guild = bot.guilds.cache.get('694810450621366282');
        const member = getMember(message, args.join(" "));
        const memberRole = guild.roles.cache .find(role => role.name === 'Member');
        const rules = guild.channels.cache.find(c => c.name === 'rules');
        const assistance = guild.channels.cache.find(c => c.name === 'assistance');
        const mahomuri = guild.members.cache.find(m => m.id === '259313335076519936');

        if (message.channel !== assistance) {
            message.reply(`You cannot use this command here, please use it in the ${assistance} channel instead.`)
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
            message.delete({timeout:6000, reason :"It had to be done"});
            return;
        }else if (member.roles.cache.has(memberRole.id)) {
            message.reply("You cannot use this command because you are already verified!")
            .then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
            message.delete({timeout:6000, reason :"It had to be done"});
            return;
        }


        let createdChannel = message.guild.channels.cache.find(channel => channel.name === `ticket-${message.author.id}`);
        let ticket = message.guild.roles.cache.find(role => role.name === `ticket# ${message.author.id}`);

        if (!ticket) {
            try {
                ticket = await message.guild.roles.create({
                    data: {
                        name: `ticket# ${message.author.id}`,
                        color: 'WHITE',
                        permissions: []
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
        if (!createdChannel) {
            try {
                createdChannel = await message.guild.channels.create(`ticket-${message.author.id}`, {
                    type: 'text',
                    permissionOverwrites: [
                        {
                            id: memberRole.id,
                            deny: ['VIEW_CHANNEL'],
                        },
                        {
                            id: ticket.id,
                            allow: ['VIEW_CHANNEL'],
                        },
                        {
                            id: '694810450621366282',
                            deny: ['VIEW_CHANNEL'],
                        }
                    ],
                });
            } catch (error) {
                console.log(error);
            }

        }

        message.delete({timeout: 6000, reason :"It had to be done."});

        const embed = new MessageEmbed()
            .setTitle("How can I help you?")
            .setColor(colors.Eton_Blue)
            .addFields(
                { name: '__**Question 1**__', value: stripIndents `1️⃣ How do I get in the server?` },
                { name: '__**Question 2**__', value: stripIndents `2️⃣ I reacted to the ${rules} message but nothing happened?` },
                { name: '__**Question 3**__', value: stripIndents `3️⃣ I entered the server, but I didn't recieve a DM?` },
                { name: '✩｡:*•.────────────  ❁ ❁  ────────────.•*:｡✩', value: stripIndents `React ❌ to close the ticket.` },
                { name: '__**To ask for my help again.**__', value: stripIndents `Please enter the command in the ${assistance} channel.`}
            )
            .setTimestamp()
            .setFooter(`AGGRESSIVE GOODTALKER | By MahoMuri`, bot.user.displayAvatarURL());

        const q1Embed = new MessageEmbed()
            .setTitle("Getting in the server...")
            .setColor(colors.Green)
            .addFields(
                { name: "__**How do I get in the server?**__", value: stripIndents `To get in the server, you must first react ✅ to the ${rules} message
                and then follow the instructions given to you `},
                { name: '✩｡:*•.────────────  ❁ ❁  ────────────.•*:｡✩', value: stripIndents `React ⬅ to go back.
                React ❌ to close the ticket.` },
            )
            .setTimestamp();

        const q2Embed = new MessageEmbed()
            .setTitle("Reacting to the rules...")
            .setColor(colors.Lavander_Purple)
            .addFields(
                { name: `__**I reacted to the #rules message but nothing happened?**__`, value: stripIndents `This can either mean my creator is working on me or I ran into an error.
                Please contact my creator, ${mahomuri} to assist you with that matter.`},
                { name: '✩｡:*•.────────────  ❁ ❁  ────────────.•*:｡✩', value: stripIndents `React ⬅ to go back.
                React ❌ to close the ticket.` },
            )
            .setTimestamp();

        const q3Embed = new MessageEmbed()
            .setTitle("Sending DMs...")
            .setColor(colors.Wild_Blue_Yonder)
            .addFields(
                { name: `__**I entered the server, but I didn't recieve a DM?'**__`, value: stripIndents `If this happens, please rejoin the server and try again. This can be the cause of
                me being reset by my creator or I crashed due to an error. If rejoining the server still didn't fix it, please contact ${mahomuri} for further assisntance.`},
                { name: '✩｡:*•.────────────  ❁ ❁  ────────────.•*:｡✩', value: stripIndents `React ⬅ to go back.
                React ❌ to close the ticket.` },
            )
            .setTimestamp();

        let pages = [
            embed,
            q1Embed,
            q2Embed,
            q3Embed
        ];


        member.roles.add(ticket);
        paginationEmbed(message, createdChannel, pages, [ "⬅","1️⃣","2️⃣","3️⃣","❌"],);
    }
};
