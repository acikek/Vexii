const fs = require("fs");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

function makeDatabase(file) {
  const adapter = new FileSync(file);
  return low(adapter);
}

/*let databases = {};
const files = fs.readdirSync(`${__dirname}/data`).filter(f => f.endsWith("json"));

for (const file of files) {
  databases[file.split(".json")[0]] = makeDatabase(`${__dirname}/data/${file}`);
}*/



module.exports = {
  users: makeDatabase(`${__dirname}/data/users.json`),
  messages: makeDatabase(`${__dirname}/data/messages.json`),
  pflags: makeDatabase(`${__dirname}/data/pflags.json`)
}