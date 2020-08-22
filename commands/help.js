module.exports = {
    name: "commands",
    description: "Names command",
    execute(message, args){
        message.channel.send("-alston, shows last name \n -brandon, shows last name \n -reggie, shows last name")
    }
}