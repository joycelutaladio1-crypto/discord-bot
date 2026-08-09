const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("session-rp-fermee")
    .setDescription("Annonce la fermeture de la session RP"),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor("#B86F73")
      .setDescription(`
## 🔴 Le Serveur Valenciennes RP est maintenant __**FERMÉ**__

🌙 La session RP vient de se terminer.

Merci à toutes et à tous d'avoir participé à cette session et d'avoir fait vivre **Valenciennes RP** !

📅 **Une nouvelle session sera disponible demain.**

Nous vous invitons à nous rejoindre pour la prochaine session et à profiter pleinement de votre expérience RP.

✨ **À demain pour une nouvelle session !**

**Valenciennes RP** — Merci pour votre participation.
      `);

    await interaction.reply({
      embeds: [embed]
    });

  }
};