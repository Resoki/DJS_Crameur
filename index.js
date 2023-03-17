const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
});

const { token } = require("./config.json");

const config = require("./config.json");
require("dotenv").config();
const handler = require("./handlers/index");

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();
client.prefix = config.prefix;

module.exports = client;

["slashCommand", "events"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

// const { Database } = require("quickmongo");
// let url =
//   "mongodb+srv://Resoki:Ballon32%2F@cluster0.nsmmcu2.mongodb.net/test?retryWrites=true&w=majority";
// const db = new Database(url);
// db.on("ready", () => {
//   console.log("Database connected!");
// });

const { QuickDB } = require("quick.db");
// get mongo driver
const { MongoDriver } = require("quickmongo");
const driver = new MongoDriver("mongodb+srv://Resoki:Ballon32%2F@cluster0.nsmmcu2.mongodb.net/test?retryWrites=true&w=majority");

driver.connect().then(async() => {
	const db = new QuickDB({ driver });
    console.log(`Connected to the database!`);
      console.log(await db.get("usersList"))
     //await db.set("usersList", []);
     await driver.close()
});

client.login(token);
