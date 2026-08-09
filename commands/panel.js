const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  StringSelectMenuBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Envoie le panneau d'information de Valenciennes RP"),

  async execute(interaction) {

    const banner = "https://i.postimg.cc/prGFvzQm/copy-089D9E48-A74C-46FB-BA87-79BF6E503D43.jpg";


    const panelEmbed = new EmbedBuilder()
      .setTitle("Bienvenue sur Valenciennes RP")
      .setDescription(`
Nous sommes heureux de vous accueillir sur **Valenciennes RP** !

Merci d'avoir rejoint notre communauté.

Vous trouverez ici toutes les informations importantes ainsi que l'accès aux serveurs RP.

──────────────

🎭 **Sélection des rôles**

Sélectionnez les rôles que vous souhaitez recevoir grâce au menu ci-dessous.

Vous pouvez retirer un rôle à tout moment.

──────────────

-# Pour toute autre question ou préoccupation que vous pourriez avoir, consultez nos boutons **Règlement**, **Informations**, **FAQ** ci-dessous, ou si votre demande ne correspond pas à nos réponses prédéfinies veuillez créer un ticket dans <#1518156398377304114>
      `)
      .setFooter({
        text: "Valenciennes RP • Tous droits réservés"
      });


    const serveurButtons = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setLabel("Serveur RP 1")
          .setEmoji("🎮")
          .setStyle(ButtonStyle.Link)
          .setURL("https://www.roblox.com/share?v=v2&code=5ihdm3h6u1jqsg"),

        new ButtonBuilder()
          .setLabel("Serveur RP 2")
          .setEmoji("🎮")
          .setStyle(ButtonStyle.Link)
          .setURL("https://www.roblox.com/share?v=v2&code=5ihdm3h6u1jqsg")

      );


    const roleMenu = new ActionRowBuilder()
      .addComponents(

        new StringSelectMenuBuilder()
          .setCustomId("roles")
          .setPlaceholder("🎭 Choisissez vos rôles")
          .addOptions(
            {
              label: "Ping Session",
              value: "ping_session",
              emoji: "🔔",
              description: "Recevoir les notifications des sessions RP"
            }
          )

      );


    const helpButtons = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId("rules")
          .setLabel("Règlement")
          .setEmoji("📜")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("info")
          .setLabel("Informations")
          .setEmoji("ℹ️")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("faq")
          .setLabel("FAQ")
          .setEmoji("❓")
          .setStyle(ButtonStyle.Secondary)

      );


    await interaction.reply({
      embeds: [panelEmbed],
      files: [
        {
          attachment: banner,
          name: "banner.jpg"
        }
      ],
      components: [
        serveurButtons,
        roleMenu,
        helpButtons
      ]
    });

  }
};