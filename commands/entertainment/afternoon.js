module.exports = {
    name: "goodafternoon",
    aliases: ["afternoon"],
    category:"entertainment",
    usage: ["<prefix>command here"],
    run: async(bot, message, args)=>{
    
        let rMember = message.mentions.members.first()

        if(rMember){
            message.channel.send(`GOOD PACKING AFTERNOON TO YOU TOO <@${rMember.id}>!`).then(m => m.delete({timeout: 15000, reason :"It had to be done."}))
            message.delete({timeout: 15000, reason :"It had to be done."})
        }
        
        let nsg = await message.channel.send(`GOOD PACKING AFTERNOON TO YOU TOO <@${message.author.id}>!`)
        nsg.delete({timeout: 15000, reason :"It had to be done."})
        message.delete({timeout: 15000, reason :"It had to be done."})

    }
}