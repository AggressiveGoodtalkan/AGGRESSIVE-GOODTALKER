const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    aliases: [""],
    category: "",
    description: "",
    usage: [`\`-<command | alias> \``],
    run: async (bot, message, args) => {

        function play(connection, message, url) {
            let server = bot.servers[message.guild.id];

            server.dispatcher = connection.play(ytdl(server.queue[0]), {bitrate: 'auto'});

            server.dispatcher.on('end',() => {
                if (server.queue[0]){
                    play(connection, message, url);
                }else{
                    connection.disconnect();
                }
            });

            server.dispatcher.on('error', (error) => {
                console.log(error);
                play(connection, message, url);
            });
        }

        if (message.member.voice.channel) {
            let song = args[0];
            if (!song) {
                let server = await bot.servers[message.guild.id];

                if (!server) {
                    return message.channel.send("**The Music Queue Is Empty! Use \`-play\` to add more!**");
                }else if(server.dispatcher){
                    server.dispatcher.resume();
                }

            }else{
                try {
                    let url = new URL(song);
                    // console.log(url);

                    if (!bot.servers[message.guild.id]) {
                        bot.servers[message.guild.id] = {
                            queue: []
                        };
                    }

                    let server = bot.servers[message.guild.id];

                    if(!message.member.voice.connection && server.queue.length === 0) {
                        await server.queue.push(song);
                        console.log(server.queue);
                        message.member.voice.channel.join().then((connection) => {
                            play(connection, message, url);
                        });
                    }else{
                        server.queue.push(song);
                        console.log(server.queue);
                    }
                } catch (error) {
                    message.channel.send(`❌ **Error: ** \`${error.input}\` ** is not a valid URL!**`);
                    console.log(error.input);
                }
            }


        }else{
            return message.channel.send("❌ **Please join a Voice Channel first!**");
        }
    }

};
