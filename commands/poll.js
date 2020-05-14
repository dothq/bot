const discord = require('discord.js')
const numWords = require('num-words')
const emoji = require('node-emoji')

exports.run = async (bot, message, args) => {
    const msg = message;

    if (!message.member.roles.cache.has('525057083352285184') || !message.member.roles.cache.has('662323136343179264')) {
        return message.channel.send('You don\'t have access to this command.')
    } 

    const bigString = (args.join(" ").split('<>').pop().split('</>')[0]).replace("</>", "")

    const chs = args.join(" ").split(bigString)[1].replace("</>", "")

    if(chs) {
        if(chs.includes(":") && chs.split(":")) {
            const choices = chs.split(":");

            let description = `**${bigString}**\n Pick an option using the reactions below the message.\n`

            choices.forEach((choice, index) => {
                description += `\n:${numWords(index + 1)}:  ${choice}`
            })

            const embed = new discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setColor('#2f3136')
                .setTitle(`📊  Poll started by ${message.author.username}`)
                .setDescription(`${description}`)
            message.channel.send(embed).then(msg => {
                [...Array(choices.length)].map((_, i) => {
                    msg.react(emoji.emojify(`:${numWords(i + 1)}:`))
                })
            })
        } else {
            const embed = new discord.MessageEmbed()
                .setTitle(`❌  You must add your choices for the poll with : dividers, for example foo:bar:foo`)
                .setColor('#2f3136')
            message.channel.send(embed)
        }
    } else {
        const embed = new discord.MessageEmbed()
            .setTitle(`❌  You must add your choices for the poll with : dividers, for example foo:bar:foo`)
            .setColor('#2f3136')
        message.channel.send(embed)
    }
}

exports.help = {
    name: 'poll',
    aliases: ['p', 'sp']
}