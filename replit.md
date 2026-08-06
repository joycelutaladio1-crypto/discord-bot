# Discord RP Bot

A Discord.js v14 roleplay server bot with slash-command loading, event handling, dice rolls, and RP action messages.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- `pnpm run deploy-commands` — register the bot's slash commands
- `pnpm start` — start the Discord bot
- `pnpm run dev` — start the bot with Node's file watcher

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `index.js` — bot client setup and automatic command/event loading
- `commands/` — slash commands and command registration
- `events/` — Discord client and interaction event handlers
- `config.json` — local bot configuration placeholders

## Architecture decisions

- Bot credentials prefer environment variables (`DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, and `DISCORD_GUILD_ID`) over `config.json`.
- Guild-specific command registration is used when `guildId` is configured so new commands appear quickly during development.
- Commands are loaded dynamically from `commands/`, so new slash commands only need a module with `data` and `execute`.

## Product

The bot provides `/ping`, `/roll`, `/me`, and `/serverinfo` slash commands for a Discord RP server.

## User preferences

No additional preferences recorded.

## Gotchas

Run `pnpm run deploy-commands` after adding or changing slash commands. Never commit a real bot token.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
