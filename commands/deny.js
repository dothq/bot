const db = require('quick.db')
const discord = require('discord.js')

// TODO: Make it so that it adds this to a card.

exports.run = async (bot, message, args) => {
    if (!message.member.roles.cache.has('525057083352285184') || !message.member.roles.cache.has('662323136343179264')) {
        return message.channel.send('You don\'t have access to this command.')
    } 
    if (!db.get(`suggestion_${args[0]}`)) {
        return message.channel.send('You need to accept a valid suggestion.')
    }
    bot.channels.fetch('622786432720961556').then(ch => {
        let choices = ['Dot Browser', 'Dot Drop', 'HQ Website', 'Browser Website', 'Other']
        const choiceEmojis = [
            'https://i.imgur.com/mwL3zjn.png',
            'https://i.imgur.com/7ZO0qdW.png',
            'https://i.imgur.com/sNqcQKS.png',
            'https://i.imgur.com/sNqcQKS.png',
            'https://i.imgur.com/JUgZztc.png'
        ]   

        bot.users.fetch(db.get(`suggestion_${args[0]}.author`)).then(fetchedUser => {
            ch.messages.fetch(db.get(`suggestion_${args[0]}.message_id`)).then(msg => {
                db.set(`suggestion_${args[0]}.status`, 'denied')
                const embed = new discord.MessageEmbed()
                    .setAuthor(choices[db.get(`suggestion_${args[0]}.choice`)], choiceEmojis[db.get(`suggestion_${args[0]}.choice`)])
                    .setColor('#e51d24')
                    .setTitle(`:x: Denied • Suggestion from ${fetchedUser.username}`)
                    .setDescription(`${db.get(`suggestion_${args[0]}.content`)}`)
                    .setFooter(`Suggestion #${args[0]}`)
                msg.edit(embed)
                msg.reactions.removeAll()
            })
            message.channel.send(`Denied **Suggestion #${args[0]}**.`)
        })     
    })
}

exports.help = {
    name: 'deny',
    aliases: []
}