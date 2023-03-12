const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "getinfo",
  description: "Obtenir l'historique pour un character",
  type: ApplicationCommandType.ChatInput,
  category: "utility",
  cooldown: 3000,
  options: [
    {
      name: "memberid",
      description: "Id du membre",
      type: ApplicationCommandOptionType.String,
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
      const MEMBERSHIP_TYPE = 3; // change to 2 or 4 depending on your platform (Xbox, PSN, or Steam)
      const MEMBERSHIP_ID = "4611686018470076418";
      const memberid = interaction.options.getString("memberid");

      const embed = new EmbedBuilder()
        .setTitle("Stats 📜")
        .setColor('Random')
        .setTimestamp();

      getRaidCompletions = async () => {
        try {
            let url = `https://www.bungie.net/Platform/Destiny2/Stats/PostGameCarnageReport/12415111025/`
          const response = await axios.get(
            `${url}`,
            {
              headers: {
                "X-API-Key": API_KEY,
              },
            }
          );
          let playerName = '';
          let iconPath = '';

          if (response.data.ErrorCode === 1) {
            console.log(response.data.Response)
            response.data.Response.entries.forEach((entry) => {
              if (entry.player.destinyUserInfo.membershipId !== MEMBERSHIP_ID)
                return;
              console.log(entry.player.destinyUserInfo);
              console.log(entry.values.assists.basic.value);
              console.log(entry.values.completed.basic.value);
              console.log(entry.values.deaths.basic.value);
              console.log(entry.values.kills.basic.value);
              console.log(entry.values.efficiency.basic.value);
              console.log(entry.values.killsDeathsRatio.basic.value);
              console.log(entry.values.killsDeathsAssists.basic.value);

              setNewField = (title, data) => {
                embed.addFields({
                  name: `${title}`,
                  value: `${data}`,
                  inline: true,
                });
              };
              setNewField(`Assists`, entry.values.assists.basic.value)
              setNewField(`Completed`, entry.values.completed.basic.value)
              setNewField(`Death`, entry.values.deaths.basic.value)
              setNewField(`Kill`, entry.values.kills.basic.value)
              setNewField(`Efficiency`, entry.values.efficiency.basic.value)
              setNewField(`Kill`, entry.values.kills.basic.value)
              setNewField(`KillDeathsRatio`, entry.values.killsDeathsRatio.basic.value)
              setNewField(`KillDeathsAssists`, entry.values.killsDeathsAssists.basic.value)
              playerName = entry.player.destinyUserInfo.displayName;
              iconPath = entry.player.destinyUserInfo.iconPath;
              console.log(iconPath.toString())
            });
            
            embed.setAuthor({
                name: playerName,
                iconURL: `https://www.bungie.net/${iconPath}`,
                url: "https://discord.js.org",
              });

            embed.setThumbnail(`https://www.bungie.net/${iconPath}`)

            return interaction.channel.send({ embeds: [embed] });
          } else {
            console.error(`Error: ${response.data.Message}`);
          }
        } catch (error) {
          console.error(error);
        }
      };

      getRaidCompletions();
    } catch (err) {
      return interaction.reply(`Une erreur a eu lieu:\n${err}`);
    }
  },
};
