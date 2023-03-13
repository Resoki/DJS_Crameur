const RAIDS = [
  {
    hash: 3047702042,
    name: "King's Fall",
  },
];
const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const fetch = require("node-fetch");
module.exports = {
  name: "clear-kf",
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

          if (request.ErrorCode === 1) {
            //here we are looping over each raid, since the `records` is an object, you can use the raid hash to read the value of the object, each triumph has it's own "hash", the hashes are defined in the Raids object
            RAIDS.forEach((raid) => {
              //checking if the triumph data actually has objectives;; sunset triumphs, or "legacy triumphs" don't have objectives anymore, which is why it only shows current raids
              let objectives =
                request.Response.profileRecords.data.records[raid.hash]
                  .objectives ?? undefined;
              if (objectives) {
                //logging the raid name and the value of the progress field in the first objective, this corresponds to the raid completions because the value keeps counting even after completing the triumph
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
