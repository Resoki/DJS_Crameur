const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder
} = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "timeplayed",
  description: "Obtenir l'historique pour un character",
  type: ApplicationCommandType.ChatInput,
  category: "utility",
  cooldown: 3000,
  options: [
    {
      name: "memberid",
      description: "Id du membre",
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: "characterid",
      description: "Id du character",
      type: ApplicationCommandOptionType.String,
    },
  ],
  run: async (client, interaction) => {
    try {
      if (!interaction.isCommand()) return;
      const API_KEY = "187ad671573842d2ba512056ec15de9d";
      const memberid = interaction.options.getString("memberid");
      const characterid = interaction.options.getString("characterid");

      const embed = new EmbedBuilder()
        .setTitle("Temps joué")
        .setColor(0xf1f1f1)
        .setTimestamp();

      let url = `https://www.bungie.net/Platform/Destiny2/3/Account/4611686018470076418/Character/2305843009325234058/Stats/Activities/?count=250&mode=4&page=0`;

      async function getRaidCompletions() {
        try {
          const response = await axios.get(`https://www.bungie.net/Platform/Destiny2/3/Account/${memberid}/Character/${characterid}/Stats/Activities/?count=250&mode=4&page=0`, {
            headers: {
              "X-API-Key": API_KEY,
            },
          });

          if (response.data.ErrorCode === 1) {
            let str = "";
            response.data.Response.activities.forEach((activity, index) => {
              let arrayLength = response.data.Response.activities.length;
              if (index > 20) return;
              str += `${activity.values.timePlayedSeconds.basic.displayValue} - `;
              embed.setDescription(`${str} et **${arrayLength-20}** en plus`);
            });
            return interaction.channel.send({ embeds: [embed] });
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
