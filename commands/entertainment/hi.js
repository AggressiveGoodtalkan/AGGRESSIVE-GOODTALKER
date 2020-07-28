const { getMember } = require("../../functions.js");

module.exports = {
    name: "hi",
    aliases: ["hey", "hello"],
    category:"entertainment",
    description: "Replies Hello",
    usage: [`\`-<command | alias>\``],
    run: async(bot, message, args)=>{

        const member = getMember(message, args.join(" "));

        let nsg = await message.channel.send(`Hello ${member}!`);
        nsg.delete({timeout: 5000, reason :"It had to be done."});
        message.delete({timeout: 5000, reason :"It had to be done."});

    }
};
