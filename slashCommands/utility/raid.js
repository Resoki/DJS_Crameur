const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "raid",
  description: "Voir la liste des raids",
  type: ApplicationCommandType.ChatInput,
  category: "utility",
  cooldown: 3000,
  run: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;
      const API_KEY = "187ad671573842d2ba512056ec15de9d";
      const MEMBERSHIP_TYPE = 3;
      const MEMBERSHIP_ID = "4611686018470076418";

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

      let raidCompletionPoints = [];

      const embed = new EmbedBuilder()
        .setTitle("Raid")
        .setColor(0xf1f1f1)
        .setImage(
          "https://media.discordapp.net/attachments/1082414096911188060/1084537951653994596/250px-Raid.jpg"
        )
        .setTimestamp();

      async function getRaidCompletions() {
        try {
          let request = await fetch(
            `https://www.bungie.net/Platform/Destiny2/${MEMBERSHIP_TYPE}/Profile/${MEMBERSHIP_ID}/?components=900`,
            {
              headers: {
                "X-API-Key": API_KEY,
              },
            }
          );

          request = await request.json();

          if (request.ErrorCode === 1) {
            RAID.forEach((raid) => {
              let objectives =
                request.Response.profileRecords.data.records[raid.hash]
                  .objectives ?? undefined;
              if (objectives) {
                let points = objectives[0].progress;
                embed.addFields({
                  name: `${raid.name}`,
                  value: `${points} points`,
                  inline: true,
                });
                raidCompletionPoints.push({ raidName: raid.name, points });
              }
            });
            return interaction.reply({ embeds: [embed] });
          } else {
            console.error(`Error: ${JSON.stringify(request.Message)}`);
          }
        } catch (error) {
          console.error(error);
        }
      }

      getRaidCompletions();
    } catch (err) {
      return interaction.reply(`Une erreur a eu lieu:\n${err}`);
    }
  },
};
