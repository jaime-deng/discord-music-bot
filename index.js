const Discord = require("discord.js");

const fs = require("fs");

require("dotenv").config();
// console.log(process.env)

const prefix = process.env.PREFIX
const client = new Discord.Client();


client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command)
}

// client.on("guildMemberAdd", (member) => {
//     const channel = member.guild.channels.find(channel => channel.name === "welcome");
//     if(!channel) return;

//     channel.send(`Welcome to the server, ${member}.`)
// })



client.once("ready", () => {
    console.log("islapMusic is online")
})

client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const kickArgs = message.content.substring(prefix.length).split(" ");
    const command = args.shift().toLowerCase()


    if (command === "reggie") {
        client.commands.get("reggie").execute(message, args)
    } else if (command == "commands") {
        client.commands.get("commands").execute(message, args)
    } else if (command == "kick") {
        client.commands.get("kick").execute(message, args)
    } else if (command == "ban") {
        client.commands.get("ban").execute(message, args)
    }
})
// last line
client.login(process.env.TOKEN);