const botconfig = require('./botconfig.json');
const tokenfile = require('./token.json');
const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client({disableEveryone: true});
const commands = new Discord.Collection();
const {Constants: {Events}} = Discord;
dconst LOG_ERROR = error => console.log(error);

fs.readdir('./commands/', (err, files) => {

  if(err) return console.log(err);

  let jsfile = files.filter(f => f.split('.').pop() === 'js')
  if (jsfile.length <= 0) {
    return console.log('Couldn\'t find commands.');
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    if (!props.help || !props.help.name || !props.help.run) {
      return console.log(`${f} is not in the correct format!`);
    }
    console.log(`${f} loaded!`);
    commands.set(props.help.name, props);
  });

});


bot.on(Events.READY, () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);

  bot.user.setActivity("tutorials on TSC", {type: "WATCHING"}).catch(LOG_ERROR);

  //bot.user.setGame("on SourceCade!");
});

bot.on(Events.MESSAGE_CREATE, message => {
  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(' ');
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = commands.get(cmd.slice(prefix.length));
  if(commandfile) {
    commandfile.run(bot, message, args).catch(LOG_ERROR);
  }
});

bot.login(tokenfile.token);
