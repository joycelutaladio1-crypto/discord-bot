const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tickets")
    .setDescription("Affiche le panneau de support de Valenciennes RP"),

  async execute(interaction) {

    // ==========================================
    // EMBED PRINCIPAL
    // ==========================================

    const ticketEmbed = new EmbedBuilder()
      .setColor("#59636E")
      .setTitle("🎫 Support — Valenciennes RP")
      .setDescription(`
Bienvenue dans le **support de Valenciennes RP**.

Vous avez besoin d'aide, vous souhaitez nous contacter ou signaler un problème ?

Sélectionnez ci-dessous la **raison de votre demande** afin de créer un ticket.

Notre équipe prendra votre demande en charge dans les meilleurs délais.
      `)
      .setImage(
        "https://i.postimg.cc/RZg8cf5M/0C83FC12-9AB2-4D42-BA65-0CB810573349.png"
      );

    // ==========================================
    // MENU DES TICKETS
    // ==========================================

    const ticketMenu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("ticket_create")
          .setPlaceholder("🎫 Sélectionnez la raison de votre ticket")
          .addOptions(
            {
              label: "Contacter la fondation",
              value: "fondation",
              emoji: "🏛️",
              description: "Contacter l'équipe Fondation"
            },
            {
              label: "Partenariat",
              value: "partenariat",
              emoji: "🤝",
              description: "Faire une demande de partenariat"
            },
            {
              label: "Signaler un membre du Staff",
              value: "staff_report",
              emoji: "⚠️",
              description: "Signaler le comportement d'un membre du Staff"
            },
            {
              label: "Signaler un joueur",
              value: "player_report",
              emoji: "👤",
              description: "Signaler le comportement d'un joueur"
            },
            {
              label: "Recrutement Staff",
              value: "staff_recruitment",
              emoji: "👮",
              description: "Candidater pour rejoindre le Staff"
            },
            {
              label: "Projets / Événements",
              value: "projects",
              emoji: "🎉",
              description: "Proposer ou discuter d'un projet ou événement"
            },
            {
              label: "Demande de débannissement",
              value: "unban",
              emoji: "🔓",
              description: "Demander la révision d'une sanction"
            }
          )
      );

    // ==========================================
    // EMBED REPORT CHEATER
    // ==========================================

    const cheaterEmbed = new EmbedBuilder()
      .setTitle("🛡️ Vous souhaitez Report un Cheater ?")
      .setDescription(`
Vous avez rencontré un joueur utilisant de la triche sur **Emergency Hamburg** ?

### 📋 Comment effectuer un signalement d'un Cheater ?

**1.** Cliquez sur **Report Cheater**.

**2.** Cliquez sur **Player Report** / **Reporting Players**.

**3.** Cliquez ensuite sur **Player Reports Form**.

**4.** Remplissez les informations nécessaires demandées dans le formulaire.

🎥 **Un REC est fortement conseillé** afin de faciliter le traitement du signalement.

🌐 Lorsque vous accédez au site, n'hésitez pas à **activer la traduction automatique** de la page si nécessaire.

⚠️ *Veillez à fournir des informations précises et des preuves suffisantes.*
      `);

    // ==========================================
    // BOUTON REPORT CHEATER
    // ==========================================

    const cheaterButton = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Report Cheater")
          .setEmoji("🛡️")
          .setStyle(ButtonStyle.Link)
          .setURL(
            "https://wiki.emergency-hamburg.com/en/Support"
          )
      );

    // ==========================================
    // ENVOI DU PANNEAU
    // ==========================================

    await interaction.reply({
      embeds: [
        ticketEmbed,
        cheaterEmbed
      ],
      components: [
        ticketMenu,
        cheaterButton
      ]
    });

  }
};