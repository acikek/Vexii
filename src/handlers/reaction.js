const config = require("../config.json");
const fetch = require("../util/fetch.js");
const db = require("../db.js");

module.exports = async function(client, r) {
  if (r.users.cache.last().id == client.user.id) return;
  if (r.message.channel.id != config.entry.modChannel) return;

  let uApp = db.messages.get(`${r.message.id}`).value(); if (!uApp) return;
  let member = await r.message.guild.members.fetch(uApp), result;

  if (r._emoji.name == "✅") {
    let role = fetch.role(r.message.guild, config.entry.role);
    result = "APPROVED"; 
    await handle(client, r, result, member, uApp);
    member.roles.remove(role); 
  } else if (r._emoji.name == "👢") {
    result = "KICKED"; 
    await handle(client, r, result, member, uApp);
    member.kick();
  } else if (r._emoji.name == "🔨") {
    result = "BANNED"; 
    await handle(client, r, result, member, uApp);
    member.ban(); 
  }
}

function handle(client, r, result, member, uApp) {
  r.message.reactions.removeAll()
    .then(async () => {
      let mod = r.users.cache.last();
      r.message.edit(`${r.message.content}\nThis user has been **${result}**`);
      r.message.channel.send(`<@${mod.id}> - Successfully ${result.toLowerCase()} **${member.user.tag}**.`);

      if (result != "APPROVED") {
        db.users.set(`${uApp}.exitReason`, result).write();
      } else {
        let notifyChannel = await fetch.channel(client, config.entry.notifyChannel);
        notifyChannel.send(`<:welcome:685321152767328441> **${member.user.username} has been approved.**`);
        db.users.unset(`${uApp}`).write();
      }

      db.messages.unset(`${r.message.id}`).write();
    });
}