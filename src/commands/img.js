const VexiiEmbed = require("../util/embed.js");
const gis = require("g-i-s");

module.exports = {
  name: "img",
  description: "Queries an image search",
  usage: "img <query>",
  execute(m, client) {
    if (!m.input || m.input == " ") return m.channel.send("**Command Error** | No query provided.");
    gis(m.input, (err, res) => {
      if (err) return m.channel.send("**Command Error** | Image search error.");

      res = res.filter(x => x.url.endsWith("png") || x.url.endsWith("jpg"));
      let embed = new VexiiEmbed(m, `"${m.input}"`)
        .setImage(res[0].url);
      
      m.channel.send(embed);
    });
  }
}