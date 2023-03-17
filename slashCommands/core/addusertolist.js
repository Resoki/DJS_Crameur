const { QuickDB } = require("quick.db");
const { MongoDriver } = require("quickmongo");
const driver = new MongoDriver(
  "mongodb+srv://Resoki:Ballon32%2F@cluster0.nsmmcu2.mongodb.net/test?retryWrites=true&w=majority",
);
const fetch = require("node-fetch");

const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");

const isEmptyUsersList = async () => {
  await driver.connect().then(async () => {
    const db = new QuickDB({ driver });
    return !(await db.get("usersList").length) ? true : false;
  });
};

const userAlreadyExist = async (memberId) => {
  return driver.connect().then(async () => {
    const db = new QuickDB({ driver });
    const isEmptyUsersListConst = await isEmptyUsersList();
    if (isEmptyUsersListConst) return false;
    const array = await db.get("usersList");
    if (!array.length) return false;
    await driver.close()
    return array && array.find((el) => el.memberId === memberId) ? true : false;
  })
  .catch(async(err)=> {
    await driver.close()
  })
};

const addUserToList = async (member, arg, memberType, raidArray) => {
  await driver.connect().then(async () => {
    const db = new QuickDB({ driver });
  
    let usersList = await db.get("usersList");
    
    usersList.push({
      userDiscordId: member.user.id,
      usernameDiscord: member.user.username,
      memberId: arg,
      memberType: memberType,
      newTab: raidArray,
      nbRaid: 0,
    });
    
    await db.set("usersList", usersList);
    await driver.close();
  }).catch(async(err)=> {
    await driver.close();
  })
};

module.exports = {
  name: "addusertolist",
  description: "S'ajouter à la liste des users enregistrés.",
  type: ApplicationCommandType.ChatInput,
  category: "info",
  cooldown: 3000,
  options: [
    {
      name: "memberid",
      description: "Ton id",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "membertype",
      description: "Ton id",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const memberId = interaction.options.getString("memberid");
    const memberType = interaction.options.getString("membertype");
    const userAlreadyExisting = await userAlreadyExist(memberId);
    if (userAlreadyExisting)
      return interaction.reply(`Un user avec cet id existe déjà en bdd`);

    let raidArray = await requeteData(memberType, memberId);

    addUserToList(interaction.member, memberId, memberType, raidArray).then(
      () => {
        return interaction.channel.send(`> **${memberId}** ajouté à la bdd`);
      },
    );

    return;
  },
};

const RAID = [
  {
    hash: 2266286943,
    name: "Leviathan",
  },
  {
    hash: 1627755918,
    name: "Eater of Worlds",
  },
  {
    hash: 3996781284,
    name: "Spire of Stars",
  },
  {
    hash: 3448775736,
    name: "Last Wish",
  },
  {
    hash: 1455741693,
    name: "Scourge of the Past",
  },
  {
    hash: 1419480252,
    name: "Crown of Sorrow",
  },
  {
    hash: 3804486505,
    name: "Garden of Salvation",
  },
  {
    hash: 3185876102,
    name: "Deep Stone Crypt",
  },
  {
    hash: 3114569402,
    name: "Vault of Glass",
  },
  {
    hash: 2168422218,
    name: "Vow of the Disciple",
  },
  {
    hash: 3047702042,
    name: "King's Fall",
  },
];

const requeteData = async (memberType, memberId) => {
  const API_KEY = "187ad671573842d2ba512056ec15de9d";
  let request = await fetch(
    `https://www.bungie.net/Platform/Destiny2/${memberType}/Profile/${memberId}/?components=900`,
    {
      headers: {
        "X-API-Key": API_KEY,
      },
    },
  );

  request = await request.json();
  if (request.ErrorCode === 1) {
    let totalPoints = [];
    RAID.forEach((raid) => {
      let objectives =
        request.Response.profileRecords.data.records[raid.hash].objectives ??
        undefined;
      if (objectives) {
        let points = objectives[0].progress;
        totalPoints.push(points);
      }
    });
    return totalPoints;
  }
};
