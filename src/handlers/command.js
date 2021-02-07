const Discord = require("discord.js");
const fs = require("fs");

module.exports = function(client, dir) {
  client.commands = new Discord.Collection();
  const files = fs.readdirSync(dir).filter(f => f.endsWith("js"));
  
  for (const file of files) {
    let command = require(`../commands/${file}`);
    client.commands.set(command.name, command);
  }
}