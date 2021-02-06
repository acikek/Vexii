const config = require("../config.json");
const status = require("./status.js");
const { verify } = require("./verify.js");

module.exports = function(client, m) {
  if (!m.content.startsWith(config.prefix)) {
    if (status.getStatus(m.author)) {
      verify(m, status.getStatus(m.author), client);
    } else return;
  } 

  m.args = m.content.slice(config.prefix.length).split(" "); // The real arguments (including the prefix)
  m.command = m.args[0].toLowerCase(); // The command (joined with prefix, but prefix not included)
  m.input = m.args.slice(1).join(" "); // The inputs after the command

  if (!client.commands.has(m.command)) return;

  try {
    client.commands.get(m.command).execute(m, client);
  } catch (e) {
    m.channel.send("There was an error trying to execute that command!"); console.error(e);
  }
}