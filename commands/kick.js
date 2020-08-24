module.exports = {
    name: "kick",
    description: "kick a user",
    execute(message, args) {

        if (message.member.roles.cache.has("747362781539336304")) {
            const user = message.mentions.users.first();
            if (user) {
                const member = message.guild.member(user);

                if (member) {
                    member.kick("Smell ya later").then(() => {
                        message.reply(`${user.tag}  has been kicked`)
                    }).catch(err => {
                        message.reply(`${user.tag} is too powerful, cant kick`)
                        console.log(err);
                    })
                } else {
                    message.reply("That user does not exist in these realms")
                }
            } else {
                message.reply("That user does not exist in these realms")
            }
        } else {
            message.channel.send("You do no wield the power to do so.")
        }
    }

}