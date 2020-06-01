const axios = require('axios')
const discord = require('discord.js')
const { format } = require('timeago.js')
const db = require('quick.db')

exports.run = (bot) => {
  console.log('I am ready!')
  setInterval(() => {
    bot.user.setActivity('the Dot Community', {
      type: 'WATCHING'
    })
  }, 10000)
  setInterval(function () {
    axios.get('https://dothq.co/api/builds.all').then(response => {
      var rawdata = response.data.results
      var d = rawdata.reverse()
      const id = db.get('cachedBuildId')
      if (d[0].id !== id) {
        db.set('cachedBuildId', d[0].id)
        bot.channels.fetch('716966031091957781').then(ch => {
          ch.send('<@&716964461306577007> **New build!**')
          axios.get('https://dothq.co/api/builds.all').then(response => {
            var rawdata = response.data.results
            var d = rawdata.reverse()
            var releasesAt = format(new Date(d[0].unlocksAt), 'en_US')
            const e = new discord.MessageEmbed()
              .setTitle(`📦 ${d[0].version} dropping soon!`)
              .setDescription(`A new build was uploaded for **${d[0].productName}**, [click here](https://dothq.co/beta) to download it, it releases **${releasesAt}**`)
              .addField(':desktop: Supported OS', `${d[0].supportedOs.join(', ')}`, true)
              .setColor('#2f3136')
              .setFooter('Uploaded at ')
              .setTimestamp(new Date(d[0].dateUploaded))
            ch.send(e)
          })
        })
      }
    })}, 30000)
}
