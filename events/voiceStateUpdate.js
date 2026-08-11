const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  StreamType,
  entersState,
  demuxProbe,
} = require("@discordjs/voice");

const googleTTS = require("google-tts-api");
const https = require("node:https");

// 🔊 ID DU SALON VOCAL D'ATTENTE
const ATTENTE_CHANNEL_ID = "1520901451185127424";

function downloadAudio(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        return downloadAudio(response.headers.location)
          .then(resolve)
          .catch(reject);
      }

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
    }).on("error", reject);
  });
}

module.exports = {
  name: "voiceStateUpdate",

  async execute(oldState, newState) {
    // Quelqu'un quitte un vocal → on ignore
    if (!newState.channelId) return;

    // Ce n'est pas le salon d'attente → on ignore
    if (newState.channelId !== ATTENTE_CHANNEL_ID) return;

    // Si c'est un bot → on ignore
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

      // Attendre que le bot soit réellement connecté
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

      // Détecter automatiquement le format audio
      const { stream, type } = await demuxProbe(audioBuffer);

      // 🎵 Créer le lecteur
      const player = createAudioPlayer();

      const resource = createAudioResource(stream, {
        inputType: type,
      });

      connection.subscribe(player);

      // 🔊 Lire la phrase
      player.play(resource);

      console.log("[VOICE] ▶️ Lecture de l'annonce...");

      // Quand la phrase est terminée
      player.once(AudioPlayerStatus.Idle, () => {
        console.log("[VOICE] ✅ Annonce terminée.");

        setTimeout(() => {
          if (connection) {
            connection.destroy();
            console.log("[VOICE] 🚪 Bot déconnecté du vocal.");
          }
        }, 1000);
      });

      // Erreur du lecteur
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