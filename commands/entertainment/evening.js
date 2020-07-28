const { getMember } = require("../../functions.js");

module.exports = {
    name: "goodevening",
    aliases: ["evening"],
    category:"entertainment",
    description: "Replies a Good Evening message",
    usage: [`\`-<command | alias> [@user]\``],
    run: async(bot, message, args)=>{

        const member = getMember(message, args.join(" "));

        let nsg = await message.channel.send(`GOOD PACKING EVENING ${member}!`);
        message.delete({timeout: 5000, reason :"It had to be done."});

    }
};
