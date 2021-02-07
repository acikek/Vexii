const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./src/config.json");
const runcmd = require("./src/handlers/message.js");
const memberHandler = require("./src/handlers/verify.js");
const reactHandler = require("./src/handlers/reaction.js");

require("./src/handlers/command.js")(client, `${__dirname}/src/commands`);

client.on("ready", async () => {
  console.log(`Logged in as @${client.user.tag}!`);
});

client.on("message", m => {
  if (m.author.bot) return;
  runcmd(client, m);
});

client.on("guildMemberAdd", member => {
  if (member.guild.id != config.server) return;
  memberHandler.entry(client, member, true);
});

client.on("messageReactionAdd", r => {
  reactHandler(client, r);
});

client.on("guildMemberRemove", member => {
  memberHandler.exit(client, member);
});

client.login(config.token);