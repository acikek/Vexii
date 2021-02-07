const config = require("../config.json");
const fetch = require("../util/fetch.js");
const status = require("./status.js");
const db = require("../db.js");
const fetchRedditUserData = require("../util/reddit-user.js");

async function entry(client, member, role) {
  let lobby = await fetch.channel(client, config.entry.lobby);
  let notifyChannel = await fetch.channel(client, config.entry.notifyChannel);

  if (role) {
    let role = fetch.role(member.guild, config.entry.role);
    member.roles.add(role);
  }

  lobby.send(`
Welcome to the **Vexillology Discord Server**, <@${member.user.id}>! After reviewing the <#${config.entry.rules}>, you will need to answer a few questions to gain access to the server's channels. This process is automatic, but a staff member will have to review your responses.

**1. Where did you find the invite link to this server?** (Answer below. If from a friend, please state their Discord username.)
  `);

  notifyChannel.send(`<:welcome:685321152767328441> **${member.user.username} joined the server.**`);
  status.setStatus(member.user, "entry-1");
}

async function verify(m, s, client) {
  let lobby = await fetch.channel(client, config.entry.lobby);

  if (s == "entry-1") {
    if (!m.content || m.content == " ") return;
    db.users.set(`${m.author.id}.verify.origin`, m.content).write();
    status.setStatus(m.author, "entry-2");
    lobby.send(`<@${m.author.id}> - **2. What is your Reddit username?** (Answer below. If you do not have a Reddit account, you can just say \`skip\`.)`);
  } else if (s == "entry-2") {
    let obj = { name: undefined, created: undefined, email: undefined, alternative: undefined };

    if (m.content.toLowerCase() == "skip") {
      db.users.set(`${m.author.id}.verify.reddit`, obj).write();
      status.setStatus(m.author, "entry-alt");
      lobby.send(`<@${m.author.id}> - **Alternatively, what is your Steam/Spotify username?** (Answer below. If you do not have an account on one of those platforms, you can just say \`skip\`.)`)
    } else {
      await fetchRedditUserData(m.content)
        .then(resp => {
          if (resp.data.is_suspended) {
            m.channel.send("Sorry, but that account appears to be suspended. If you do not have an alternative account, please say `skip`.");
          } else {
            obj.name = resp.data.subreddit.display_name_prefixed;
            obj.created = resp.data.created;
            obj.email = resp.data.has_verified_email;

            db.users.set(`${m.author.id}.verify.reddit`, obj).write();
            favFlag(lobby, m.author);
          }
        })
        .catch(e => m.channel.send(`Sorry, that's not a valid Reddit account. (Input: \`${m.content}\`)`));
    }
  } else if (s == "entry-alt") {
    if (m.content.toLowerCase() != "skip") {
      db.users.set(`${m.author.id}.verify.reddit.alternative`, m.content).write();
    }

    favFlag(lobby, m.author);
  } else if (s == "entry-3") {
    db.users.set(`${m.author.id}.verify.flag`, m.content).write();
    status.setStatus(m.author, "entry-4");

    let data = db.users.get(`${m.author.id}.verify`).value();
    lobby.send(`<@${m.author.id}> - Please review your answers below. Complete the process with \`continue\` or restart with \`cancel\`.
\`\`\`
1. Where did you find the invite link to the server? - ${data.origin}
2. What is your Reddit username? - ${data.reddit.alternative ? `[SKIPPED] (Alternative: ${data.reddit.alternative})` : data.reddit.name || "[SKIPPED]"}
3. What is your favorite flag? - ${data.flag}    
\`\`\`
    `);
  } else if (s == "entry-4") {
    if (m.content.toLowerCase() == "continue") {
      let modchannel = await fetch.channel(client, config.entry.modChannel);
      let data = db.users.get(`${m.author.id}.verify`).value();

      function skipped(val) {
        return val ? val : "[SKIPPED]";
      }

      modchannel.send(`
\`\`\`yml
DISCORD-ACCOUNT:
- TAG: ${m.author.tag}
- CREATED-AT: ${new Date(m.author.createdAt).toDateString()}
- INVITE-SOURCE: ${data.origin}

REDDIT-ACCOUNT:
- NAME: ${skipped(data.reddit.name)}
- CREATED-AT: ${data.reddit.created ? new Date(data.reddit.created * 1000).toDateString() : "[SKIPPED]"}
- VERIFIED-EMAIL: ${skipped(data.reddit.email)}
- ALTERNATIVE: ${skipped(data.reddit.alternative)}

FAVORITE-FLAG: ${data.flag}

Accept [✅]; Kick [👢]; Ban [🔨]
\`\`\`
      `)
      .then(msg => {
        msg.react("✅");
        msg.react("👢");
        msg.react("🔨");
        
        db.users.set(`${m.author.id}.verifyMID`, msg.id).write();
        db.users.unset(`${m.author.id}.verify`).write();
        status.setStatus(m.author, "entry-pending");
        db.messages.set(`${msg.id}`, m.author.id).write();

        m.channel.send(`<@${m.author.id}> - **Your application has been sent!** Once it has been approved, you will gain access to the server's channels.\n> *Please be patient. The mods can be busy at times, and you'll be approved eventually.*`);
      })
    } else if (m.content.toLowerCase() == "cancel") {
      db.users.unset(`${m.author.id}.verify`).write();
      status.setStatus(m.author, "entry-1");
      lobby.send(`<@${m.author.id}> - **1. Where did you find the invite link to this server?** (Answer below. If from a friend, please state their Discord username.)`);
    }
  }
}

function favFlag(lobby, user) {
  status.setStatus(user, "entry-3");
  lobby.send(`<@${user.id}> - **3. What is your favorite flag?** (Answer below.)`);
}

async function exit(client, member) {
  let notifyChannel = await fetch.channel(client, config.entry.notifyChannel);
  
  if (db.users.get(`${member.user.id}.status`).value()) {
    let channel = await fetch.channel(client, config.entry.modChannel);
    channel.messages.fetch(db.users.get(`${member.user.id}.verifyMID`).value())
      .then(m => {
        if (db.users.get(`${member.user.id}.exitReason`).value()) {
          notifyChannel.send(`<:goodbye:685321570687647750> **${member.user.username} was ${db.users.get(`${member.user.id}.exitReason`).value().toLowerCase()} from the server.**`);
        } else {
          notifyChannel.send(`<:goodbye:685321570687647750> **${member.user.username} didn't want to play with the bot...**`);

          m.delete();
          db.messages.unset(`${m.id}`).write();
        }

        db.users.unset(`${member.user.id}`).write();
      });
  } else {
    notifyChannel.send(`<:goodbye:685321570687647750> **${member.user.username} left the server.**`);
    db.users.unset(`${member.user.id}`).write();
  }
}

module.exports = { entry, verify, exit };