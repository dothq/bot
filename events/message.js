const discord = require('discord.js')
const axios = require('axios')
const rp = require('request-promise')
const db = require('quick.db')
require('dotenv').config()

function installFor(message, avy, os) {
    if(os === 'windows') {
        axios.get(`https://api.github.com/repos/dot-browser/desktop/releases/latest`)
        .then(res => {
            res = res.data;

            var assets = ''

            res.assets.forEach(item => {
                if(item.content_type === 'application/x-msdownload') {
                    assets = assets + `\n[\`${item.name}\`](${item.browser_download_url})`
                }
            })

            const embed = new discord.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(res.tag_name, avy)
                .setTitle(`<:windows:661585643876384768>  Windows Downloads`)
                .setDescription(assets)
            message.channel.send(embed)
        })
    } else if(os.includes("mac") || os.includes("macos")) {
        axios.get(`https://api.github.com/repos/dot-browser/desktop/releases/latest`)
        .then(res => {
            res = res.data;

            var assets = ''

            res.assets.forEach(item => {
                if(item.name.split(".").pop() === 'dmg') {
                    assets = assets + `\n[\`${item.name}\`](${item.browser_download_url})`
                }
            })

            const embed = new discord.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(res.tag_name, avy)
                .setTitle(`<:macos:661584061533519915>  macOS Downloads`)
                .setDescription(assets)
            message.channel.send(embed)
        })
    } else {
        axios.get(`https://api.github.com/repos/dot-browser/desktop/releases/latest`)
        .then(res => {
            res = res.data;

            var assets = ''

            res.assets.forEach(item => {
                if(item.name.split(".").pop() === 'AppImage') {
                    assets = assets + `\n[\`${item.name}\`](${item.browser_download_url})`
                }
            })

            const embed = new discord.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(res.tag_name, avy)
                .setTitle(`<:linux:661585642689658902>  Linux Downloads`)
                .setDescription(assets)
            message.channel.send(embed)
        })
    }
}

async function ref(message, queue) {
    message.react('⏳')
    var items = []
    var commitmessage = ''
    var shas = ''
        var queuePromise = new Promise(async (resolve, reject) => {
            for (let index = 0; index < queue.length; index++) {
                const commit = queue[index];
                console.log(commit)
                await rp({ uri: `https://api.github.com/repos/dothq/browser/commits/${commit}`, headers: {
                    "Authorization": "Bearer " + process.env.GH_TOKEN,
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
                }, json: true })
                    .then(json => {

                        commitmessage = commitmessage + '[`' + json.sha.substring(0, 7) + '`](' + json.html_url + ') ' + json.commit.message + ' - ' + json.commit.author.name + '\n'
                        shas = shas + json.sha.substring(0, 7) + ', '
                        if(index === queue.length-1) resolve({
                            commit: commitmessage,
                            shas: shas,
                            author: json.author
                        });
                    })
            }
        })

        queuePromise.then(payload => {
            message.reactions.removeAll()
            message.channel.send(`Referencing commit from \`${payload.author.login}\`...`)
            const embed = new discord.MessageEmbed()
                .setAuthor(payload.author.login, payload.author.avatar_url)
                .setColor('#2f3136')
                .setDescription(payload.commit)
                .setFooter(payload.shas.substring(0, payload.shas.length-2), 'https://cdn.discordapp.com/avatars/564914670818033664/df91181b3f1cf0ef1592fbe18e0962d7.png?size=512')
            message.channel.send(embed)
        })
}

