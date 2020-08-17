const { getMember } = require("../../functions.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: 'takerole',
    aliases: ['trole'],
    category:"moderations",
    usage:['<prefix>giverole <Usertag|Mention> <RoleID: Plain text>'],
    run: async (bot, message, args) => {

        if (!message.member.hasPermission("MANAGE_ROLES")) {
            message.reply("You don't have access to this command!");
            return;
        }

        if (!message.mentions.members.first()) {
            message.reply('Please provide a member to take the role from.');
            return;
        }

        if (!args[1]) {
            message.reply('Please provide role to take!');
            return;
        }

        if (message.mentions.roles.first()) {
            message.reply('**F̏ͧ͛Aͨ̊̏Tͨ̋ͥAͥ̐̎҉̤̙̗L̎ͮ̄ ͆͐͊Eͤ̎͆Rͨ͛̌Rͪ̉͊҉͝͏́Ò͐͐R͋ͥ̑** - The role must be written in plain text!');
            return;
        }

        const member = getMember(message, args.join(" "));
        const modmin = message.guild.roles.cache.find(role => role.name === "Modmin");
        const mods = message.guild.roles.cache.find(role => role.name === "Mods");
        const toGive = args.slice(1).join(" ");
        const role = message.guild.roles.cache.find(role => role.name === toGive);

        if (role === "Modmin" && !message.member.roles.cache.has(modmin.id)) {
            return message.reply('You do not have access to this role.');
        }
        if (role === "Mods" && !message.member.roles.cache.has(modmin.id)) {
            return message.reply('You do not have access to this role.');
        }

        try {
            if (!member.roles.cache.has(role.id)) {
                message.channel.send(`\`${member.user.tag}!\` does not have the ${role.name} role!`);
                return;
            }
            await member.roles.remove(role);
            message.channel.send(`${role.name} has been successfully removed from \`${member.user.tag}!\`!`);
        } catch (error) {
            message.channel.send(stripIndents `Couldn't take the role here's why:
            \`${error.message}\``);
        }
    }
};
