const client = require("..");
const chalk = require("chalk");
client.on("ready", async () => {
  const activities = [
    { name: `Bot DJS`, type: 5 }, // LISTENING
    { name: `Discord.js v14`, type: 5 }, // COMPETING
  ];
  const status = ["Playing", "Playing"];
  let i = 0;
  setInterval(() => {
    if (i >= activities.length) i = 0;
    client.user.setActivity(activities[i]);
    i++;
  }, 2000);

  let s = 0;
  setInterval(() => {
    if (s >= activities.length) s = 0;
    client.user.setStatus(status[s]);
    s++;
  }, 4000);
  console.log(chalk.red(`Logged in as ${client.user.tag}!`));
  const { Database } = require("quickmongo");
  const db = new Database("mongodb+srv://Resoki:Ballon32%2F@cluster0.nsmmcu2.mongodb.net/?retryWrites=true&w=majority");
  db.on("ready", () => {
    console.log("Database connected!");
  });
});
