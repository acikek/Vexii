const config = require("../config.json");
const fetch = require("../util/fetch.js");
const db = require("../db.js");
const handleModRxn = require("../util/mod-rxn.js");
const Discord = require("discord.js");

module.exports = async function(client, r) {
  if (r.users.cache.last().id == client.user.id) return; // bot check

  if (r.message.channel.id != config.entry.modChannel) {
    if (r._emoji.name == "👋" && r.users.cache.size <= 1) {
      let att = r.message.attachments.first();
      if (!att) att = r.message.embeds[0] ? r.message.embeds[0].image : null;
      if (!att) return;

      let embed = new Discord.MessageEmbed()
        .setColor("C93837")
        .setTitle("FlagWaver Link")
        .setURL(`https://julka.io/#?src=${encodeURIComponent(att.proxyURL)}`)
        .setDescription(`[Original Message](${r.message.url})`);

      r.message.channel.send(embed);
    }
  } else {
    let uApp = db.messages.get(`${r.message.id}`).value(); if (!uApp) return;
    let member = await r.message.guild.members.fetch(uApp), result;
  
    // This is horrible but works for some reason
    // I'm just going to ignore it
    switch (r._emoji.name) {
      case "✅":
        let role = fetch.role(r.message.guild, config.entry.role);
        result = "APPROVED"; await handleModRxn(client, r, result, member, uApp); 
        member.roles.remove(role); break;
      case "👢":
        result = "KICKED"; await handleModRxn(client, r, result, member, uApp);
        member.kick(); break;
      case "🔨":
        result = "BANNED"; await handleModRxn(client, r, result, member, uApp);
        member.ban(); break;
    }
  }
}