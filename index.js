 const botconfig = require("./botconfig.json");
 const colors = require("./colors.json");
 const Discord = require('discord.js');
 const {prefix,token} = require("./botconfig.json")
 const superagent = require("superagent")
 const axios = require("axios")
 const fs = require("fs");
 const { MessageEmbed } = require('discord.js');
 const { stripIndents } = require("common-tags");
 const { getMember, formatDate } = require("./functions.js");

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



bot.on('guildMemberAdd', async member => {

    member.user.send(`Welcome ${member}! Please read the rules first! Then follow the instructions.`)
})

bot.on('message', async message => {

  if (message.content == `~start`) {

    const member = bot.guilds.cache.get('694810450621366282').member(message.author)
    const role = member.guild.roles.cache.find(role => role.name === "Member");

    if(member.roles.cache.has(role.id)){
      message.reply("You are already a member!")
      return;
    }

    // Create a message collector
    const filter = m => (m.content.includes('I have read the rules of this server and have agreed to follow it accordingly') && m.author.id != bot.user.id);
    const channel = message.channel;
    const collector = channel.createMessageCollector(filter);
    message.reply("I'm listening...");
    console.log("collector started");

      
      collector.on('collect', m => {
        
        
        if(m.content.includes('I have read the rules of this server and have agreed to follow it accordingly')){
              message.reply(`Thank you for your cooperation, Welcome to the server!`);
              member.roles.add(role);
              collector.stop();
            }
            console.log(`Collected ${m.content}`)
        });
        collector.on('end', collected => {
            
        const logging = bot.channels.cache.get('697105399836573756')

        const embed = new MessageEmbed()
            .setTitle(`${member.displayName} has successfully verified!`)
            .setFooter(member.displayName, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(colors.Green)

            .addField('Member information:', stripIndents`**Display name:** ${member.displayName}`, true)

            .addField('User information:', stripIndents`**ID:** ${member.user.id}
            **Username**: ${member.username}
            **Tag**: ${member.user.tag}`, true)

        logging.send(embed)
        console.log(`Collected ${collected.size} items`)

      });
    }
  });
    
    
    
    
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