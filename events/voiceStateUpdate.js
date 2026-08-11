const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  demuxProbe,
} = require("@discordjs/voice");

const googleTTS = require("google-tts-api");
const https = require("node:https");
const { Readable } = require("node:stream");

// 🔊 ID DU SALON VOCAL D'ATTENTE
const ATTENTE_CHANNEL_ID = "1520901451185127424";

function downloadAudio(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        // Gestion des redirections
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          return downloadAudio(response.headers.location)
            .then(resolve)
            .catch(reject);
        }

        // Vérification de la réponse
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Google TTS a répondu avec le code ${response.statusCode}`
            )
          );
          return;
        }

        const chunks = [];

        response.on("data", (chunk) => {
          chunks.push(chunk);
        });

        response.on("end", () => {
          resolve(Buffer.concat(chunks));
        });

        response.on("error", reject);
      })
      .on("error", reject);
  });
}

module.exports = {
  name: "voiceStateUpdate",

  async execute(oldState, newState) {
    // Quelqu'un quitte un vocal → on ignore
    if (!newState.channelId) return;

    // Vérifie que c'est le salon d'attente
    if (newState.channelId !== ATTENTE_CHANNEL_ID) return;

    // Ignore les bots
    if (!newState.member || newState.member.user.bot) return;

    const member = newState.member;
    const channel = newState.channel;

    console.log(
      `[VOICE] ${member.user.tag} a rejoint le salon d'attente.`
    );

    let connection;

    try {
      // 🤖 Le bot rejoint le salon
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: newState.guild.id,
        adapterCreator: newState.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      });

      // Attendre que la connexion soit prête
      await entersState(
        connection,
        VoiceConnectionStatus.Ready,
        15_000
      );

      console.log("[VOICE] ✅ Bot connecté au salon vocal.");

      // 🗣️ Message personnalisé
      const texte =
        `Bonjour ${member.displayName}, ` +
        `merci de patienter. ` +
        `Un membre du Staff va bientôt venir vous prendre en charge.`;

      console.log(`[VOICE] 🗣️ ${texte}`);

      // 🇫🇷 Génération du lien audio Google TTS
      const audioUrl = googleTTS.getAudioUrl(texte, {
        lang: "fr",
        slow: false,
        host: "https://translate.google.com",
      });

      console.log("[VOICE] 🔊 Téléchargement de la voix...");

      // Télécharger l'audio
      const audioBuffer = await downloadAudio(audioUrl);

      // Transformer le Buffer en véritable Stream
      const audioStream = Readable.from([audioBuffer]);

      // Détecter automatiquement le format audio
      const { stream, type } = await demuxProbe(audioStream);

      // 🎵 Créer le lecteur
      const player = createAudioPlayer();

      const resource = createAudioResource(stream, {
        inputType: type,
      });

      // Connecter le lecteur au salon vocal
      connection.subscribe(player);

      // 🔊 Lire la phrase
      player.play(resource);

      console.log("[VOICE] ▶️ Lecture de l'annonce...");

      // Quand l'annonce est terminée
      player.once(AudioPlayerStatus.Idle, () => {
        console.log("[VOICE] ✅ Annonce terminée.");

        setTimeout(() => {
          if (connection) {
            connection.destroy();
            console.log("[VOICE] 🚪 Bot déconnecté du vocal.");
          }
        }, 1000);
      });

      // Gestion des erreurs audio
      player.on("error", (error) => {
        console.error("[VOICE] ❌ Erreur audio :", error);

        if (connection) {
          connection.destroy();
        }
      });
    } catch (error) {
      console.error("[VOICE] ❌ Erreur :", error);

      if (connection) {
        connection.destroy();
      }
    }
  },
};