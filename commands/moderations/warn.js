module.exports = {
    name: "warn",
    category: "moderations",
    description: "Warns a member",
    usage: "<mention, id>",
    run: async (bot, message, args) => {
    
        // If the bot can delete the message, do so
        if (message.deletable) message.delete({timeout: 5000, reason :"It had to be done."});

        // Either a mention or ID
        let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        // No person found
        if (!rMember)
            return message.reply("Couldn't find that person?").then(m => m.delete({timeout: 5000, reason:"It had to be done."}));
 
        // The member has BAN_MEMBERS or is a bot
        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send("Can't report that member").then(m => m.delete({timeout: 5000, reason: "It had to be done."}));

        const channel = message.guild.channels.cache.find(c => c.name === "rules").toString()
 
        // If there's no argument
        if (!args[1])
            return message.channel.send("Please provide a reason for the report").then(m => m.delete({timeout: 5000, reason:"It had to be done."}));
        else    
            return message.channel.send(`${rMember} You were warned by ${message.member} to **${args.slice(1).join(" ")}**. Please consider reading ${channel} again and try to act accordingly. Further warnings would result in disciplinary actions.`)
            .then(m => m.delete({timeout: 15000, reason: "It had to be done"}));


    }
}

    