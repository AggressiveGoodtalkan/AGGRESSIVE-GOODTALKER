const { MessageEmbed } = require('discord.js');
const { isLeapYear } = require("../../functions.js");
const colors = require("../../colors.json");

module.exports = {
    name: "date",
    aliases: ["today"],
    category:"info",
    description: "Tells the day today or checks is the year is a leap year or not.",
    usage: [`\`-<command | alias> [year]\``],
    run: async(bot, message, args)=>{

        let year = args[0];
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let days = ["Sunday", "Monday" , "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let leapYear = isLeapYear(year);
        let date = new Date(Date.now());
        let today = days[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();


        if (!year) {
            const embed = new MessageEmbed()
                .setTitle("Today is")
                .setColor(colors.Turquoise)
                .setDescription(`**${today}**`);

            message.channel.send(embed);
        }else if (leapYear === true) {
            const embed = new MessageEmbed()
                .setTitle("Leap Year!")
                .setColor(colors.Green)
                .setDescription(`${year} is a leap year.`);

            message.channel.send(embed);

        }
        else if (leapYear === false) {
            const embed = new MessageEmbed()
                .setTitle("Non-Leap Year!")
                .setColor(colors.Red)
                .setDescription(`${year} is a non-leap year.`);

            message.channel.send(embed);
        }

    }
};
