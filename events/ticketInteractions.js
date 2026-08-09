const {
  Events,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

const STAFF_ROLE_ID = "1518213473740259419";
const TICKET_CATEGORY_ID = "1535771378194714664";

const ticketNames = {
  fondation: "Contacter la fondation",
  partenariat: "Partenariat",
  staff_report: "Signaler un membre du Staff",
  player_report: "Signaler un joueur",
  staff_recruitment: "Recrutement Staff",
  projects: "Projets / Événements",
  unban: "Demande de débannissement"
};

module.exports = {
  name: Events.InteractionCreate,

  async execute(interaction) {

    // ==========================================
    // CRÉATION DU TICKET
    // ==========================================

    if (interaction.isStringSelectMenu()) {

      if (interaction.customId !== "ticket_create") return;

      const reason = interaction.values[0];
      const reasonName = ticketNames[reason];

      // Vérifie si l'utilisateur possède déjà un ticket
      const existingTicket = interaction.guild.channels.cache.find(
        channel =>
          channel.type === ChannelType.GuildText &&
          channel.parentId === TICKET_CATEGORY_ID &&
          channel.topic?.includes(`TICKET_OWNER:${interaction.user.id}`)
      );

      if (existingTicket) {
        return interaction.reply({
          content: `❌ Vous avez déjà un ticket ouvert : ${existingTicket}`,
          ephemeral: true
        });
      }

      // Crée le salon
      const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "")
          .slice(0, 20),

        type: ChannelType.GuildText,

        parent: TICKET_CATEGORY_ID,

        topic: `TICKET_OWNER:${interaction.user.id} | REASON:${reasonName}`,

        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [
              PermissionFlagsBits.ViewChannel
            ]
          },

          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.AttachFiles
            ]
          },

          {
            id: STAFF_ROLE_ID,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.ManageMessages,
              PermissionFlagsBits.AttachFiles
            ]
          }
        ]
      });

      // ==========================================
      // MESSAGE DANS LE TICKET
      // ==========================================

      const ticketEmbed = new EmbedBuilder()
        .setTitle("🎫 Ticket créé")
        .setDescription(`
Bonjour ${interaction.user} 👋

Votre ticket a été créé avec succès.

**📁 Motif :**
${reasonName}

Merci d'expliquer clairement votre demande et de fournir toutes les informations nécessaires.

Un membre de notre équipe prendra votre demande en charge prochainement.

**Merci de patienter et de ne pas mentionner inutilement le Staff.**
        `);

      const ticketButtons = new ActionRowBuilder()
        .addComponents(

          new ButtonBuilder()
            .setCustomId("ticket_claim")
            .setLabel("Tickets Pris en Charge")
            .setEmoji("🟢")
            .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
            .setCustomId("ticket_release")
            .setLabel("Tickets Libéré")
            .setEmoji("⚪")
            .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
            .setCustomId("ticket_add")
            .setLabel("Ajouter un Membre")
            .setEmoji("➕")
            .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
            .setCustomId("ticket_remove")
            .setLabel("Retirer un membre")
            .setEmoji("➖")
            .setStyle(ButtonStyle.Secondary)
        );

      const ticketButtons2 = new ActionRowBuilder()
        .addComponents(

          new ButtonBuilder()
            .setCustomId("ticket_reminder")
            .setLabel("Rappel à l’utilisateur")
            .setEmoji("🔔")
            .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
            .setCustomId("ticket_details")
            .setLabel("Voir le détail du ticket")
            .setEmoji("📋")
            .setStyle(ButtonStyle.Secondary),

          new ButtonBuilder()
            .setCustomId("ticket_close")
            .setLabel("Fermer le ticket")
            .setEmoji("🔒")
            .setStyle(ButtonStyle.Danger)
        );

      // Mention du Staff
      const staffMessage = await ticketChannel.send({
        content: `<@&${STAFF_ROLE_ID}>`
      });

      // Suppression du message de mention
      setTimeout(async () => {
        try {
          await staffMessage.delete();
        } catch {}
      }, 1000);

      await ticketChannel.send({
        embeds: [ticketEmbed],
        components: [
          ticketButtons,
          ticketButtons2
        ]
      });

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("🎫 Ticket créé")
            .setDescription(`
Votre ticket a été créé avec succès.

👉 ${ticketChannel}

**Motif :** ${reasonName}

Un membre du Staff viendra vous répondre prochainement.
            `)
        ],
        ephemeral: true
      });

      return;
    }

    // ==========================================
    // BOUTONS
    // ==========================================

    if (!interaction.isButton()) return;

    const channel = interaction.channel;

    if (!channel?.topic?.includes("TICKET_OWNER:")) return;

    // ==========================================
    // PRENDRE EN CHARGE
    // ==========================================

    if (interaction.customId === "ticket_claim") {

      await channel.setTopic(
        `${channel.topic} | CLAIMED_BY:${interaction.user.id}`
      );

      await interaction.reply({
        content: `🟢 **Ticket pris en charge par ${interaction.user}.**`,
        ephemeral: false
      });

      return;
    }

    // ==========================================
    // LIBÉRER
    // ==========================================

    if (interaction.customId === "ticket_release") {

      const newTopic = channel.topic
        .replace(/\s*\|\s*CLAIMED_BY:\d+/g, "");

      await channel.setTopic(newTopic);

      await interaction.reply({
        content: `⚪ **Le ticket a été libéré par ${interaction.user}.**`,
        ephemeral: false
      });

      return;
    }

    // ==========================================
    // AJOUTER UN MEMBRE
    // ==========================================

    if (interaction.customId === "ticket_add") {

      const modal = new ModalBuilder()
        .setCustomId("ticket_add_modal")
        .setTitle("Ajouter un membre");

      const userInput = new TextInputBuilder()
        .setCustomId("user_id")
        .setLabel("ID Discord du membre")
        .setPlaceholder("Exemple : 123456789012345678")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(userInput)
      );

      await interaction.showModal(modal);

      return;
    }

    // ==========================================
    // RETIRER UN MEMBRE
    // ==========================================

    if (interaction.customId === "ticket_remove") {

      const modal = new ModalBuilder()
        .setCustomId("ticket_remove_modal")
        .setTitle("Retirer un membre");

      const userInput = new TextInputBuilder()
        .setCustomId("user_id")
        .setLabel("ID Discord du membre")
        .setPlaceholder("Exemple : 123456789012345678")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(userInput)
      );

      await interaction.showModal(modal);

      return;
    }

    // ==========================================
    // RAPPEL
    // ==========================================

    if (interaction.customId === "ticket_reminder") {

      const ownerId = channel.topic.match(
        /TICKET_OWNER:(\d+)/
      )?.[1];

      if (!ownerId) return;

      await channel.send({
        content: `<@${ownerId}>`,
        embeds: [
          new EmbedBuilder()
            .setTitle("🔔 Rappel")
            .setDescription(
              "Avez-vous toujours besoin d'aide concernant votre ticket ?\n\nMerci de nous confirmer si votre demande est toujours d'actualité."
            )
        ]
      });

      await interaction.reply({
        content: "🔔 Le rappel a été envoyé.",
        ephemeral: true
      });

      return;
    }

    // ==========================================
    // DÉTAILS
    // ==========================================

    if (interaction.customId === "ticket_details") {

      const ownerId = channel.topic.match(
        /TICKET_OWNER:(\d+)/
      )?.[1];

      const reason = channel.topic.match(
        /REASON:([^|]+)/
      )?.[1];

      const claimed = channel.topic.match(
        /CLAIMED_BY:(\d+)/
      )?.[1];

      const detailsEmbed = new EmbedBuilder()
        .setTitle("📋 Détails du ticket")
        .setDescription(`
👤 **Créateur :** <@${ownerId}>

📁 **Motif :** ${reason || "Inconnu"}

🟢 **Statut :** ${claimed ? "Pris en charge" : "En attente"}

👮 **Staff responsable :** ${
          claimed ? `<@${claimed}>` : "Aucun"
        }

📅 **Créé le :** <t:${Math.floor(channel.createdTimestamp / 1000)}:F>
        `);

      await interaction.reply({
        embeds: [detailsEmbed],
        ephemeral: true
      });

      return;
    }

    // ==========================================
    // FERMER
    // ==========================================

    if (interaction.customId === "ticket_close") {

      await interaction.reply({
        content: "🔒 Fermeture du ticket dans 5 secondes..."
      });

      setTimeout(async () => {
        try {
          await channel.delete();
        } catch {}
      }, 5000);

      return;
    }
  }
};