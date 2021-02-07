const { GuildMember } = require("discord.js")

const config = require("../config.json");
const { entry } = require("../handlers/verify.js");

module.exports = {
  name: "redo",
  description: "Restarts the lobby process",
  usage: "redo",
  execute(m, client) {
    if (m.member.roles.cache.find(r => r.id == config.entry.role)) {
      entry(client, m.member, false);
    }
  }
}