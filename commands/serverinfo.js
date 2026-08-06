const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Show information about this RP server."),

  async execute(interaction) {
    const guild = interaction.guild;

    if (!guild) {
      await interaction.reply({
        content: "This command can only be used inside a server.",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply(
      `**${guild.name}**\n` +
        `Members: **${guild.memberCount}**\n` +
        `Created: <t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,
    );
  },
};