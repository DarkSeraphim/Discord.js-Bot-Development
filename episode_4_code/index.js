const botconfig = require('./botconfig.json');
const tokenfile = require('./token.json');
const Discord = require('discord.js');
// Yay complexity. Feel free to manually extract Permissions and Constants.Events from Discord)
const {Permissions, Constants: {Events}} = Discord;

const bot = new Discord.Client({disableEveryone: true});
const LOG_ERROR = error => console.log(error);
// Alternatively:
// const LOG_ERROR = console.log.bind(console);

// No async since we cannot deal with errors it throws
bot.on(Events.READY, () => {
  console.log(`${bot.user.username} is online!`);

  bot.user.setActivity('tutorials on TSC', {type: 'WATCHING'});

  //bot.user.setGame('on SourceCade!');
});

bot.on(Events.MESSAGE_CREATE, message => {
  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(' ');
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (cmd === `${prefix}kick`) {

    //!kick @daeshan askin for it

    let kUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!kUser) {
      return message.channel.send('Can\'t find user!').catch(LOG_ERROR);
    }
    // Rather than slicing the joined args, slice off the tag first
    let kReason = args.slice(1).join(' ');
    if(!message.member.hasPermission(Permissions.MANAGE_MESSAGES)) {
      return message.channel.send('No can do pal!').catch(LOG_ERROR);
    }
    if(kUser.hasPermission(Permissions.MANAGE_MESSAGES)) {
      return message.channel.send('That person can\'t be kicked!').catch(LOG_ERROR);
    }
    
    let kickEmbed = new Discord.RichEmbed()
      .setDescription('~Kick~')
      .setColor('#e56b00')
      .addField('Kicked User', `${kUser} with ID ${kUser.id}`)
      .addField('Kicked By', `${message.author} with ID ${message.author.id}`)
      .addField('Kicked In', message.channel)
      .addField('Time', message.createdAt)
      .addField('Reason', kReason);

    let kickChannel = message.guild.channels.find('name', 'incidents');
    if(!kickChannel) {
      return message.channel.send('Can\'t find incidents channel.').catch(LOG_ERROR);
    }

    kUser.kick(kReason).catch(LOG_ERROR);
    kickChannel.send(kickEmbed).catch(LOG_ERROR);
  } else if (cmd === `${prefix}ban`) {

    let bUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!bUser) {
      return message.channel.send('Can\'t find user!').catch(LOG_ERROR);;
    }
    let bReason = args.slice(1).join(' ');
    
    if(!message.member.hasPermission(Permissions.MANAGE_MEMBERS)) {
      return message.channel.send('No can do pal!').catch(LOG_ERROR);
    }
    if(bUser.hasPermission(Permissions.MANAGE_MESSAGES)) {
      return message.channel.send('That person can\'t be kicked!').catch(LOG_ERROR);;
    }
    
    let banEmbed = new Discord.RichEmbed()
      .setDescription('~Ban~')
      .setColor('#bc0000')
      .addField('Banned User', `${bUser} with ID ${bUser.id}`)
      .addField('Banned By', `${message.author} with ID ${message.author.id}`)
      .addField('Banned In', message.channel)
      .addField('Time', message.createdAt)
      .addField('Reason', bReason);

    let incidentchannel = message.guild.channels.find('name', 'incidents');
    if(!incidentchannel) {
      return message.channel.send('Can\'t find incidents channel.').catch(LOG_ERROR);;
    }
    
    bUser.ban(bReason).catch(LOG_ERROR);
    incidentchannel.send(banEmbed).catch(LOG_ERROR);
  } else if (cmd === `${prefix}report`) {

    //!report @ned this is the reason

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

    let reportschannel = message.guild.channels.find('name', "reports");
    if(!reportschannel) {
      return message.channel.send("Couldn't find reports channel.").catch(LOG_ERROR);
    }

    message.delete().catch(LOG_ERROR);
    reportschannel.send(reportEmbed).catch(LOG_ERROR);
  } else if(cmd === `${prefix}serverinfo`) {

    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
      .setDescription('Server Information')
      .setColor('#15f153')
      .setThumbnail(sicon)
      .addField('Server Name', message.guild.name)
      .addField('Created On', message.guild.createdAt)
      .addField('You Joined', message.member.joinedAt)
      .addField('Total Members', message.guild.memberCount);

    message.channel.send(serverembed).catch(LOG_ERROR);
  } else if(cmd === `${prefix}botinfo`) {

    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription('Bot Information')
    .setColor('#15f153')
    .setThumbnail(bicon)
    .addField('Bot Name', bot.user.username)
    .addField('Created On', bot.user.createdAt);

    message.channel.send(botembed).catch(LOG_ERROR);
  }

});

bot.login(tokenfile.token);
