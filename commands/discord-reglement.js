const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("discord-reglement")
    .setDescription("Affiche le règlement Discord de Valenciennes RP"),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle("Règlement Discord Officiel")
      .setDescription(`
Bienvenue sur **Valenciennes RP** !

Afin de garantir une bonne ambiance et une expérience agréable pour tous, merci de respecter les règles suivantes.

➜ **1. RESPECT**

Vous devez respecter l'ensemble des membres du serveur.
Les insultes, provocations, harcèlements et comportements discriminatoires ne sont pas autorisés.

➜ **2. PAS DE SPAM**

Le spam, le flood, les messages répétitifs et l'utilisation abusive des mentions sont interdits.

➜ **3. PAS DE MENTIONS ABUSIVES**

Il est interdit de mentionner abusivement les membres, le staff ou les responsables du serveur.

➜ **4. INFORMATIONS PERSONNELLES**

Ne partagez jamais vos informations personnelles ou celles d'un autre membre sans autorisation.

➜ **5. PUBLICITÉ**

Toute publicité non autorisée est interdite.

➜ **6. CONTENU INAPPROPRIÉ**

Les contenus pornographiques, choquants, illégaux ou inappropriés sont interdits.

➜ **7. USURPATION**

Il est interdit de se faire passer pour un membre du staff ou pour une autre personne.

➜ **8. CONTOURNEMENT DE SANCTION**

Le contournement d'une sanction est interdit.
Une nouvelle sanction peut être appliquée en cas de récidive.

➜ **9. RÈGLEMENT RP**

Le règlement concernant le RolePlay doit également être respecté en jeu.

➜ **10. DÉCISIONS DU STAFF**

Les décisions du staff doivent être respectées.
En cas de problème, utilisez le système de support.

➜ **11. SIGNALEMENT**

Si vous rencontrez un problème, utilisez les boutons ci-dessous afin de contacter le support ou effectuer un signalement.

➜ **12. MODIFICATIONS DU RÈGLEMENT**

Le règlement peut être modifié à tout moment.
Il est de votre responsabilité de prendre connaissance des éventuelles modifications.

──────────────

Merci d'avoir pris connaissance du règlement de **Valenciennes RP** !
      `)
      .setImage("https://i.postimg.cc/tTp4N9yF/23DB1452-6CE6-446A-85A7-EBE53CBAB85B.png");

    const buttons = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setLabel("Règlement RP")
          .setEmoji("🎮")
          .setStyle(ButtonStyle.Link)
          .setURL("https://varp-reglement-rp.base44.app"),

        new ButtonBuilder()
          .setLabel("Support")
          .setEmoji("🛠️")
          .setStyle(ButtonStyle.Link)
          .setURL(
            "https://discord.com/channels/1518135055497822358/1518148626243780618"
          ),

        new ButtonBuilder()
          .setLabel("Bug Reports")
          .setEmoji("🐛")
          .setStyle(ButtonStyle.Link)
          .setURL(
            "https://discord.com/channels/1518135055497822358/1506401106610094090"
          ),

        new ButtonBuilder()
          .setLabel("Annonce")
          .setEmoji("📢")
          .setStyle(ButtonStyle.Link)
          .setURL(
            "https://discord.com/channels/1518135055497822358/1521063638277034164"
          )

      );

    await interaction.reply({
      embeds: [embed],
      components: [buttons]
    });

  }
};