const { QuickDB } = require("quick.db");
const { MongoDriver } = require("quickmongo");
const driver = new MongoDriver(
  "mongodb+srv://Resoki:Ballon32%2F@cluster0.nsmmcu2.mongodb.net/test?retryWrites=true&w=majority",
);
const { ApplicationCommandType, EmbedBuilder } = require("discord.js");

const isEmptyUsersList = async () => {
  return driver.connect().then(async () => {
    const db = new QuickDB({ driver });
    const array = await db.get("usersList");
    return array === null ? true : false;
  });
};

const seeUsersList = async () => {
  await driver.connect();
  const db = new QuickDB({ driver });
  return await db.get("usersList");
};

module.exports = {
  name: "seeuserlist",
  description: "Voir la liste  des users enregistrés.",
  type: ApplicationCommandType.ChatInput,
  category: "info",
  cooldown: 3000,
  run: async (client, interaction) => {
    const isEmpty = await isEmptyUsersList();
    if (isEmpty) return interaction.channel.send("> Pas de membre enregistré");

    const usersList = await seeUsersList();
    const limit = 10;
    const embed = new EmbedBuilder().setTitle(
      `${usersList.length} ids enregistrés !`,
    );

    for (let i = 0; i < usersList.length; i++) {
        const el = usersList[i];
        console.log(el.usernameDiscord, el.memberId)
        embed.addFields({
         name: `${el.usernameDiscord}`,
         value: `${el.memberId}`,
       });
      }

    setTimeout(
      async () => await interaction.channel.send({ embeds: [embed] }),
      2500,
    );
  },
};
