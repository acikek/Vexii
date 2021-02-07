const getJSON = require("get-json");

function fetchRedditUserData(user) {
  if (user.startsWith("u/")) user = user.split("u/")[1];

  return new Promise((resolve, reject) => {
    getJSON(`https://www.reddit.com/user/${user.toLowerCase()}/about.json`, (e, res) => {
      if (e) { reject(e); } resolve(res);
    }).catch(err => reject(err));
  });
}

module.exports = fetchRedditUserData;