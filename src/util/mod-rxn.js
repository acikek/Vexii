module.exports = function (client, r, result, member, uApp) {
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