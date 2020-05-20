const discord = require('discord.js')
const db = require('quick.db')

exports.run = async (bot, message, args) => {
    const msg = message

    const suggestion = args.join(" ")

    if(suggestion.length == 0) return;

    bot.channels.fetch('622786432720961556').then(ch => {
        db.add('suggestions', 1)
        const embed = new discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setColor('#2f3136')
            .setTitle(`💫  Suggestion from ${message.author.username}`)
            .setDescription(`${suggestion}`)
            .setFooter(`Suggestion #${db.get('suggestions')}`)
        ch.send(embed).then(omsg => {
            omsg.react("👍")
            omsg.react("👎")
            omsg.react("🤔")
            db.set(`suggestion_${db.get('suggestions')}`, {message_id: omsg.id, content: suggestion, author: message.author.id, message: message.id})
        })
    })
    msg.react("✅")

    setTimeout(() => {
        msg.delete()
    }, 4000);
}

exports.help = {
    name: 'suggest',
    aliases: ['suggestion', 's']
}