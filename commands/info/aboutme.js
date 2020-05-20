module.exports = {
    name: "aboutag",
    aliases: ["agbot"],
    category:"info",
    usage: ["<prefix>command here"],
    run: async(bot, message, args)=>{

        let nsg = await message.channel.send(`Hi <@${message.author.id}>, My name is ${bot.user.username} and I was made by ${message.guild.owner} and was coded using node js.
        I mainly run the stuff here like the verifications, entertainment and moderations. For more information, type \`-help\` for a list of my commands.`);
        nsg.delete({timeout: 5000, reason :"It had to be done."});
        message.delete({timeout: 5000, reason :"It had to be done."});

    }
};
