const colors = require("./colors.json");
const Discord = require('discord.js');
const { config } = require("dotenv");
const { prefix } = require("./botprefix.json")
const fs = require("fs");
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const { formatDate } = require("./functions.js");


const bot = new Discord.Client({
  disableEveryone: true
});


config({
  path: __dirname + "/.env"
});

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

  const rules = bot.channels.cache.get('694810450637881348')
  member.user.send(`Welcome ${member}! Please read the ${rules} first! Then follow the instructions that are written there.`);

})

bot.on('message', async message => {


  if (message.content == `${prefix}start`) {

    const member = bot.guilds.cache.get('694810450621366282').member(message.author)
    const role = member.guild.roles.cache.find(role => role.name === "Member");
   
    if(member.roles.cache.has(role.id)){
      message.reply("You are already a member!")
      return;
    }
    
    // Create a message collector
    const filter = m => (m.content && m.author.id != bot.user.id);
    const channel = message.channel;
    const collector = channel.createMessageCollector(filter, { time: 60000 });    
    message.reply("I'm listening...");
    console.log("Collector started");  
    
    collector.on('collect', m => {
      
      if(m.content === 'I have read the rules of this server and have agreed to follow them accordingly'){
        message.reply(`Thank you for your cooperation, Welcome to the server!`);
        member.roles.add(role);
        collector.stop();
      }
      else{
        message.reply("Invalid input: Please check your spelling and try again.");
      }

      });

  
    collector.on('end', collected => {

      const logging = bot.channels.cache.get('697105399836573756');
      const created = formatDate(member.user.createdAt);

      if (collected.size == 0 || !collected.find(m => m.content === 'I have read the rules of this server and have agreed to follow them accordingly')) {
        message.reply("*Yaaaaaawwnnnn* I'm gonna stop listening to you for now...");
        console.log("Collector stopped");
        return;
      }
      else if (collected.size > 0 && !collected.find(m => m.content === 'I have read the rules of this server and have agreed to follow them accordingly')) {
        message.reply("*Yaaaaaawwnnnn* I'm gonna stop listening to you for now...");
        console.log("Collector stopped");
        return;
      }
      else{

        const verify = collected.find(m => m.content === 'I have read the rules of this server and have agreed to follow them accordingly');
        const general = bot.channels.cache.get('694810451065962505');
        
        const embed = new MessageEmbed()
            .setTitle(`${member.displayName} has successfully verified!`)
            .setFooter(member.displayName, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(colors.Green)
            .addField('User information:', stripIndents`**ID:** ${member.user.id}
            **Username:** ${member.user.username}
            **Tag:** ${member.user.tag}
            **Created:** ${created}
            **Verification Phrase:** ${verify}`, true)
        logging.send(embed)
        general.send(`Welcome to da good paking server <@${member.user.id}>! Have fun!`).then(m =>m.delete({timeout: 60000, reason :"It had to be done."}));
        console.log("Collector stopped");
        console.log(`Collected ${collected.size} items:`)
        console.log(`${collected.find(m => m.content === 'I have read the rules of this server and have agreed to follow them accordingly')}`)

      }


    });
  }
});


  bot.on("guildMemberUpdate", async (oldMember, newMember) => {

    const channel = bot.channels.cache.get('699325313930362982')
    const role = newMember.guild.roles.cache.find(role => role.name === "Mods");

   if(!oldMember.roles.cache.has(role.id) && newMember.roles.cache.has(role.id)){
     channel.send(`Congrats <@${newMember.user.id}> on getting the ${role} role!`)
     channel.send({
       files: [{
        attachment: './images/tenor.gif',
        name: 'tenor.gif'
      }] 
     })
     .catch(err => console.error);
   }
   else
   {
     return;
   }

  });


  bot.queue = [];
    
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


 bot.login(process.env.TOKEN);  