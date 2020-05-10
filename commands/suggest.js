const discord = require('discord.js')
const db = require('quick.db')

exports.run = async (bot, message, args) => {
    const msg = message
    const embed = new discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setColor('#2f3136')
        .setTitle(`👋 Hi there.`)
        .setDescription(`Please select the product you want to suggest your idea for.\n\n1️⃣ Dot Browser\n2️⃣ Dot Drop\n3️⃣ Dot HQ Website (dothq.co)\n4️⃣ Dot Browser Website (browser.dothq.co)\n5️⃣ Other`)
    const onboard = await message.channel.send(embed)
    const filter = reply => reply.author.id != bot.user.id && reply.author.id == message.author.id
    message.channel.awaitMessages(filter, {
        max: 1,
        time: 10000,
        errors: ['time']
    }).then(reply => {
        console.log(reply)
        if(reply.first().content) {
            let choice = parseInt(reply.first().content);

            console.log(choice, isNaN(choice), choice >= 1, choice <= 5)

            let formatted = ['one', 'two', 'three', 'four', 'five']
            let choices = ['Dot Browser', 'Dot Drop', 'HQ Website', 'Browser Website', 'Other']

            if(!isNaN(choice) && choice >= 1 && choice <= 5) {
                reply.first().delete()

                const embed = new discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setColor('#2f3136')
                    .setTitle(`:${formatted[choice - 1]}: ${choices[choice - 1]}`)
                    .setDescription(`Please now type in your suggestion in under 256 characters. **Take your time as you cannot go back and edit your suggestion, you get one attempt to make it perfect. Good luck!**`)
                onboard.edit(embed)

                let attempts = 0;

                message.channel.awaitMessages(reply => reply.author.id != bot.user.id && reply.author.id == message.author.id, {
                    max: 1,
                    time: 300000,
                    errors: ['time', 'max']
                }).then(async reply1 => {
                    reply.first().delete()
                    msg.delete()

                    if(reply1.first().content) {
                        let suggestion = reply1.first().content

                        if(suggestion.length <= 256 && suggestion.length >= 12) {
                
                            onboard.delete()

                            const choiceEmojis = [
                                'https://i.imgur.com/mwL3zjn.png',
                                'https://i.imgur.com/7ZO0qdW.png',
                                'https://i.imgur.com/sNqcQKS.png',
                                'https://i.imgur.com/sNqcQKS.png',
                                'https://i.imgur.com/JUgZztc.png'
                            ]

                            bot.channels.fetch('622786432720961556').then(ch => {
                                db.add('suggestions', 1)
                                const embed = new discord.MessageEmbed()
                                    .setAuthor(choices[choice - 1], choiceEmojis[choice - 1])
                                    .setColor('#2f3136')
                                    .setTitle(`💫  Suggestion from ${message.author.username}`)
                                    .setDescription(`${suggestion}`)
                                    .setFooter(`Suggestion #${db.get('suggestions')}`)
                                ch.send(embed).then(omsg => {
                                    omsg.react("👍")
                                    omsg.react("👎")
                                    omsg.react("🤔")
                                    db.set(`suggestion_${db.get('suggestions')}`, {message_id: omsg.id, choice: choice - 1, content: suggestion, author: message.author.id, message: message.id})
                                })
                            })
                            reply1.first().react("✅")
                
                            setTimeout(() => {
                                reply1.first().delete()
                            }, 4000);
                        } else {
                            reply1.first().delete()
                            msg.delete()
                            const embed = new discord.MessageEmbed()
                                .setTitle(`❌ Your suggestion must be over 12 characters and 256 maximum.`)
                                .setColor('#2f3136')
                            onboard.edit(embed);

                            setTimeout(() => {
                                onboard.delete()
                            }, 4000);
                        }
                    }
                })
            } else {
                reply.first().delete()
                msg.delete()

                const embed = new discord.MessageEmbed()
                    .setTitle(`❌  Product number invalid.`)
                    .setColor('#2f3136')
                onboard.edit(embed)

                setTimeout(() => {
                    onboard.delete()
                }, 4000);
            }
        }
    })
}

exports.help = {
    name: 'suggest',
    aliases: ['suggestion', 's']
}