require("dotenv").config();
const Discord = require("discord.js");
const { Util } = require("discord.js");
const YouTube = require("simple-youtube-api");
const ytdl = require('ytdl-core');
const fs = require("fs");
const youtube = new YouTube(process.env.GOOGLE_API_KEY)
const queue = new Map()



// console.log(process.env)

const prefix = process.env.PREFIX
const client = new Discord.Client();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command)
}


client.once("ready", () => {
    console.log("islapBot is online")
})

client.on("message", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const kickArgs = message.content.substring(prefix.length).split(" ");
    const command = args.shift().toLowerCase()
    const serverQueue = queue.get(message.guild.id)
    const searchString = kickArgs.slice(1).join(" ")
    const url = kickArgs[1] ? kickArgs[1].replace(/<(.+)>/g, "$1") : ""

    // music player
    if (message.content.startsWith(prefix + "play")) {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) return message.reply("You need to be in a voice channel!")
        const permissions = voiceChannel.permissionsFor(message.client.user)
        if (!permissions.has("CONNECT")) return message.channel.send("You do not have permission to connect to the voice channel!")
        if (!permissions.has("SPEAK")) return message.channel.send("You do not have permission to speak in the voice channel!")

        try {
            var video = await youtube.getVideoByID(url)
        } catch {
            try {
                var videos = await youtube.searchVideos(searchString, 1)
                var video = await youtube.getVideoByID(videos[0].id)
            }catch {
                return message.channel.send("I cant find any search results")
            }
        }
        // queue
  
        const song = {
            id: video.id,
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`
        }

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            }
            queue.set(message.guild.id, queueConstruct)

            queueConstruct.songs.push(song)

            try {
                var connection = await voiceChannel.join()
                queueConstruct.connection = connection
                play(message.guild, queueConstruct.songs[0])
            } catch (error) {
                console.log("error in connecting to voice channel")
                queue.delete(message.guild.id)
                message.channel.send("There was an error connection to the voice channel!")
            }
        } else {
            serverQueue.songs.push(song)
            return message.channel.send(`**${song.title}** has been added to the queue!`)
        }

        return undefined

    } else if (message.content.startsWith(prefix + "stop")) {
        if (!message.member.voice.channel) return message.channel.send("You must be in voice channel to stop the music!")
        if (!serverQueue) return message.channel.send("There is nothing playing")
        serverQueue.songs = []
        serverQueue.connection.dispatcher.end()
        message.channel.send("I have stopped the music for you, goodbye")
        return undefined
    } else if (message.content.startsWith(prefix + "skip")) {
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to ship the music")
        if (!serverQueue) return message.channel.send("There is nothing playing")
        serverQueue.connection.dispatcher.end()
        message.channel.send("I have skipped the music for you")
        return undefined
    } else if (message.content.startsWith(prefix + "volume")) {
        if(!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use music commands!")
        if(!serverQueue) return message.channel.send("There is currently nothing playing")
        if(!kickArgs[1]) return message.channel.send(`The volume is: **${serverQueue.volume}**`)
        if(isNaN(kickArgs[1])) return message.channel.send("That is not a valid amount to change the volume to!")
        serverQueue.volume = kickArgs[1]
        serverQueue.connection.dispatcher.setVolumeLogarithmic(kickArgs[1] / 5)
        message.channel.send(`I have changed the volume to: **${kickArgs[1]}**`)
        return undefined
    } else if (message.content.startsWith(prefix + "queue")) {
        if(!serverQueue) return message.channel.send("There is nothing playing")
        message.channel.send(`
        __**Song Queue**__
        ${serverQueue.songs.map(song => `**-** ${song.title}`).join("\n")}

        **Now Playing:** ${serverQueue.songs[0].title}
        `, {split: true})
        return undefined
    } else if (message.content.startsWith(prefix + "pause")) {
        if(!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to pause")
        if(!serverQueue) return message.channel.send("THere is nothing playing")
        if(!serverQueue.playing) return message.channel.send("The music is already paused")
        serverQueue.playing = false
        serverQueue.connection.dispatcher.pause()
        message.channel.send("Music has been paused")
        return undefined
    } else if (message.content.startsWith(prefix +"resume")){
        if(!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to resume")
        if(serverQueue.playing) return message.channel.send("The music is already playing")
        serverQueue.playing = true
        serverQueue.connection.dispatcher.resume()
        message.channel.send("I have now resumed the music for you")
        return undefined
    }

    // command helper
    if (command === "reggie") {
        client.commands.get("reggie").execute(message, args)
    } else if (command === "commands") {
        client.commands.get("commands").execute(message, args)
    } else if (command === "kick") {
        client.commands.get("kick").execute(message, args)
    } else if (command === "ban") {
        client.commands.get("ban").execute(message, args)
    }
})

function play(guild, song) {
    const serverQueue = queue.get(guild.id)

    if (!song) {
        serverQueue.voiceChannel.leave()
        queue.delete(guild.id)
        return
    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift()
            play(guild, serverQueue.songs[0])
        })
        .on("error", error => {
            console.log(error)
        })
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)

    serverQueue.textChannel.send(`Now Playing: **${song.title}**`)
}

// async function searchYouTubeAsync(args) {
//     var video = await youtube.searchVideos(args.toString().replace(/,/g,' '));
//     console.log(video.url);
//     console.log(typeof String(video.url));
//     return String(video.url);
//   }

// last line
client.login(process.env.TOKEN);