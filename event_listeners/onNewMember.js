/**
 * @file guildMemberAdd listener
 */

const { MessageEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const colors = require(`${__dirname}/../colors.json`);


module.exports = async bot => {
    bot.on('guildMemberAdd', async member => {
        const guild = bot.guilds.cache.get(member.guild.id);
        const staff = guild.roles.cache.find(role => role.id === "714389560502648953");
        const userInfo = guild.roles.cache.find(role => role.id === "714394698298556487");
        const LFGroles = guild.roles.cache.find(role => role.id === "714394774034972676");
        const specialRole = guild.roles.cache.find(role => role.id === "714394842918158387");
        const unregisteredRole = guild.roles.cache.find(role => role.id === "714464085160362046");

        if (!member.user.bot) {
            member.roles.add(staff);
            member.roles.add(userInfo);
            member.roles.add(LFGroles);
            member.roles.add(specialRole);
            member.roles.add(unregisteredRole);

        }

    });
};
