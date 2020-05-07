const { getMember } = require("../../functions.js");

module.exports = {
    name: "goodafternoon",
    aliases: ["afternoon"],
    category:"entertainment",
    usage: ["<prefix>command here"],
    run: async(bot, message, args)=>{

        const member = getMember(message, args.join(" "));

        let nsg = await message.channel.send(`GOOD PACKING AFTERNOON <@${member.id}>!`);
        message.delete({timeout: 5000, reason :"It had to be done."});

    }
};
