const mongoose = require('mongoose');
const channelsCache = require('../../models/channelsCache.js');

mongoose.connect(process.env.CACHEURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).catch(err => console.log(err));

let isSetup = false;
module.exports = {
    name: 'setup',
    aliases: [""],
    category:"voice",
    description: "Sets up custom voice channels.",
    usage: [`\`-<command | alias> setup\``],
    run: async (bot, message, args) => {

        if (!isSetup) {
            const guild = bot.guilds.cache.get(message.guild.id);
            const memberRole = guild.roles.cache .find(role => role.name === 'Member');

            const filter = m => m.author.id !== bot.user.id;
            await message.channel.send("**Enter the name of the catergory: (e.g. Custom Voice Channels!)**");

            await message.channel.awaitMessages(filter, { max: 1 }).then(async collected => {
                if (collected){
                    message.guild.channels.create(collected.first().content, {
                        type: "category",
                        permissionOverwrites:  [
                            {
                                id: '694810450621366282',
                                deny: ['VIEW_CHANNEL'],
                            },
                            {
                                id: memberRole.id,
                                allow: ['VIEW_CHANNEL']
                            }
                        ],
                    }).then(async category => {

                        await message.channel.send("**Enter the name of the voice channel: (e.g. Voice Channel)**");

                        message.channel.awaitMessages(filter, { max: 1 }).then(async collected => {
                            if (collected){
                                message.guild.channels.create(collected.first().content, {
                                    type: "voice",
                                    parent: category,
                                    permissionOverwrites: [
                                        {
                                            id: '694810450621366282',
                                            deny: ['VIEW_CHANNEL'],
                                        },
                                        {
                                            id: memberRole.id,
                                            allow: ['VIEW_CHANNEL']
                                        }
                                    ],
                                }).then(async (voiceChannel) => {
                                    await message.channel.send("✅ **Done! You're all set and ready to go!**");
                                    isSetup = true;
                                    //Join listener
                                    bot.on('voiceStateUpdate', async (oldState, newState) => {

                                        if (oldState.channelID !== voiceChannel.id && newState.channelID === voiceChannel.id) {
                                            message.guild.channels.create(`${newState.member.user.username}'s Channel`, {
                                                type: "voice",
                                                parent: category,
                                                permissionOverwrites: [
                                                    {
                                                        id: '694810450621366282',
                                                        allow: ['VIEW_CHANNEL'],
                                                    },
                                                    {
                                                        id: newState.member.id,
                                                        allow: ['VIEW_CHANNEL']
                                                    }
                                                ],
                                            }).then(async (channel) => {
                                                newState.setChannel(channel).then((memberState) => {
                                                    const cachedChannel = new channelsCache({
                                                        channelID: memberState.voice.channelID,
                                                        name: memberState.voice.channel.name,
                                                        ownerID: memberState.id
                                                    });

                                                    cachedChannel.save()
                                                    .then(item => {
                                                        console.log(`Successfully added ${memberState.voice.channel.name}'s ID to the database!\n`, item);
                                                    }).catch(err => console.log(err));

                                                });

                                            });
                                        }
                                    });

                                    //Leave listener
                                    bot.on('voiceStateUpdate', async (oldState, newState) => {


                                        if (oldState.channelID !== voiceChannel.id && newState.channelID === voiceChannel.id) {
                                            return;
                                        }
                                        if (bot.channelsCache.channelID === oldState.channelID && newState.channelID !== oldState.channelID) {
                                            let activeMembers = oldState.channel.members.map(member => member.user.username);
                                            //console.log(activeMembers.length);
                                            if (activeMembers.length === 0) {
                                                oldState.channel.delete();
                                                delete bot.channelsCache[oldState.channelID];
                                            }
                                        }
                                    });

                                });
                            }
                        });
                    });
                }
            });
        } else{
            return message.channel.send("**I'm already setup!**");
        }
    }

};
