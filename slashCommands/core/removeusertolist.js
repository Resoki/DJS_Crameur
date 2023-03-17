const { QuickDB } = require("quick.db");
const { MongoDriver } = require("quickmongo");
const driver = new MongoDriver(
  "mongodb+srv://Resoki:Ballon32%2F@cluster0.nsmmcu2.mongodb.net/test?retryWrites=true&w=majority",
);

const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");

const isEmptyUsersList = async () => {
  await driver.connect().then(async () => {
    const db = new QuickDB({ driver });
    return !(await db.get("usersList").length) ? true : false;
  });
};

const removeUserToList = async (arg, interaction) => {
  await driver.connect().then(async () => {
    const db = new QuickDB({ driver });
    const userList = await db.get("usersList")
    await db.delete('usersList').then(() =>  console.log('supp'));
    const indexToRemove = userList.findIndex((user) => user.memberId === arg);
    if (indexToRemove === -1) {
      return interaction.channel.send(
        `L'utilisateur qui a un memberId de ${arg} n'existe pas dans la liste`,
      );
    }
    userList.splice(indexToRemove, 1);
    await db.set("usersList", userList);
    await driver.close()
    return interaction.channel.send(
      `> L'id **${arg}** a été retiré à la bdd de la liste.`,
    );
  }).catch(async(err)=> {
    await driver.close()
  })
};

module.exports = {
  name: "removeusertolist",
  description: "Retirer un id à la liste des users enregistrés.",
  type: ApplicationCommandType.ChatInput,
  category: "info",
  cooldown: 3000,
  options: [
    {
      name: "memberid",
      description: "Ton id",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const isEmpty = await isEmptyUsersList();
    if (isEmpty) return interaction.channel.send("Pas de membre enregistré");
    const memberId = interaction.options.getString("memberid");
    removeUserToList(memberId, interaction);
  },
};
