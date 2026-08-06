const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");

const config = require("../config.json");

const token = process.env.DISCORD_TOKEN || config.token;
const clientId = process.env.DISCORD_CLIENT_ID || config.clientId;
const configuredGuildId = process.env.DISCORD_GUILD_ID || config.guildId;
const guildId =
  configuredGuildId && configuredGuildId !== "YOUR_RP_SERVER_ID_HERE"
    ? configuredGuildId
    : undefined;

if (!token || token === "YOUR_BOT_TOKEN_HERE") {
  throw new Error(
    "Missing Discord bot token. Set DISCORD_TOKEN or replace token in config.json.",
  );
}

if (!clientId || clientId === "YOUR_APPLICATION_CLIENT_ID_HERE") {
  throw new Error(
    "Missing application client ID. Set DISCORD_CLIENT_ID or update config.json.",
  );
}

const commandsPath = __dirname;
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js") && file !== "deploy-commands.js");

const commands = commandFiles.map((file) => {
  const command = require(path.join(commandsPath, file));
  return command.data.toJSON();
});

const rest = new REST({ version: "10" }).setToken(token);

async function deployCommands() {
  const route = guildId
    ? Routes.applicationGuildCommands(clientId, guildId)
    : Routes.applicationCommands(clientId);

  console.log(
    `[commands] Registering ${commands.length} command(s) ${guildId ? "to the configured guild" : "globally"}...`,
  );

  await rest.put(route, { body: commands });
  console.log("[commands] Registration complete.");
}

deployCommands().catch((error) => {
  console.error("[commands] Registration failed:", error);
  process.exitCode = 1;
});