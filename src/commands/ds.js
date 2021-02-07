const ds = require("drawshield");
const fs = require("fs");

module.exports = {
  name: "ds",
  description: "DrawShield emblazonment",
  usage: "ds <emblazonment>",
  async execute(m, client) {
    if (!m.input || m.input == " ") return m.channel.send("**Command Error** | No emblazonment provided.");
    ds.drawShield(m.input, { dir: `${__dirname}/../util`, filename: "blazon" }).then(x => {
      let img = fs.readFileSync(`${__dirname}/../util/blazon.png`);
      m.channel.send({ files: [ img ] });
    });
  }
}