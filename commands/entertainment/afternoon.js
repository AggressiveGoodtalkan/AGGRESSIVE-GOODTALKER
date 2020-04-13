module.exports = {
    name: "goodafternoon",
    aliases: ["afternoon"],
    category:"entertainment",
    usage: ["<prefix>command here"],
    run: async(bot, message, args)=>{

        let nsg = await message.channel.send(`GOOD PACKING AFTERNOON TO YOU TOO <@${message.author.id}>!`)
        nsg.delete({timeout: 5000, reason :"It had to be done."})
        message.delete({timeout: 5000, reason :"It had to be done."})

    }
}