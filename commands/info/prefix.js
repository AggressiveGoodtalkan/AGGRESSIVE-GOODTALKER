const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const colors = require("../../colors.json");
let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));


module.exports = {
    name: "prefix",
    aliases: [""],
    category:"info",
    usage: [`prefix <desired prefix here>`],
    run: async(bot, message, args)=>{

        if (!message.member.hasPermission("MANAGE_SERVER")) {
            return message.reply("You don't have the permission to do this!");
        }

        if (!args[0]) {
            let pEmbed = new MessageEmbed()
            .setColor(colors.Dark_Pastel_Blue)
            .setTitle("Server's Prefix")
            .setDescription(`Prefix is \`${prefixes[message.guild.id].prefixes}\``);

            message.channel.send(pEmbed);
        }
        else {

            prefixes[message.guild.id] = {
                prefixes: args[0]
            };

            fs.writeFileSync("./prefixes.json", JSON.stringify(prefixes), (err) => {
                if (err) {
                    console.error(err);
                }
            });

            let sEmbed = new MessageEmbed()
                .setColor(colors.Green_Sheen)
                .setTitle("Prefix Set!")
                .setDescription(`Set to \`${args[0]}\``);

            message.channel.send(sEmbed);

        }

    }
};
