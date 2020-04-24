const colors = require("../../colors.json");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");

module.exports = {
    name: "whois",
    aliases: ["me", "about"],
    category:"info",
    usage: "<prefix>[command | alias]",
    run: async (bot, message, args) => {
        const member = getMember(message, args.join(" "));

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';
        
        const active = member.user.presence.activities.length;
        const activity = member.user.presence.activities[0];
        const status = member.user.presence.status;
        const custom = member.user.presence.activities[0].type === "CUSTOM_STATUS";
  
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
            .setTimestamp()

        if(active && !custom){
            const presence = member.user.presence.activities[0].type
            embed.addField(`Currently ${presence[0] + presence.toLowerCase().slice(1)}`, stripIndents`**${presence[0] + presence.toLowerCase().slice(1)}**: ${activity}`);
        }
        else if(member.user.presence.activities[0].type === 'CUSTOM_STATUS'){
            const presence = member.user.presence.activities[0].type
            embed.addField("Currently has a ",`**${activity}**`,true);
        }

        
        message.channel.send(embed);
    }
        
}

// let uEmbed = new Discord.MessageEmbed()
//     .setColor(colors.Dark_Pastel_Blue)
//     .setTitle("User Info")
//     .setThumbnail(message.author.displayAvatarURL())
//     .setAuthor(`${message.author.username}'s Info`, message.author.displayAvatarURL())
//     .addField("**Memeber's Name:**", `${message.author.username}`, true)
//     .addField("**Discriminator:**", `${message.author.discriminator}`,true)
//     .addField("**ID:**", `${message.author.id}`, true)
//     .addField("**Status**", `${message.author.presence.status}`, true)
//     .addField("**Created At:**", `${message.author.createdAt}`, true)
//     .setTimestamp()
//     .setFooter(`AGGRESSIVE GOODTALKER | Footer`, bot.user.displayAvatarURL());
//     message.channel.send(uEmbed);
// } 
// module.exports.config = {
    //     name: "myinfo",
//     aliases:["me","aboutme", "myinfo"]
// }
// 