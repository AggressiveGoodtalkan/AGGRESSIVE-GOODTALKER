const colors = require("../../colors.json");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");

module.exports = {
    name: "whois",
    aliases: ["me", "about"],
    category:"info",
    description: "Displays the information about you or a member",
    usage: "-<command | alias> [@user]",
    run: async (bot, message, args) => {
        const guild = bot.guilds.cache.get('694810450621366282');
        const staff = guild.roles.cache.find(role => role.id === "714389560502648953");
        const userInfo = guild.roles.cache.find(role => role.id === "714394698298556487");
        const LFGroles = guild.roles.cache.find(role => role.id === "714394774034972676");
        const specialRole = guild.roles.cache.find(role => role.id === "714394842918158387");
        const member = getMember(message, args.join(" "));

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id && r.id !== staff.id && r.id !== userInfo.id && r.id !== LFGroles.id && r.id !== specialRole.id)
            .map(r => r).join(", ") || 'none';

        const active = member.user.presence.activities.length;
        const activity = member.user.presence.activities[0];
        const status = member.user.presence.status;

        // User variables
        const created = formatDate(member.user.createdAt);

        const embed = new MessageEmbed()
            .setTitle(`${member.displayName}'s Info`)
            .setFooter(member.displayName, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(colors.Dark_Pastel_Blue)

            .addField('Member information:', stripIndents`**Display name:** ${member.displayName}
            **Joined at:** ${joined}
            **Roles:** ${roles}`, true)

            .addField('User information:', stripIndents`**ID:** ${member.user.id}
            **Username**: ${member.user.username}
            **Tag**: ${member.user.tag}
            **Created at**: ${created}`, true)

            .addField('Current Status', stripIndents`**Status:** ${status[0].toUpperCase() + status.slice(1)}`)
            .setTimestamp();

        if(active) {
            if(activity.type === "CUSTOM_STATUS"){
                embed.addField("Currently has a ",`**${activity}**`,true);
            }
            else{
                const presence = member.user.presence.activities[0].type;
                embed.addField(`Currently ${presence[0] + presence.toLowerCase().slice(1)}`, stripIndents`**${presence[0] + presence.toLowerCase().slice(1)}**: ${activity}`);

            }
        }

        message.channel.send(embed);
    }

};
