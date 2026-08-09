const { Events, EmbedBuilder } = require("discord.js");
module.exports = {
  name: Events.InteractionCreate,

  async execute(interaction, client) {
    // ===== Boutons =====

    if (interaction.isButton()) {

        if (interaction.customId === "info") {
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2B65FF")
                        .setTitle("ℹ️ Informations")
                        .setDescription(`
    Bienvenue sur **Valenciennes RP** !

    Vous trouverez ici toutes les informations importantes concernant notre serveur.
                        `)
                ]
            });
        }

        if (interaction.customId === "faq") {
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2B65FF")
                        .setTitle("❓ FAQ")
                        .setDescription(`
    **Comment rejoindre une session RP ?**
    → Consultez les annonces.

    **Comment contacter le staff ?**
    → Ouvrez un ticket.

    **Comment devenir staff ?**
    → Attendez l'ouverture des recrutements.
                        `)
                ]
            });
        }

        if (interaction.customId === "rules") {
            return interaction.reply({
                ephemeral: true,
                content: "📜 Consultez le règlement ici : <#1521079106895220736>"
            });
        }
    }
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`[commands] /${interaction.commandName} failed:`, error);

      const message = {
        content: "Something went wrong while running that command.",
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(message);
      } else {
        await interaction.reply(message);
      }
    }
  },
};