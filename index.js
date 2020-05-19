const colors = require("./colors.json");
const Discord = require('discord.js');
const { config } = require("dotenv");
const { default_prefix } = require("./botprefix.json");
const fs = require("fs");
const { MessageEmbed, DMChannel, TextChannel } = require('discord.js');
const { stripIndents } = require("common-tags");
const { formatDate, computeAge } = require("./functions.js");




const bot = new Discord.Client({
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL' , 'REACTION']
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

  const logs = await bot.channels.cache.get('710795359844171797');

  console.log(`✅ ${bot.user.username} is online on ${bot.guilds.cache.size} server/s!`);
  logs.send(`✅ **${bot.user.username}** is online on ${bot.guilds.cache.size} server/s!`);
  bot.user.setActivity("AGGRESSIVELY", {type: "STREAMING"});

});



bot.on('guildMemberAdd', async member => {

  const rules = bot.channels.cache.get('694810450637881348');
  const embed = new MessageEmbed()
    .setTitle("Welcome to the AGGRESSIVE GOODTALKAN Server!")
    .setColor(colors.Green_Sheen)
    .addField("**How to enter the server:**", stripIndents `**1.** Please make sure to read the ${rules} first!
    **2.** Then, react "✅" to the ${rules} message then I will tell you how to enter the server!`, true);

  member.user.send(embed);

});


bot.on('messageReactionAdd', async (reaction, user) => {

    const DaRules = await bot.channels.cache.get('694810450637881348').messages.fetch('702899668903788615');
    const logs = await bot.channels.cache.get('710795359844171797');
    const rules = await bot.channels.cache.get('694810450637881348');

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (err) {
            console.log('Something went wrong while fetching the message.', err);
        }
    }
    const member = bot.guilds.cache.get('694810450621366282').member(user);
    const role = member.guild.roles.cache.find(role => role.name === "Member");


    if (reaction.emoji.name === '✅' && reaction.message.content === DaRules.content) {

        if (member.roles.cache.has(role.id)) {
            user.send(` You are already a member!`);
            return;
        }
        else {

            const embed = new MessageEmbed()
                .setTitle("How to enter the server:")
                .setColor(colors.Green_Sheen)
                .addFields(
                    { name: '__**Step 1:**__', value: stripIndents `Enter \`-start\` to start, the dash is required.
                    **(Make it quick because you would only have 1 minute to complete this.)**`},
                    { name: '__**Step 2:**__', value: stripIndents `**Enter your birthday first to continue.**`},
                    { name: '__**Step 3:**__', value: stripIndents `Then type:
                    \`I have read the rules of this server and have agreed to follow them accordingly\`
                    **(Please write it as plain text.)**`},
                    { name: '__**Step 4:**__', value: stripIndents `If I stop listening to you, just repeat **Steps 1 - 3**.`}
                );
           user.send(embed);
        }

        const lEmbed = new MessageEmbed()
            .setTitle("New Reaction!")
            .setColor(colors.Green)
            .setDescription(`**${member.displayName}** has reacted ${reaction.emoji.name} to the ${rules} message!`);

        logs.send(lEmbed);
    }


    //console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!: ${reaction.emoji.name}`);
});


