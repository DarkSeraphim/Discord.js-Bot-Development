const Discord = require('discord.js');
const LOG_ERROR = error => console.log(error);

module.exports.run = async (bot, message, args) => {
    let rUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!rUser) {
        return message.channel.send('Couldn\'t find user.').catch(LOG_ERROR);
    }
    let rreason = args.slice(1).join(' ');

    let reportEmbed = new Discord.RichEmbed()
        .setDescription('Reports')
        .setColor('#15f153')
        .addField('Reported User', `${rUser} with ID: ${rUser.id}`)
        .addField('Reported By', `${message.author} with ID: ${message.author.id}`)
        .addField('Channel', message.channel)
        .addField('Time', message.createdAt)
        .addField('Reason', rreason);

    let reportschannel = message.guild.channels.find('name', 'reports');
    if(!reportschannel) {
        return message.channel.send('Couldn\'t find reports channel.').catch(LOG_ERROR);
    }

    message.delete().catch(LOG_ERROR);
    reportschannel.send(reportEmbed).catch(LOG_ERROR);
}
 
module.exports.help = {
  name: 'report'
}
