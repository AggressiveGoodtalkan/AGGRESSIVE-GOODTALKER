 const botconfig = require("./botconfig.json");
 const colors = require("./colors.json");
 const Discord = require('discord.js');
 const {prefix,token} = require("./botconfig.json")
 const superagent = require("superagent")
 const axios = require("axios")
 const fs = require("fs");

 const bot = new Discord.Client({disableEveryone: true});

 bot.commands = new Discord.Collection();
 bot.aliases = new Discord.Collection();

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
});

 bot.on("ready", async () =>{
     console.log(`${bot.user.username} is online on ${bot.guilds.cache.size} server/s!`)
     bot.user.setActivity("AGGRESSIVELY", {type: "STREAMING"});
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