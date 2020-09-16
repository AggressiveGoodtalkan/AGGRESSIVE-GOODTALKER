module.exports = {
    name: 'join',
    aliases: [""],
    category: "music",
    description: "",
    usage: [`\`-<command | alias> \``],
    run: async (bot, message, args) => {
        if (message.member.voice.channel) {
            const connectedChannel = bot.voice.connections.map(connection => connection.channel);
            const guildCheck = bot.voice.connections.map(connection => connection.channel.guild.id);
            console.log(guildCheck);

            if (!guildCheck.includes(message.guild.id)) {
                const connection = await message.member.voice.channel.join();
                message.channel.send(`✅ **Joined ${connection.channel.name} Voice Channel!**`);
            } else {
                if(!connectedChannel.includes(message.member.voice.channel)) {
                    const members = connectedChannel.map(channel => {
                        let servers = {};
                        let guild = channel.guild.name;
                        let members = channel.members.map(member => member.user.username);
                        servers = {
                            guild: guild,
                            members: members.filter(name => name !== bot.user.username)
                        };
                        return servers;
                    });
                    // console.log(members);
                    members.forEach(async member => {
                        if (member.guild === message.guild.name && member.members.length === 0) {
                            const connection = await message.member.voice.channel.join();
                            message.channel.send(`✅ **Joined ${connection.channel.name} Voice Channel!**`);
                        }else if (member.guild === message.guild.name && member.members.length > 0){
                            return message.channel.send("❌ **I'm already being used in a different channel!**");
                        }
                    });
                }else {
                    const connection = await message.member.voice.channel.join();
                    message.channel.send(`✅ **Joined ${connection.channel.name}!**`);
                }

            }

        }else{
            return message.channel.send("❌ **Please join a Voice Channel first!**");
        }
    }

};
