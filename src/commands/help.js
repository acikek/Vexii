const VexiiEmbed = require("../util/embed.js");
const config = require("../config.json");

module.exports = {
  name: "help",
  description: "Displays the help menu",
  usage: "help",
  execute(m, client) {
    if (!m.args[1] || m.args[0] == " ") {
      let embed = new VexiiEmbed(m, "Commands")
        .addFields(
          { name: "Name", value: client.commands.keyArray().map(x => `\`${x}\``).join("\n"), inline: true },
          { name: "Description", value: client.commands.array().map(x => x.description).join("\n"), inline: true }
        );

      m.channel.send(embed);
    } else {
      if (client.commands.has(m.args[1])) {
        let command = client.commands.get(m.args[1].toLowerCase());

        let embed = new VexiiEmbed(m, command.name)
          .addFields(
            { name: "Description", value: command.description },
            { name: "Usage", value: `\`${config.prefix}${command.usage}\`` }
          )

        m.channel.send(embed);
      } else {
        m.channel.send("**Command Error** | No command with that name.");
      }
    }
  }
}