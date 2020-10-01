const mongoose = require('mongoose');
const savedlist = require('../../models/savedlist.js');

module.exports = {
    name: 'load',
    aliases: [""],
    category: "queue",
    description: "Loads the saved list.",
    usage: [`\`-<command | alias> \``],
    run: async (bot, message, args) => {

        await mongoose.connect(process.env.LISTURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).catch(err => console.log("Error on load.js\n",err));

        await message.channel.send("**Loading list...**").then(async (msg) => {
            const cursor = await savedlist.find({}).cursor();
            let temporaryArray = [];
            for (let doc = await cursor.next(); doc !== null; doc = await cursor.next()) {
                // console.log(doc); // Prints documents one at a time
                temporaryArray.push(doc);
            }
            temporaryArray.sort((a, b) => b.date - a.date); // Valid by ISO-8601 standard
            //console.log(temporaryArray);
            let membersIDs = temporaryArray[0].body;
            bot.queue.length = 0;
            for (let i = 0; i < membersIDs.length; i++){
                bot.queue.push(bot.guilds.cache.get(message.guild.id).member(membersIDs[i]));
            }
            msg.edit('✅ **Successfully loaded the list!**');

        });

    }

};
