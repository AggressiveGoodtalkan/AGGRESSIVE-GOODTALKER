const { getMember } = require("../../functions.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: 'giverole',
    aliases: ['grole'],
    category:"moderations",
    description: "Gives a role to a certain user",
    usage:[`\`-<command | alias> <Usertag|Mention> <RoleID: Plain text>\``],
    run: async (bot, message, args) => {

        if (!message.member.hasPermission("MANAGE_ROLES")) {
            message.reply("You don't have access to this command!");
            return;
        }
        if (!message.mentions.members.first()) {
            message.reply('Please provide a member to give the role to.');
            return;
        }
        if (!args) {
            message.reply('Please provide role to give!');
            return;
        }

        if (message.mentions.roles.first()) {
            message.reply('**F̏ͧ͛Aͨ̊̏Tͨ̋ͥAͥ̐̎҉̤̙̗L̎ͮ̄ ͆͐͊Eͤ̎͆Rͨ͛̌Rͪ̉͊҉͝͏́Ò͐͐R͋ͥ̑** - The role must be written in plain text!');
            return;
        }

        const member = getMember(message, args.join(" "));
        const toGive = args.slice(1).join(" ");
        const modmin = message.guild.roles.cache.find(role => role.name === "Modmin");
        const mods = message.guild.roles.cache.find(role => role.name === "Mods");
        const role = message.guild.roles.cache.find(role => role.name === toGive);

        if (role === "Modmin" && !message.member.roles.cache.has(modmin.id)) {
            return message.reply('You do not have access to this role.');
        }
        if (role === "Mods" && !message.member.roles.cache.has(modmin.id)) {
            return message.reply('You do not have access to this role.');
        }


        //message.channel.send(`${toGive}`);

        try {

            if (member.roles.cache.has(role.id)) {
                message.channel.send(`\`${member.user.tag}!\` already has the ${role.name} role!`);
                return;
            }
            await member.roles.add(role);
            message.channel.send(`${role.name} has been successfully given to \`${member.user.tag}!\``);
        } catch (error) {
            message.channel.send(stripIndents `Couldn't give the role here's why:
            \`${error.message}\``);
        }
    }
};
