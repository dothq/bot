const discord = require('discord.js')
const fs = require('fs')
const client = new discord.Client()
require('dotenv').config()

client.commands = new discord.Collection()
client.aliases = new discord.Collection()

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err)
  files.forEach(file => {
    const event = require(`./events/${file}`)
    const eventName = file.split('.')[0]
    client.on(eventName, (...args) => event.run(client, ...args))
  })
})

const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of cmdFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.help.name, command)
  command.help.aliases.forEach(alias => {
    client.aliases.set(alias, command.help.name)
  })
}

client.login(process.env.TOKEN)
