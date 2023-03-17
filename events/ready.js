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
  // {
  //   hash: 2381413764,
  //   name: "Root of Nightmares",
  // },
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
  await driver.close()
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

    if (user) {
      const currentNewTabValue = user.newTab;

      //let newTab = [ 56, 43, 230, 18, 8, 10 ];
      if (currentNewTabValue < newTabValue) {
        lastNewTabValues[memberId] = newTabValue;
        console.log(
          `New value for user ${user.usernameDiscord}: newTab increased from ${currentNewTabValue} to ${newTabValue}`,
        );
        await db.set("usersList", {...user,newTab: newTabValue});
      }
      checkWichRaidCompleted(currentNewTabValue, newTabValue, user);
    }
    await driver.close();
  })
  .catch(async(err)=> {
    await driver.close();
  })
};

const increaseNumberOfRaidUser = async (memberId) => {
  await driver.connect().then(async () => {
    const db = new QuickDB({ driver });
  
    let usersList = await db.get("usersList");
    
    const userIndex = usersList.findIndex(el => el.memberId === memberId);
    
    if (userIndex === -1) {
      console.log(`User with Discord ID ${memberId} not found.`);
      await driver.close();
      return;
    }
    
    usersList[userIndex].nbRaid += 1;
    
    await db.set("usersList", usersList);
    await driver.close();
  }).catch(async(err)=> {
    console.error(`Error increasing raid count for user with Discord ID ${memberId}: ${err}`);
    await driver.close();
  })
}


const checkWichRaidCompleted = (array1, array2, user) => {
  let changedIndexes = [];
  if(array1 === array2) return
  
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) changedIndexes.push(i);
  }
  let str = '';
  if(!changedIndexes[0]) return;
  switch(changedIndexes[0]) {
    case 0:  str += 'Last Wish';
    break;
    case 1:  str +='Garden of Salvation';
    break;
    case 2:  str+='Deep Stone Crypt';
    break;
    case 3:  str+='Vault of Glass';
    break;
    case 4:  str+='Vow of the Disciple';
    break;
    case 5:  str+=`King's fall`;
    break;
  }

  if(str) {
    const channel = client.channels.cache.get('965590551799943248');
    console.log(`${user.usernameDiscord} vient de compléter un raid ${str}`);
    channel.send(`${user.usernameDiscord} vient de compléter un raid ${str}`);
    increaseNumberOfRaidUser(user.memberId);
  }
}
