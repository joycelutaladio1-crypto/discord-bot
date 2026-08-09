const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("session-rp")
    .setDescription("Annonce une nouvelle session RP"),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor("#7C6854") // Couleur bronze / taupe élégante
      .setDescription(`
## 🟢 Le Serveur Valenciennes RP est maintenant __**OUVERT**__

🔑 __**Code serveur :**__

**\`ze9dr786\`**

🎮 __**Liens du Serveur :**__

*https://www.roblox.com/share?v=v2&code=5ihdm3h6u1jqsg*

🤎 **Nous vous souhaitons un Bon RP !**
      `)
      .setImage("https://i.postimg.cc/RVk0zm5h/678E463D-6954-49C8-A17F-F700785C4944.png");

    await interaction.reply({
      embeds: [embed]
    });

  }
};