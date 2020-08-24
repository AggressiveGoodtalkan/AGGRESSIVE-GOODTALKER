const mongoose = require('mongoose');
const savedlist = require('../../models/savedlist.js');

mongoose.connect(process.env.LISTURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).catch(err => console.log(err));

module.exports = {
    name: 'prune',
    aliases: [""],
    category: "queue",
    description: "Cleans the database list dated until last month",
    usage: [`\`-<command | alias> \``],
    run: async (bot, message, args) => {

        if (!message.member.roles.cache.some(role => role.name === 'Programmer')) {
            return message.channel.send('**You do not have access to prune the database! Contact a __Programmer__ for more support.**');
        }

        const lastMonth = new Date().getMonth() - 1;
        //console.log(lastMonth);
        await message.channel.send("Pruning list...").then(async (msg) => {
            await savedlist.deleteMany({date: { $lte: lastMonth}})
            .then((query) => {
                if (query.ok === 1) {
                    if (query.deletedCount === 0) {
                        msg.edit(`The list is clean! Nothing to delete!`);
                    } else {
                        msg.edit(`Success! I have deleted ${query.deletedCount} documents from the list!`);
                    }
                }
            });

        });

    }

};
