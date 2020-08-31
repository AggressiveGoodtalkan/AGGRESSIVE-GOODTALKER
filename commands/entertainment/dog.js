const axios = require("axios").default;
const cheerio = require("cheerio");

const queryString = require("query-string");
const colors = require("../../colors.json");
const { MessageEmbed } = require("discord.js");
const { filterBreed } = require("../../functions.js");

const dogApiInstance = axios.create({
    baseURL: "https://api.thedogapi.com/v1/images",
    timeout: 5000,
    headers: {
        "X-API-KEY": process.env.DOG_API_KEY
    }
});

const dogBreedInstance = axios.create({
    baseURL: "https://dogtime.com/dog-breeds",
    timeout: 5000,
    responseType: "document",
    transformResponse: [function(data) {
        return cheerio.load(data);
    }]
});


module.exports = {
  name: "dog",
  aliases: ["bark", "howl"],
  category:"entertainment",
  description: "Displays a random dog",
  usage: [`\`-<command | alias>\``],
  run: async (bot, message, args) => {

    let nsg = await message.channel.send("Generating...");

    async function loadImage(sub_id) {
        let query_params = {
            has_breeds: true, // we only want images with at least one breed data object - name, temperament etc
            mime_types: "jpg,png", // we only want static images as Discord doesn't like gifs
            size: "small", // get the small images as the size is prefect for Discord's 390x256 limit
            sub_id: sub_id, // pass the message senders username so you can see how many images each user has asked for in the stats
            limit: 1, // only need one
            facts: true
        };
        // convert this obejc to query string
        let querystring = queryString.stringify(query_params);
        let response;

        try {
            // Send the request
            response = (await dogApiInstance.get(`/search?${querystring}`)).data;
        } catch (e) {
            console.log(e);
        }
        return response;
    }

    let breedName;
    try {
        // pass the name of the user who sent the message for stats later, expect an array of images to be returned.
        let images = await loadImage(message.author.username);

        //list words to be filtered out for dogtime.com
        let filter = 'minature';


        // get the Image, and first Breed from the returned object.
        let image = images[0];
        let breed = image.breeds[0];
        let toFilter = breed.name.toLowerCase();
        breedName = filterBreed(toFilter, filter);

        //console.log(url);
        let description = [];

        await dogBreedInstance.get(`/${breedName}#/slide/1`).then((response) => {
            response.data(".breeds-single-intro > p").each(function(i, elem) {
                description[i] = cheerio(this).text();
            });
        });

        //console.log(`${description[0]}`);
        console.log("message processed", "showing", breed);

        let cEmbed = new MessageEmbed()
            .setTitle("Here's a random dog!")
            .setColor(colors.Turquoise)
            .addFields(
                {
                    name: "**Breed:**",
                    value: `*${breed.name}*`,
                    inline: true
                },
                {
                    name: "**Temperament:**",
                    value: `*${breed.temperament}*`,
                    inline: true
                },
                {
                    name: "**Life Span:**",
                    value: `*${breed.life_span}*`,
                    inline: true
                },
                {
                    name: "**Description:**",
                    value: `${description[0]}`,
                    inline: true
                },
            )
            .setImage(image.url);
        message.channel.send(cEmbed);
    } catch (error) {
        const embed = new MessageEmbed()
            .setColor(colors.Red)
            .setTitle("Error")
            .setDescription('Oops, it seems that I took too long to respond. Please try again.');
        message.channel.send(embed);
        //console.log(breedName);
    }
    nsg.delete();
  }
};
