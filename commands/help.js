module.exports = {
    name: "commands",
    description: "Names command",
    execute(message, args){
        message.channel.send("**/ban**, bans a user from the server \n**/kick**, Kicks a user from the server \n**/pause**, pauses the current song\n**/play** link or title, plays requested song \n**/queue**, shows music queue\n**/reggie**, shows last name\n**/resume**, resumes the song\n**/stop**, stops playing\n**/volume**, checks current volume\n**/volume number**, changes the volume to number added")
    }
}