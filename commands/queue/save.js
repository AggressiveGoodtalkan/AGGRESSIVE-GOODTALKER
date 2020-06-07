const mongoose = require('mongoose');
const savedlist = require('../../models/savedlist.js');

mongoose.connect('mongodb://localhost/SavedList',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).catch(err => console.log(err));


module.exports = {
    name: "save",
    aliases: ["s"],
    category:"queue",
    usage: ["<prefix>command here"],
    run: async(bot, message, args)=>{

        if (bot.queue.length === 0) {
            message.reply("The queue is empty! There is nothing to save!")
            .then(m => m.delete({timeout: 5000, reason:"It had to be done"}));
            message.delete({timeout: 6000, reason:"It had to be done"});
            return;
        }

        const role = message.guild.roles.cache.find(role => role.name === "Performer");
        const member = bot.guilds.cache.get('694810450621366282').member(bot.queue[0]);
        const performer = member.roles.cache.has(role.id);

        if (bot.queue.length > 0) {

            let queueList;
            for (let i = 0; i < bot.queue.length; i++) {

                if (i === 0 && performer) {
                    queueList = queueList + `${i + 1}. ${bot.queue[i].username} (Currently Performing)\n\n`;
                }
                else {
                    queueList = queueList + `${i + 1}. ${bot.queue[i].username}\n\n`;
                }
            }

            message.delete({timeout: 5000, reason:"It had to be done"});

            const list = new savedlist({
                author: mongoose.Types.ObjectId(),
                title: "The GOOD PAKING LIST",
                body: queueList.slice(9),
                date: message.createdAt
            });

            list.save()
            .then(item => console.log(item))
            .catch(err => console.log(err));

            const msg = await message.channel.send("Saving...");
            msg.edit("List has been saved successfully to the database!");


        }
    }
};
