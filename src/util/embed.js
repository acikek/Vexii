const { MessageEmbed } = require("discord.js");

class VexiiEmbed extends MessageEmbed {
  constructor(m, title) {
    super(); this
      .setColor("C93837")
      .setTimestamp()
      .setFooter(`Requested by ${m.author.tag}`, m.author.avatarURL());
    
    if (title) this.setTitle(`**Vexii** - ${title}`);
  }
}

module.exports = VexiiEmbed;