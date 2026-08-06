const { SlashCommandBuilder } = require("discord.js");

function rollDice(notation) {
  const match = /^(\d{1,2})d(\d{1,4})([+-]\d{1,4})?$/i.exec(notation);

  if (!match) {
    throw new Error("Use dice notation like `1d20`, `2d6+3`, or `1d100-5`.");
  }

  const count = Number(match[1]);
  const sides = Number(match[2]);
  const modifier = Number(match[3] || 0);

  if (count < 1 || count > 20 || sides < 2 || sides > 1000) {
    throw new Error("You can roll between 1–20 dice with 2–1000 sides.");
  }

  const rolls = Array.from(
    { length: count },
    () => Math.floor(Math.random() * sides) + 1,
  );
  const total = rolls.reduce((sum, roll) => sum + roll, modifier);
  const modifierText =
    modifier === 0 ? "" : modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`;

  return { rolls, total, modifierText };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll dice for an RP check.")
    .addStringOption((option) =>
      option
        .setName("dice")
        .setDescription("Dice notation, for example 1d20 or 2d6+3.")
        .setRequired(true),
    ),

  async execute(interaction) {
    const notation = interaction.options.getString("dice", true).replace(/\s/g, "");

    try {
      const { rolls, total, modifierText } = rollDice(notation);
      await interaction.reply(
        `**${interaction.user.displayName}** rolled \`${notation}\`: **${total}**\n` +
          `Individual rolls: ${rolls.join(", ")}${modifierText}`,
      );
    } catch (error) {
      await interaction.reply({ content: error.message, ephemeral: true });
    }
  },
};