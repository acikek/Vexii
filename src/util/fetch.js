const config = require("../config.json");

async function guild(client, id) {
  return await client.guilds.fetch(id);
}

async function channel(client, id) {
  return await client.channels.fetch(id);
}

function role(guild, id) {
  return guild.roles.cache.find(r => r.id == id);
}

module.exports = { guild, channel, role };