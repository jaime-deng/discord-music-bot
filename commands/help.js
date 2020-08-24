module.exports = {
    name: "commands",
    description: "Names command",
    execute(message, args){
        message.channel.send("/kick, Kicks a user from the server \n/ban, bans a user from the server \n/reggie, shows last name")
    }
}