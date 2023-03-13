const fetch = require("node-fetch");
const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");

const RAIDS = [
  {
    hash: 2168422218,
    name: "Vow of the Disciple",
  },
];

module.exports = {
  name: "clear-sdd",
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
      const memberid = interaction.options.getString("memberid");

      const API_KEY = "187ad671573842d2ba512056ec15de9d";
      async function getRaidCompletions() {
        try {
          let request = await fetch(
            `https://www.bungie.net/Platform/Destiny2/3/Profile/${memberid}/?components=900`,
            {
              headers: {
                "X-API-Key": API_KEY,
              },
            },
          );

          request = await request.json();

          if (request.ErrorCode === 1) {

            RAIDS.forEach((raid) => {
              let objectives =
                request.Response.profileRecords.data.records[raid.hash]
                  .objectives ?? undefined;
              if (objectives) {
                interaction.channel.send(
                  `${raid.name}: ${JSON.stringify(
                    objectives[0].progress,
                  )} completions`,
                );
              }
            });
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
