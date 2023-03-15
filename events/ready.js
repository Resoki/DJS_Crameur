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
  setInterval(() => {
    requeteData();
  }, 5000);
});

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

const requeteData = async () => {
  const { QuickDB } = require("quick.db");
  const fetch = require("node-fetch");
  const { MongoDriver } = require("quickmongo");
  const driver = new MongoDriver(
    "mongodb+srv://Resoki:Ballon32%2F@cluster0.nsmmcu2.mongodb.net/test?retryWrites=true&w=majority",
  );

  const seeUsersList = async () => {
    await driver.connect();
    const db = new QuickDB({ driver });
    return await db.get("usersList");
  };
  const API_KEY = "187ad671573842d2ba512056ec15de9d";

  const userList = await seeUsersList();
  console.log(userList)
  for (let i = 0; i < userList.length; i++) {
    let request = await fetch(
      `https://www.bungie.net/Platform/Destiny2/${userList[i].memberType}/Profile/${userList[i].memberId}/?components=900`,
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
          let raidCompletionPoints = [];
          console.log(raid.name, points);
          raidCompletionPoints.push({ raidName: raid.name, points });
        }
      });
      updateUserNewTabValue(userList[i].memberId, totalPoints);
      return totalPoints;
    } else {
      console.error(`Error: ${JSON.stringify(request.Message)}`);
    }
  }
};

const { QuickDB } = require("quick.db");
const { MongoDriver } = require("quickmongo");
const driver = new MongoDriver(
  "mongodb+srv://Resoki:Ballon32%2F@cluster0.nsmmcu2.mongodb.net/test?retryWrites=true&w=majority",
);

const lastNewTabValues = {};
const updateUserNewTabValue = async (memberId, newTabValue) => {
  await driver.connect().then(async () => {
    const db = new QuickDB({ driver });
    const userList = await db.get("usersList");
    const user = userList.find((user) => user.memberId === memberId);
    console.log(user)
    if (user) {
      const currentNewTabValue = user.newTab;

      const lastNewTabValue = lastNewTabValues[memberId];
      console.log('currentNewTabValue', currentNewTabValue)
      let newTab = [ 56, 43, 230, 18, 7, 5 ];
      if (currentNewTabValue < newTab) {
        lastNewTabValues[memberId] = newTabValue;
        console.log(
          `New value for user ${user.usernameDiscord}: newTab increased from ${currentNewTabValue} to ${newTabValue}`,
        );
        await db.set("usersList", {
          ...user,
          newTab: newTabValue,
        });
      }
      checkWichRaidCompleted(currentNewTabValue, newTab, user.usernameDiscord)
    }
  });
};


const checkWichRaidCompleted = (array1, array2, user) => {
  let changedIndexes = [];
  
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      changedIndexes.push(i);
    }
  }
  let str = ''
  console.log(changedIndexes)
  switch(changedIndexes[0]) {
    case 0: return str += 'Last Wish';
    case 1: return str +='Garden of Salvation';
    case 2: return str+='Deep Stone Crypt';
    case 3: return str+='Vault of Glass';
    case 4: return str+='Vow of the Disciple';
    case 5: return str+=`King's fall`;
  }
  
  console.log(`${user} vient de compléter un raid ${str}`)
}
