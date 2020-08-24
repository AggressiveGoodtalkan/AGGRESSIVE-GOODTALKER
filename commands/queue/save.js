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

        if (bot.queue.length > 0) {
            // ============================ "Debugging" ============================
            const date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate(), h = date.getHours(),
            min = date.getMinutes(), seconds = date.getSeconds(), ms = date.getMilliseconds();
            const thisMonth = new Date(y, m, d, h, min, seconds, ms);
            const lastMonth = new Date(y, m-4, d, h, min, seconds, ms);

            message.delete({timeout: 5000, reason:"It had to be done"});
            const members = bot.queue.map(m => m.id);
            const list = new savedlist({
                author: mongoose.Types.ObjectId(),
                title: "The GOOD PAKING LIST",
                body: members.toString(),
                date: lastMonth
            });

            await message.channel.send("Saving...").then((msg) =>{
                list.save()
                .then(item => {
                    msg.edit("✅ **List has been saved successfully to the database!**");
                    console.log("✅ **List has been saved successfully to the database!**\n",item);
                }).catch(err => {
                    msg.edit("🛑 **Failed to save list the database! Contact a Programmer for assistance!**");
                    console.log(err);
                });

            });



        }
    }
};
