
const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const axios = require("axios");
const fetch = require('node-fetch')
module.exports = {
  name: "test",
  description: "Type",
  type: ApplicationCommandType.ChatInput,
  category: "utility",
  cooldown: 3000,
  options: [
    {
      name: "memberid",
      description: "Id du membre",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;
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
      ]
      const memberid = interaction.options.getString("memberid");

      const API_KEY = "187ad671573842d2ba512056ec15de9d";
      const MEMBERSHIP_ID = '4611686018470076418';
      let raidCompletionPoints = [];

async function getRaidCompletions() {
  try {
    let request = await fetch(`https://www.bungie.net/Platform/Destiny2/3/Profile/${MEMBERSHIP_ID}/?components=900`, {
      headers: {
        'X-API-Key': API_KEY
      }
    });

    request = await request.json();
    let totalPoints = 0;
    if (request.ErrorCode === 1) {
      RAID.forEach(raid => {
        let objectives = request.Response.profileRecords.data.records[raid.hash].objectives ?? undefined;
        if (objectives)
        {
          //Here we are checking the value of the first objective's progress and adding 1 point for each completion
          let points = objectives[0].progress;
          totalPoints += points
          raidCompletionPoints.push({ raidName: raid.name, points});
          console.log(`${raid.name}: ${points} points`);
        }
      });
      console.log('totalPoints', totalPoints);
    } else {
      console.error(`Error: ${JSON.stringify(request.Message)}`);
    }
  } catch (error) {
    console.error(error);
  }
}
getRaidCompletions()

      
    } catch (err) {
      return interaction.reply(`Une erreur a eu lieu:\n${err}`);
    }
  },
};
