const VexiiEmbed = require("../util/embed.js");
const db = require("../db.js");
const config = require("../config.json");

module.exports = {
  name: "personal",
  description: "Personal flag utility terminal",
  usage: "personal (get|add|remove) (<user mention or id>|<image upload>)",
  async execute(m, client) {
    if (m.args[1] == "add") {
      if (!m.attachments.first()) return m.channel.send("**Command Error** | You need to provide an image.");
      let url = m.attachments.first().proxyURL;
      if (!url.endsWith("png") && !url.endsWith("jpg")) return m.channel.send("**Command Error** | Invalid image format. Please only upload `.png` or `.jpg` files.");
      db.pflags.set(`${m.author.id}`, url).write();
      m.channel.send("Successfully added personal flag.");
    } else if (m.args[1] == "get") {
      if (!m.mentions.users.first() && (!m.args[2] || m.args[2] == " ")) {
        let embed = new VexiiEmbed(m, "Personal Flags")
          .setDescription(`Use \`${config.prefix}personal flag @mention\` to view a user's personal flag.`)
          .addFields([
            { name: "Registered Users", value: Object.keys(db.pflags.value()).map(id => `<@!${id}>`).join(", ") }
          ]);

        m.channel.send(embed);
      } else {
        let user = m.mentions.users.first();
        
        if (!user) {
          user = await client.users.fetch(m.args[2]).catch(e => {
            m.channel.send("**Command Error** | Invalid user ID.");
          });

          if (!user) return;
        }

        if (!db.pflags.get(`${user.id}`).value()) return m.channel.send("**Command Error** | This user doesn't have a personal flag uploaded.");
  
        let embed = new VexiiEmbed(m, `${user.username}'s Personal Flag`)
          .setImage(db.pflags.get(`${user.id}`).value());
  
        m.channel.send(embed);
      } 
    } else if (m.args[1] == "remove") {
      if (!db.pflags.get(`${m.author.id}`).value()) return m.channel.send("**Command Error** | No personal flag to remove.");
      db.pflags.unset(`${m.author.id}`).write(); m.channel.send("Successfully removed personal flag.");
    } else {
      if (!db.pflags.get(`${m.author.id}`).value()) return;

      let embed = new VexiiEmbed(m, `${m.author.username}'s Personal Flag`)
        .setImage(db.pflags.get(`${m.author.id}`).value());

      m.channel.send(embed);
    }
  }
}