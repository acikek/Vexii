module.exports = {
  name: "ping",
  description: "Returns the client ping",
  usage: "ping",
  execute(m, client) {
    m.channel.send(`**Client Ping**: \`${client.ws.ping}\`ms`)
  }
}