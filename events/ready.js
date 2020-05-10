
exports.run = (bot) => {
  console.log('I am ready!')
    
  setInterval(() => {
    bot.user.setActivity(`the Dot Community`, {
    type: 'WATCHING'
    })
  }, 10000)
}