const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios"); 

const rp = require("request-promise");

require('dotenv').config()

client.on("ready", () => {
  console.log("I am ready!");

  client.user.setPresence({ game: { name: 'dothq.co', url: "twitch.tv/dothq.co", type: "STREAMING" }, status: 'online' })
});
 
const prefix = "db!"

function installFor(message, os) {
    if(os == 'windows') {
        axios.get(`https://api.github.com/repos/dot-browser/desktop/releases/latest`)
        .then(res => {
            res = res.data;

            var assets = ''

            res.assets.forEach(item => {
                if(item.content_type == 'application/x-msdownload') {
                    assets = assets + `\n[\`${item.name}\`](${item.browser_download_url})`
                }
            })

            const embed = new Discord.RichEmbed()
                .setColor('#36393f')
                .setAuthor(res.tag_name, message.client.user.avatarURL)
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
                if(item.name.split(".").pop() == 'dmg') {
                    assets = assets + `\n[\`${item.name}\`](${item.browser_download_url})`
                }
            })

            const embed = new Discord.RichEmbed()
                .setColor('#36393f')
                .setAuthor(res.tag_name, message.client.user.avatarURL)
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
                if(item.name.split(".").pop() == 'AppImage') {
                    assets = assets + `\n[\`${item.name}\`](${item.browser_download_url})`
                }
            })

            const embed = new Discord.RichEmbed()
                .setColor('#36393f')
                .setAuthor(res.tag_name, message.client.user.avatarURL)
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
                await rp({ uri: `https://api.github.com/repos/dot-browser/desktop/commits/${commit}`, headers: {
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
            message.clearReactions()
            const embed = new Discord.RichEmbed()
                .setAuthor(payload.author.login, payload.author.avatar_url)
                .setColor('#36393f')
                .setDescription(payload.commit)
                .setFooter(payload.shas.substring(0, payload.shas.length-2), 'https://cdn.discordapp.com/avatars/564914670818033664/df91181b3f1cf0ef1592fbe18e0962d7.png?size=512')
            message.channel.send(embed)
        })
}

client.on("message", (message) => {
    // && required
    // || not so required
    if(
        message.content.includes("download") == true
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
            return;
        }


        if(message.content.includes("windows")) {
            installFor(message, 'windows')
        } else if(message.content.includes('macos') || message.content.includes('mac')) {
            installFor(message, 'macos')
        } else if(message.content.includes('distro') || message.content.includes('linux') || message.content.includes('distribution')) {
            installFor(message, 'linux')
        } else {
            installFor(message, 'windows')
        }
    }

    if(
        message.content.includes('help')
    ) {
        
    }

    if(message.content.toLowerCase().startsWith('okay google')) {
        var pl = message.content.split(" google")[1]
        axios.get(`https://api.dotbrowser.me/dot/browser/omnibox/ask?prompt=${pl}`)
        .then(res => {
            res = res.data;
    
            if(message.author == message.client.user) {
                return;
            }

            const embed = new Discord.RichEmbed()
                .setColor('#36393f')
                .setFooter(res.reply, 'https://cdn.discordapp.com/emojis/661951491082551306.gif?v=1')
            message.channel.send(embed)
        }).catch(res => {
            const embed = new Discord.RichEmbed()
                .setColor('#36393f')
                .setFooter(`Sorry, I can't help with that yet.`, 'https://cdn.discordapp.com/emojis/661951491082551306.gif?v=1')
            message.channel.send(embed)
        })
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

  if (message.content.startsWith(prefix)) {
    var command = message.content.split(prefix)[1].split(" ")[0];

    var args = [];

    console.log(command)

    if(message.content.includes(" ")) {
        args = message.content.split(`${prefix}${command} `)
        args.shift()
    }
    

    if(command == 'ref') {
        if(args) {
            ref(message, args[0].split(" "));
        }
    } else if(command == 'stars') {
        var repo = 'dot-browser/desktop'
        var name = 'Dot Browser'
        if(args[0]) {
            repo = args[0].split(" ")[0];
            name = args[0].split(" ")[0].split("/")[1]
        }
        axios.get(`https://api.github.com/repos/${repo}`)
            .then(res => {
                res = res.data;

                const embed = new Discord.RichEmbed()
                    .setColor('#36393f')
                    .setTitle(`⭐️ **${res.stargazers_count}** Stargazers for ${name}`)
                message.channel.send(embed)
            })
    } else if(command == 'forks') {
        var repo = 'dot-browser/desktop'
        var name = 'Dot Browser'
        if(args[0].split(" ")[0]) {
            repo = args[0].split(" ")[0];
            name = args[0].split(" ")[0].split("/")[1]
        }
        axios.get(`https://api.github.com/repos/${repo}`)
            .then(res => {
                res = res.data;

                const embed = new Discord.RichEmbed()
                    .setColor('#36393f')
                    .setTitle(`🍴 **${res.forks}** Forks of ${name}`)
                message.channel.send(embed)
            })
    } else if(command == 'latest') {
        installFor(message, args);
    } else if(command == 'suggest') {
        let suggestion;

        if(args[0].split(" ")[0]) {
            suggestion = args[0].split(" ").join(" ");
        }

        if(suggestion) {
            const ch = client.channels.find('id', '622786432720961556')

            ch.send(`${message.author.toString()} suggested: ${suggestion}`)

            message.react("✅")

            setTimeout(() => {
                message.clearReactions()
                message.delete()
            }, 4000);
        }
    } else if(command =)
  }
});
 
client.login(process.env.TOKEN);