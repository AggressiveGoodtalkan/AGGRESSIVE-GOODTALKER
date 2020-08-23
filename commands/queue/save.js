const mongoose = require('mongoose');
const savedlist = require('../../models/savedlist.js');

mongoose.connect(process.env.LISTURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).catch(err => console.log(err));


module.exports = {
    name: "save",
    aliases: ["s"],
    category:"queue",
    description: "Saves the current list to the database",
    usage: [`\`-<command | alias>\``],
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

            message.delete({timeout: 5000, reason:"It had to be done"});
            const members = bot.queue.map(m => m.id);
            const list = new savedlist({
                author: mongoose.Types.ObjectId(),
                title: "The GOOD PAKING LIST",
                body: members.toString(),
                date: message.createdAt
            });

            await message.channel.send("Saving...").then((msg) =>{
                list.save()
                .then(item => {
                    msg.edit("List has been saved successfully to the database!");
                    console.log(item);
                }).catch(err => console.log(err));

            });


        }
    }
};
