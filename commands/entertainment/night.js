const { getMember } = require("../../functions.js");

module.exports = {
    name: "goodnight",
    aliases: ["night"],
    category:"entertainment",
    description : "Replies a Good Night message",
    usage: [`\`-<command | alias> [@user]\``],
    run: async(bot, message, args)=>{

        const member = getMember(message, args.join(" "));

        let nsg = await message.channel.send(`GOOD PACKING NIGHT <@${member.id}>!`);
        message.delete({timeout: 5000, reason :"It had to be done."});


    }
};
