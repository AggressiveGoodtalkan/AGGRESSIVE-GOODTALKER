 const botconfig = require("./botconfig.json");
 const colors = require("./colors.json");
 const Discord = require('discord.js');
 const {prefix,token} = require("./botconfig.json")
 const superagent = require("superagent")
 const axios = require("axios")
 const fs = require("fs");
 const { MessageEmbed } = require('discord.js');
 const { stripIndents } = require("common-tags");
 const { formatDate } = require("./functions.js");

 const bot = new Discord.Client({disableEveryone: true});
 
 bot.commands = new Discord.Collection();
 bot.aliases = new Discord.Collection();
 bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
});

 bot.on("ready", async () =>{
     console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} server/s!`)
     bot.user.setActivity("AGGRESSIVELY", {type: "STREAMING"});
});




bot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'rules')
    const logging = member.guild.channels.cache.find(ch => ch.name === 'verification-logs')
    const created = formatDate(member.user.createdAt);
    channel.send(`Welcome ${member}! Please read the rules first! Then send the confirmation phrase written there.`).then(m => m.delete({timeout: 5000, reason: 'It had to be done'}))

    const filter = m => !m.author.bot;
    const collector = channel.createMessageCollector(filter)
    collector.on('collect', (message, col) =>{

        if(message.content === 'I have read the rules of this server and have agreed to follow it accordingly'){
            member.roles.set(['694810450621366283'])
            .then(channel.send(`Thank you for your cooperation ${member}, Welcome to the server!`).then(m => m.delete({timeout: 5000, reason: 'It had to be done'})))
            message.delete({timeout: 5000, reason: 'It had to be done'})
            collector.stop();
        }
        else{
            message.reply('Invalid Message! Please try again!').then(m => m.delete({timeout: 5000, reason: 'It had to be done'}))
            message.delete({timeout: 5000, reason: 'It had to be done'})
        }
            
    });

    collector.on('end', collected => {

        const embed = new MessageEmbed()
        .setColor(colors.Blue)
        .setTitle(`${member.user.username} has successfully verified!`)
        .setFooter(member.displayName, member.user.displayAvatarURL())
        .setThumbnail(member.user.displayAvatarURL())
        
        .addField('Member information:', stripIndents`**Display name:** ${member.displayName}`)
        
        .addField('User information:', stripIndents`**ID:** ${member.user.id}
        **Username**: ${member.user.username}
        **Tag**: ${member.user.tag}
        **Created at**: ${created}`, true)
        .setTimestamp()
        
        logging.send(embed)
        
    })
})
    

    

bot.on("message", async message => {

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    // If message.member is uncached, cache it.
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    // Get the command
    let command = bot.commands.get(cmd);
    
    // If none is found, try to find it by alias
    if (!command) command = bot.commands.get(bot.aliases.get(cmd));

    // If a command is finally found, run the command
    if (command) 
        command.run(bot, message, args);
});


 bot.login(token);  