exports.run = (bot, message) => {
    if(message.content.toLowerCase().includes("hm") && message.author.id !== bot.user.id) {
        message.channel.send(message.content.toLowerCase().split(" ").find(function(v){ 
          return v.indexOf("hm") > -1
        }))
    }
    
    // Install Dot
    if(
        message.content.includes("download") === true
        && message.content.includes("dot") 
        || message.content.includes("install") 
        && message.content.includes('browser')
        || message.content.includes('download link')
    ) {
        if(
            message.content.includes('hate')
            || message.content.includes('sucks') 
            || message.content.includes('dislike')
            || message.content.includes('bad')
            || message.content.includes('trash')
            || message.content.includes('garb')
            || message.content.includes('abhor')
            || message.content.includes('loathe')
            || message.content.includes('detest')
            || message.content.includes('abominate')
            || message.content.includes('despise')
            || message.content.includes('execrate')
            || message.content.includes('disrelish')
            || message.content.includes('fuck')
            || message.content.includes('shit')
            || message.content.includes('crap')
            || message.content.includes('poo')
        ) {
            return
        }


        if(message.content.includes("windows")) {
            installFor(message, 'https://cdn.discordapp.com/avatars/661569904465674240/b11e4d9cf7ad2502b1084db71d7c02f6.png?size=1024', 'windows')
        } else if(message.content.includes('macos') || message.content.includes('mac')) {
            installFor(message, 'https://cdn.discordapp.com/avatars/661569904465674240/b11e4d9cf7ad2502b1084db71d7c02f6.png?size=1024', 'macos')
        } else if(message.content.includes('distro') || message.content.includes('linux') || message.content.includes('distribution')) {
            installFor(message, 'https://cdn.discordapp.com/avatars/661569904465674240/b11e4d9cf7ad2502b1084db71d7c02f6.png?size=1024', 'linux')
        } else {
            installFor(message, 'https://cdn.discordapp.com/avatars/661569904465674240/b11e4d9cf7ad2502b1084db71d7c02f6.png?size=1024', 'windows')
        }
    }

    if(
        message.content.includes('reference')
        && message.content.includes('commit')
    ) {
        if(message.content.match(/\b[0-9a-f]{5,40}\b/g)) {
            var queue = []
            var index = 0;
            message.content.match(/\b[0-9a-f]{5,40}\b/g).forEach(commit => {
                queue.push(commit);
            })
            ref(message, queue);
        }
    }

    if (message.content.startsWith('reference suggestion')) {
        let result = message.content.split('reference suggestion ')[1].split(' ')
        console.log(result)
        result.forEach(value => {
            if (isNaN(value.replace('#', ''))) {
                message.channel.send('One (or more) of the IDs you attempted to send aren\'t valid.')
                return
            } else {
                let suggestion = db.get(`suggestion_${value.replace('#', '')}.content`)
                const choiceEmojis = [
                    'https://i.imgur.com/mwL3zjn.png',
                    'https://i.imgur.com/7ZO0qdW.png',
                    'https://i.imgur.com/sNqcQKS.png',
                    'https://i.imgur.com/sNqcQKS.png',
                    'https://i.imgur.com/JUgZztc.png'
                ]
                let choices = ['Dot Browser', 'Dot Drop', 'HQ Website', 'Browser Website', 'Other']
                if (db.get(`suggestion_${value.replace('#', '')}`)) {
                    bot.users.fetch(db.get(`suggestion_${value.replace('#', '')}.author`)).then(fetchedUser => {
                        message.channel.send(`Referencing suggestion #${value.replace('#', '')} from \`${fetchedUser.username}\`.`)
                        const embed = new discord.MessageEmbed()
                            .setAuthor(choices[db.get(`suggestion_${value.replace('#', '')}.choice`)], choiceEmojis[db.get(`suggestion_${value.replace('#', '')}.choice`)])
                            .setColor('#2f3136')
                            .setTitle(`💫  Suggestion from ${fetchedUser.username}`)
                            .setDescription(`${suggestion}`)
                            .addField(`URL`, `[Click here](https://discord.com/channels/640704702031331341/709092034975105125/${db.get(`suggestion_${value.replace('#', '')}.message_id`)})`)
                            .setFooter(`Suggestion #${value.replace('#', '')}`)
                        message.channel.send(embed)
                        console.log(fetchedUser)
                    })
                }
            }
        })
    }

    const prefix = 'db!'
    if (!message.content.startsWith(prefix)) return
    const command = message.content.split(' ')[0].slice(prefix.length)
    const args = message.content.split(' ').slice(1)
    let cmd
    if (bot.commands.has(command)) {
      cmd = bot.commands.get(command)
    } else if (bot.aliases.has(command)) {
      cmd = bot.commands.get(bot.aliases.get(command))
    }
    console.log(`[${message.guild.name}] ${message.author.username}#${message.author.discriminator} > ${prefix}${command} ${args.toString().replace(/,/gi, ' ')}`)
    if (cmd) {
        cmd.run(bot, message, args)
    }
}
