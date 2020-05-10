
const clean = text => {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}


exports.run = async (bot, message, args) => {
    
    if(message.author.id !== "217562587938816000" && message.author.id !== "703115076973887540") return;

    const evaluation = args[0].split(" ").join(" ").replace(/--noPromise/g, "")

    try {
        let evaled = eval(evaluation);
   
        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);

            var oe = evaled;

            var regex = new RegExp("```", "g")

            evaled.replace(regex, "")
            if(message.content.includes("--noPromise")) evaled = evaled.replace(/Promise { <pending> }/g, "")
    
            if(clean(evaled).length !== 0) {
                message.channel.send(clean(evaled), {code: evaled.includes("Promise { <pending> }") ? 'js' : 'xl' });
            }
    } catch (err) {
        message.channel.send(`\❌ \`\`\`js\n${clean(err)}\n\`\`\``);
    }
}

exports.help = {
    name: 'eval',
    aliases: ['evaluate']
}