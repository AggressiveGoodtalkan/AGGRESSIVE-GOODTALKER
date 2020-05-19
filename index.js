/**
 * @file main(): basically where everything is initialized
 */

// Imports
const ascii = require("ascii-table");
const { Client, Collection } = require('discord.js');
const { config } = require("dotenv");
const { readdirSync } = require("fs");

// Setup bot
const bot = new Client({
    disableEveryone: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

bot.aliases = new Collection();
bot.categories = readdirSync(`${__dirname}/commands`);
bot.commands = new Collection();
bot.queue = [];

// Setup configuration
config({
    path: `${__dirname}/.env`
});

// Setup listeners
let lstTable = new ascii('listeners');
lstTable.setHeading('Listener', 'Status');
let listeners = readdirSync(`${__dirname}/event_listeners`).filter(v => v.endsWith('.js'));
listeners.forEach(v => {
    require(`${__dirname}/event_listeners/${v}`)(bot);
    lstTable.addRow(v, 'Loaded');
});
console.log(lstTable.toString());

// Setup commands
let cmdTable = new ascii("commands");
cmdTable.setHeading("Command", "Load status");
bot.categories.forEach(dir => {
    let commands = readdirSync(`${bot.categories}/${dir}`).filter(f => f.endsWith(".js"));
    commands.forEach(file => {
        let pull = require(`${bot.categories}/${dir}/${file}`);
        if (pull.name) {
            bot.commands.set(pull.name, pull);
            cmdTable.addRow(file, 'Loaded');
            if (pull.aliases && Array.isArray(pull.aliases)) {
                pull.aliases.forEach(alias => bot.aliases.set(alias, pull.name));
            }
        } else {
            cmdTable.addRow(file, 'Error -> No name defined');
        }
<<<<<<< HEAD
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
=======
>>>>>>> Lyonlancer5-modularization
    });
});
console.log(cmdTable.toString());

// Now login
bot.login(process.env.TOKEN);
