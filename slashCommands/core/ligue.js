const { QuickDB } = require("quick.db");
const { MongoDriver } = require("quickmongo");
const driver = new MongoDriver(
  "mongodb+srv://Resoki:Ballon32%2F@cluster0.nsmmcu2.mongodb.net/test?retryWrites=true&w=majority"
);

const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");

const generateLevelBar = (step, currentLevel) => {
  let str = "";
  for (let i = 1; i <= step; i++) {
    if (i === currentLevel) {
      str += " **X** ";
    } else {
      str += " x ";
    }
  }
  return str;
};

const getNumberOfRaidsForUser = async (discordId) => {
  return await driver
    .connect()
    .then(async () => {
      const db = new QuickDB({ driver });

      const usersList = await db.get("usersList");

      const userIndex = usersList.findIndex(
        (el) => el.userDiscordId === discordId
      );

      if (userIndex === -1) {
        console.log(`User with Discord ID ${discordId} not found.`);
        return null;
      }

      const nbRaid = usersList[userIndex].nbRaid;

      await driver.close();

      return nbRaid;
    })
    .catch(async (err) => {
      console.error(
        `Error getting raid count for user with Discord ID ${discordId}: ${err}`
      );
      await driver.close();
      return null;
    });
};

module.exports = {
  name: "ligue",
  description: "Voir sa ligue",
  type: ApplicationCommandType.ChatInput,
  category: "info",
  cooldown: 3000,
  run: async (client, interaction) => {
        driver.connect()
    let nbRaid = await getNumberOfRaidsForUser(
      interaction.member.user.id.toString()
    );
    console.log(nbRaid);

    let gift = "";
    let currentIndexGift = 0;
    const treatText = (giftOwned, nextGift, points, currentLevel) => {
      console.log("TREATTEXT", giftOwned, nextGift, points);
      let ligues = [
        { points: 1, gift: "Bronze", lvl: 1 },
        { points: 30, gift: "Argent", lvl: 2 },
        { points: 60, gift: "Gold", lvl: 3 },
        { points: 100, gift: "Challenger", lvl: 4 },
        { points: 250, gift: "Obscur", lvl: 5 },
      ];
      let ownedGifts = "";
      let currentIndexGift = ligues.findIndex((g) => g.gift === giftOwned);
      for (let i = 0; i <= currentIndexGift; i++) {
        ownedGifts += ligues[i].gift;
        if (i < currentIndexGift) ownedGifts += ", ";
      }
      let isLastGift = !nextGift.length ? true : false;
      let nextGiftText = isLastGift
        ? ``
        : `=> **${points} points** to unlock **${nextGift}**`;
      return `Level => ${generateLevelBar(
        5,
        currentLevel
      )} **(${currentLevel}/5)**\n-----------------\nCurrently owned => **${ligues[currentIndexGift].gift}**\n----------------\n${nextGiftText} `;
    };
    let ligues = [
      {
        points: 1,
        gift: "Bronze",
        lvl: 1,
        url: "https://media.discordapp.net/attachments/1082414096911188060/1085937477551935601/Emoji_Bronze.png",
      },
      {
        points: 30,
        gift: "Argent",
        lvl: 2,
        url: "https://media.discordapp.net/attachments/1082414096911188060/1085937477346398259/Emoji_Argent.png",
      },
      {
        points: 60,
        gift: "Gold",
        lvl: 3,
        url: "https://media.discordapp.net/attachments/1082414096911188060/1085937478223016057/Emoji_Gold.png",
      },
      {
        points: 100,
        gift: "Challenger",
        lvl: 4,
        url: "https://media.discordapp.net/attachments/1082414096911188060/1085937477988126770/Emoji_Diamant.png",
      },
      {
        points: 250,
        gift: "Obscur",
        lvl: 5,
        url: "https://media.discordapp.net/attachments/1082414096911188060/1085937477761642506/Emoji_Challenger.png",
      },
    ];
    const embed = new EmbedBuilder().setTimestamp()
    if (nbRaid === 0)
      gift += `*You currently have no items, you need 1 point to unlock`;
    if (nbRaid >= ligues[0].points && nbRaid < ligues[1].points) {
      let treatPts = ligues[1].points - nbRaid;
      embed.setThumbnail(ligues[0].url)
      .setColor(0xBD9165)
      gift += treatText("Bronze", "Argent", treatPts, ligues[0].lvl);
    }
    if (nbRaid >= ligues[1].points && nbRaid < ligues[2].points) {
      let treatPts = ligues[2].points - nbRaid;
      embed.setImage(ligues[1].url)
      .setColor(0xF8F4EF)
      gift += treatText("Argent", "Gold", treatPts, ligues[1].lvl);
    }
    if (nbRaid >= ligues[2].points && nbRaid < ligues[3].points) {
      let treatPts = ligues[3].points - nbRaid;
      embed.setImage(ligues[2].url)
      .setColor(0xF6FE00)
      gift += treatText("Gold", "Challenger", treatPts, ligues[2].lvl);
    }
    if (nbRaid >= ligues[3].points && nbRaid < ligues[4].points) {
      let treatPts = ligues[4].points - nbRaid;
      embed.setImage(ligues[3].url)
      .setColor(0x6591bd)
      gift += treatText("Challenger", "Obscur", treatPts, ligues[3].lvl);
    }

    if (nbRaid >= ligues[4].points) {
      let treatPts = ligues[4].points - nbRaid;
      embed.setImage(ligues[4].url)
      .setColor(0x9165bd)
      gift += treatText("Obscur", "", treatPts, ligues[4].lvl);
    }

    let treatStr = `**${nbRaid}** ${nbRaid == 0 ? "**point**" : "**points**"}`;
    embed.setDescription(
      `<@${interaction.member.user.id}> has a total of ${treatStr} !\n ${gift}`
    )
    .setAuthor({ name: 'Resoki', iconURL: interaction.member.user.displayAvatarURL(), url: 'https://discord.js.org' })
    const deleteBtn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("delete-progress")
        .setLabel("🗑️")
        .setStyle("Danger")
    );

    setTimeout(
      async () =>
        await interaction.reply({ embeds: [embed], components: [deleteBtn] }),
      1200
    );
  },
};
