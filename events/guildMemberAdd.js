const Discord = require('discord.js')
const prettifyDate = require("../tools/dates")

exports.run = async (bot, member) => {
    const guild = member.guild
    const ch = await bot.channels.fetch('623165984135446558')
    const invites = await guild.fetchInvites()

    let totalJoins = 0

    invites.forEach(invite => {
        totalJoins += invite.uses
    })
    
    const role = guild.roles.cache.find(role => role.name === "Member");
    const member = member;
    member.roles.add(role);

    const embed = new Discord.MessageEmbed()
        .setAuthor(member.user.username, member.user.avatarURL())
        .setColor('#2f3136')
        .setTitle(`✨  Welcome to ${guild.name}, ${member.user.username}`)
        .addField('💫  Members', `${guild.memberCount}`, true)
        .addField('🏆  Total Joins', `${totalJoins}`, true)
        .setFooter(`Account Created • ${prettifyDate(member.user.createdAt)}`, member.user.avatarURL())
    ch.send(embed)
}
