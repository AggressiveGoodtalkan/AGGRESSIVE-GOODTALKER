/**
 * @file guildMemberUpdate listener
 */

module.exports = async bot => {
    bot.on("guildMemberUpdate", async (oldMember, newMember) => {
        const channel = bot.channels.cache.get('699325313930362982');
        const Achannel = bot.channels.cache.get('705733221437931540');
        const Media_Channel = bot.channels.cache.get('710487738394345512');
        const mod = newMember.guild.roles.cache.find(role => role.name === "Mods");
        const modmin = newMember.guild.roles.cache.find(role => role.name === "Modmin");
        const creator = newMember.guild.roles.cache.find(role => role.name === "DaGudPakingMediaMaker");

        if (!oldMember.roles.cache.has(mod.id) && newMember.roles.cache.has(mod.id)) {
            channel.send(`Congrats <@${newMember.user.id}> on getting the ${mod} role!`);
            channel.send({
                files: [{
                    attachment: `${__dirname}/../images/tenor.gif`,
                    name: 'tenor.gif'
                }]
            })
                .catch(err => console.error);
        }
        else if (!oldMember.roles.cache.has(modmin.id) && newMember.roles.cache.has(modmin.id)) {
            Achannel.send(`Congrats <@${newMember.user.id}> on getting the ${modmin} role!`);
            Achannel.send({
                files: [{
                    attachment: `${__dirname}/../images/king.gif`,
                    name: 'king.gif'
                }]
            })
                .catch(err => console.error);
        }
        else if (!oldMember.roles.cache.has(creator.id) && newMember.roles.cache.has(creator.id)) {
            Media_Channel.send(`Congrats <@${newMember.user.id}> on getting the ${creator} role!`);
            Media_Channel.send({
                files: [{
                    attachment: `${__dirname}/../images/painter.gif`,
                    name: 'painter.gif'
                }]
            })
                .catch(err => console.error);
        }
        else {
            return;
        }

    });
};
