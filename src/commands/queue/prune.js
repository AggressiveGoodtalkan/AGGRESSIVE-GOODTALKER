const mongoose = require('mongoose');
const savedlist = require('../../models/savedlist.js');


module.exports = {
    name: 'prune',
    aliases: [""],
    category: "queue",
    description: "Cleans the database list dated until last month",
    usage: [`\`-<command | alias> \``],
    run: async (bot, message, args) => {

        await mongoose.connect(process.env.LISTURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).catch(err => console.log(err));

        if (!message.member.roles.cache.some(role => role.name === 'Programmer')) {
            return message.channel.send('**You do not have access to prune the database! Contact a __Programmer__ for more support.**');
        }

        const date = new Date(), y = date.getFullYear(), m = date.getMonth();

        const lastMonth = new Date(y, m);

        await message.channel.send("**Pruning list...**").then(async (msg) => {
            await savedlist.deleteMany({ date: { $lt: lastMonth } })
            .then((query) => {
                //console.log(query);
                if (query.ok === 1) {
                    if (query.deletedCount === 0) {
                        msg.edit('👌 **The list is clean! Nothing to delete!**');
                    } else {
                        msg.edit(`✅ **Success! I have deleted ${query.deletedCount} document${query.deletedCount > 1 ? 's' : ''} from the list!**`);
                    }
                }
            });
        });

        // ============================ "Debugging" ============================
        // const thisMonth = new Date(y, m, d, h, min, seconds, ms);
        // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        // console.log(lastMonth);
        // const cursor = await savedlist.find({
        //     date: { $lte: lastMonth }
        // }).cursor();
        // for (let doc = await cursor.next(); doc !== null; doc = await cursor.next()) {
        //     console.log(doc.date.toLocaleString('en-US', [ {options}, {hour12: true} ])); // Prints documents one at a time
        // }

    }

};
