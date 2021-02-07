const db = require("../db.js");

function getStatus(user) {
  return db.users.get(`${user.id}.status`).value() || undefined;
}

function setStatus(user, status) {
  db.users.set(`${user.id}.status`, status).write();
}

function unsetStatus(user) {
  db.users.unset(`${user.id}.status`).write();
}

module.exports = { getStatus, setStatus, unsetStatus }