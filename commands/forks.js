const axios = require('axios')
const discord = require('discord.js')

exports.run = async (bot, message, args) => {
    var repo = 'dothq/browser'
    var name = 'Dot Browser'
    axios.get(`https://api.github.com/repos/${repo}`)
        .then(res => {
            res = res.data;

            const embed = new discord.MessageEmbed()
                .setColor('#2f3136')
                .setTitle(`🍴 **${res.forks}** Forks of ${name}`)
            message.channel.send(embed)
    })
}

exports.help = {
    name: 'forks',
    aliases: ['fork', 'github-fork', 'github-forks']
}