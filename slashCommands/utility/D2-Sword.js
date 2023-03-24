const axios = require("axios");
const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: "sword",
  description: "Type",
  type: ApplicationCommandType.ChatInput,
  category: "utility",
  cooldown: 3000,
  options: [
    {
      name: "typeid",
      description: "Id du membre",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
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
      const typeid = interaction.options.getString("typeid");

      async function getRaidCompletions() {
        try {
          const response = await axios.get(
            `https://www.bungie.net/Platform/Destiny2/${typeid}/Account/${memberid}/Character/0/Stats/?groups=102&modes=4&periodType=AllTime`,
            {
              headers: {
                "X-API-Key": API_KEY,
              },
            }
          );

          if (response.data.ErrorCode === 1) {
            interaction.reply(
              `Sword: ${response.data.Response.raid.allTime.weaponKillsSword.basic.value.toString()}`
            );
          } else {
            console.error(`Error: ${response.data.Message}`);
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
