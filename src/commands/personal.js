const VexiiEmbed = require("../util/embed.js");
const db = require("../db.js");

module.exports = {
  name: "personal",
  description: "Uploads your personal flag to the database",
  usage: "personal (flag|add|remove) (<username mention>) (<image upload>)",
  execute(m, client) {
    if (m.args[1] == "add") {
      if (!m.attachments.first()) return m.channel.send("**Command Error** | You need to provide an image.");
      let url = m.attachments.first().proxyURL;
      if (!url.endsWith("png") && !url.endsWith("jpg")) return m.channel.send("**Command Error** | Invalid image format. Please only upload `.png` or `.jpg` files.");
      db.pflags.set(`${m.author.id}`, url).write();
      m.channel.send("Successfully added personal flag.");
    } else if (m.args[1] == "flag") {
      if (!m.mentions.users.first()) return m.channel.send("**Command Error** | No username mention provided.");
      let user = m.mentions.users.first();
      if (!db.pflags.get(`${user.id}`).value()) return m.channel.send("**Command Error** | This user doesn't have a personal flag uploaded.");

      let embed = new VexiiEmbed(m, `${user.username}'s Personal Flag`)
        .setImage(db.pflags.get(`${user.id}`).value());

      m.channel.send(embed);
    } else if (m.args[1] == "remove") {
      if (!db.pflags.get(`${m.author.id}`).value()) return m.channel.send("**Command Error** | No personal flag to remove.");
      db.pflags.unset(`${m.author.id}`).write(); m.channel.send("Successfully removed personal flag.");
    }
  }
}