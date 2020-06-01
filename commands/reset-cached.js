const db = require('quick.db')

exports.run = async (bot, message, args) => {
  if (!message.member.roles.cache.has('525057083352285184') && !message.member.roles.cache.has('662323136343179264') && !message.member.roles.cache.has('640720834796978186')) {
    return message.channel.send('You don\'t have access to this command.')
  }
  db.set('cachedBuildId', [])
  message.channel.send('Reset the cached build, be wary that it will send a new notification for the **current** build.')
}

exports.help = {
  name: 'reset-cached',
  aliases: []
}