bot.on('message', async message => {

    const member = bot.guilds.cache.get('694810450621366282').member(message.author);
    const role = member.guild.roles.cache.find(role => role.name === "Member");
    const logs = await bot.channels.cache.get('710795359844171797');

    if (message.content === `-start`) {


        if (message.channel instanceof TextChannel) {
            message.reply("This command is not supported here, it only works on DM channels.").then(m => m.delete({timeout: 5000, reason :"It had to be done."}));
            message.delete({timeout: 6000, reason:"It had to be done"});
            return;
        }


        if(member.roles.cache.has(role.id)){
            message.reply("You are already a member!");
            return;
        }

    const dob_filter = response => response.content;


    message.reply(`Hello! Welcome to the server! Please enter your birthday in this format: \`yyyy-mm-dd\``).then(() => {
        message.channel.awaitMessages(dob_filter, { max: 1, time: 60000 })
        .then(collected =>{

            const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let birthDate = collected.first().content;
            let regex = /(\d+)/g;
            let parts = birthDate.match(regex);
            let dob = new Date(birthDate);
            let birthday = months[dob.getMonth()] + " " + dob.getDate() + ", " + dob.getFullYear();


            if ( parts[1] > 13 || parts[1] < 1 ) {
                message.reply('Invalid month! Please try again.');
                return;
            }
            else if (parts[2] > 31 || parts[2] < 1) { // this is broken for all 28-30 day months
                message.reply('Invalid day! Please try again.');
                return;
            }
            else if (parts[0] > 1000 && !parts[1]){
                message.reply('Invalid input! Please enter a valid month.');
                return;
            }
            else if (parts[0] > 1000 && !parts[2]){
                message.reply('Invalid input! Please enter a valid day.');
                return;
            }
            else if (parts[0] < 1000 || parts[0] > Date.now().getFullYear()){
                message.reply('Invalid input! Please enter a valid year.');
                return;
            }
            else if (birthDate === Date.now()){
                message.reply('Invalid input! You cannnot put the date today!');
                return;
            }

            let age = computeAge(birthDate);

            //message.reply(age);

            if (age < 13) {
                const watchlist = bot.channels.cache.get('695169621757788210');
                message.reply(`I'm sorry, but according to the Discord ToS, only users with the age 13 and above are eligable to enter the server.`);

                const embed = new MessageEmbed()
                    .setTitle(`**${member.displayName}** tried to enter the server!`)
                    .setColor(colors.Red)
                    .setThumbnail(member.user.displayAvatarURL())
                    .addField(`**${member.displayName}**'s information:`, stripIndents `
                    ${member.displayName}'s birthday: ${birthday}
                    ${member.displayName}'s age: ${age} years old.
                    **Please keep an eye out for him**`,true)
                    .setTimestamp()
                    .setFooter(`AGGRESSIVE GOODTALKER | By MahoMuri`, bot.user.displayAvatarURL());

                watchlist.send(embed);
                return;
            }
            else {
                message.reply(`Great! Now please type the verification phrase.`);
                const filter = m => m.content && m.author.id !== bot.user.id;
                const channel = message.channel;
                const collector = channel.createMessageCollector(filter, { time: 60000 });
                console.log("Collector started");
                logs.send("Collector started");


                collector.on('collect', async m => {

                  const verify = m.content === 'I have read the rules of this server and have agreed to follow them accordingly';

                    if(verify){
                        message.reply(`Thank you for your cooperation, Welcome ${member}!`);
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

                  if (collected.size === 0 || !collected.find(m => m.content === 'I have read the rules of this server and have agreed to follow them accordingly')) {
                    message.reply("*Yaaaaaawwnnnn* I'm gonna stop listening to you for now...");
                    console.log("Collector stopped");
                    logs.send("Collector stopped");
                    return;
                  }
                  else if (collected.size > 0 && !collected.find(m => m.content === 'I have read the rules of this server and have agreed to follow them accordingly')) {
                    message.reply("*Yaaaaaawwnnnn* I'm gonna stop listening to you for now...");
                    console.log("Collector stopped");
                    logs.send("Collector stopped");
                    return;
                  }
                  else{

                    const verify = collected.find(m => m.content === 'I have read the rules of this server and have agreed to follow them accordingly');
                    const general = bot.channels.cache.get('694810451065962505');

                    const embed = new MessageEmbed()
                        .setTitle(`${member.displayName} has successfully verified!`)
                        .setTimestamp()
                        .setFooter(member.displayName, member.user.displayAvatarURL())
                        .setThumbnail(member.user.displayAvatarURL())
                        .setColor(colors.Green)
                        .addField('User information:', stripIndents`**ID:** ${member.user.id}
                        **Username:** ${member.user.username}
                        **Tag:** ${member.user.tag}
                        **Created:** ${created}
                        **${member.displayName}'s:** ${age} years old`, true);
                    logging.send(embed);
                    general.send(`Welcome to da good paking server ${member}! Have fun!`).then(m =>m.delete({timeout: 60000, reason :"It had to be done."}));
                    console.log("Collector stopped");
                    logs.send("Collector stopped");
                    console.log("Collected item: ");
                    console.log(`${verify}`);

                    const lEmbed = new MessageEmbed()
                        .setTitle("New Verification!")
                        .setThumbnail(member.user.displayAvatarURL())
                        .setTimestamp()
                        .setColor(colors.Green)
                        .addField(`**${member.user.username} has sucessfully entered the server!**`, `${member} has completed the verification method and entred this phrase:
                        \`${verify}\``);

                    logs.send(lEmbed);

                  }

                });
            }
        });
    });
  }
});


  bot.on("guildMemberUpdate", async (oldMember, newMember) => {

    const channel = bot.channels.cache.get('699325313930362982');
    const Achannel = bot.channels.cache.get('705733221437931540');
    const Media_Channel = bot.channels.cache.get('710487738394345512');
    const mod = newMember.guild.roles.cache.find(role => role.name === "Mods");
    const modmin = newMember.guild.roles.cache.find(role => role.name === "Modmin");
    const creator = newMember.guild.roles.cache.find(role => role.name === "DaGudPakingMediaMaker");

   if(!oldMember.roles.cache.has(mod.id) && newMember.roles.cache.has(mod.id)){
     channel.send(`Congrats <@${newMember.user.id}> on getting the ${mod} role!`);
     channel.send({
       files: [{
        attachment: './images/tenor.gif',
        name: 'tenor.gif'
      }]
     })
     .catch(err => console.error);
   }
   else if(!oldMember.roles.cache.has(modmin.id) && newMember.roles.cache.has(modmin.id)){
    Achannel.send(`Congrats <@${newMember.user.id}> on getting the ${modmin} role!`);
    Achannel.send({
      files: [{
       attachment: './images/king.gif',
       name: 'king.gif'
     }]
    })
    .catch(err => console.error);
  }
  else if(!oldMember.roles.cache.has(creator.id) && newMember.roles.cache.has(creator.id)){
    Media_Channel.send(`Congrats <@${newMember.user.id}> on getting the ${creator} role!`);
    Media_Channel.send({
      files: [{
       attachment: './images/painter.gif',
       name: 'painter.gif'
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

    if (message.channel instanceof DMChannel) {
        return;
    }

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

    if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefixes: default_prefix
        };

        fs.writeFileSync("./prefixes.json", JSON.stringify(prefixes), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    let prefix = prefixes[message.guild.id].prefixes;


  if (message.author.bot) {
    return;
  }
  if (!message.guild){
    return;
  }
  if (!message.content.startsWith(prefix)){
    return;
  }

  // If message.member is uncached, cache it.
  if (!message.member){
    message.member = await message.guild.fetchMember(message);

  }

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0){
    return;
  }

  // Get the command
  let command = bot.commands.get(cmd);

  // If none is found, try to find it by alias
  if (!command){
    command = bot.commands.get(bot.aliases.get(cmd));

  }

  // If a command is finally found, run the command
  if (command){
    command.run(bot, message, args, prefix);

  }

});


 bot.login(process.env.TOKEN);
