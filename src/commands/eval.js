const VexiiEmbed = require("../util/embed.js");
const config = require("../config.json");

module.exports = {
  name: "eval",
  description: "Evaluates an input",
  usage: "eval <input>",
  execute(m, client) {
    if (m.author.id !== config.author) return;

    let result;
    let color = 65280;

    try {
      result = eval(m.input);
    } catch (e) {
      result = e;
      color = 16711680;
    }

    let embed = new VexiiEmbed(m)
      .setColor(color)
      .addFields(
        { name: "Input 📥", value: `\`\`\`js\n${m.input}\n\`\`\`` },
        { name: "Output 📤", value: `\`\`\`js\n${result}\n\`\`\`` }
      )

    m.channel.send(embed);
  }
}