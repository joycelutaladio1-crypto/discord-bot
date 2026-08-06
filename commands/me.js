const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("me")
    .setDescription("Describe your character's action.")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("The action your character is taking.")
        .setRequired(true)
        .setMaxLength(500),
    ),

  async execute(interaction) {
    const action = interaction.options.getString("action", true);
    await interaction.reply(`*${interaction.member.displayName} ${action}*`);
  },
};