const db = require("../db.js");
const fetch = require("../util/fetch.js");
const config = require("../config.json");

module.exports = {
  name: "init",
  description: "Re-initializes the entry process",
  usage: "init",
  async execute(m, client) {
    if (m.author.id != config.author) return;
    let lobby = await fetch.channel(client, config.entry.lobby);

    db.users.keys().value().forEach(u => {
      if (db.users.get(`${u}.verifyMID`).value()) return;
      db.users.unset(`${u}`).write();
    });
    
    lobby.send(`**<@&${config.entry.role}>, looks like I ran into an issue.**\nPlease run \`v!redo\` to restart the lobby process.`);
  }
}