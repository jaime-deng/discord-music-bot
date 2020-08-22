const Discord = require("discord.js");

// const {prefix, token} = require ("./config.json");

const fs = require("fs");

require("dotenv").config();
// console.log(process.env)

const prefix = process.env.PREFIX
const client = new Discord.Client();

// const prefix = "-"


client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command)
}

client.once("ready", () => {
    console.log("islapMusic is online")
})

client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase()

    if (command === "reggie") {
        client.commands.get("reggie").execute(message, args)
    } else if (command == "brandon") {
        client.commands.get("brandon").execute(message, args)
    } else if (command == "alston") {
        client.commands.get("alston").execute(message, args)
    } else if (command == "commands") {
        client.commands.get("commands").execute(message, args)
    }
})
// last line
client.login(process.env.TOKEN);