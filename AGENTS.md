# Chat Pack

## Runtime

- This is a single NestJS app; the real runtime entrypoint is `src/main.ts`, and production runs `node dist/src/main` via `npm run start:prod`.
- `ConfigModule.forRoot()` loads exactly `config/env/${NODE_ENV}.env`. `npm run start:dev` and `npm run start:prod` set `NODE_ENV`; plain `npm start` does not.
- Required env keys verified in code are `MONGODB_URI`, `CHROMIUM_DIR`, `MAPS_API`, and `SEE_BUS_BASE_URL`.
- `CHROMIUM_DIR` must point to the Chromium executable used by `whatsapp-web.js` Puppeteer.

## Commands

- Install deps: `npm install`
- Dev server with the correct env file: `npm run start:dev`
- Build: `npm run build`
- Production locally: `npm run start:prod`
- Lint and auto-fix: `npm run lint`
- Format only `src/` and `test/`: `npm run format`
- Debug Jest in-band: `npm run test:debug`

## Testing

- Jest is configured with `rootDir: src` and matches `src/**/*.spec.ts`.
- There are currently no `src/**/*.spec.ts` files in the repo, so `npm test` may be a no-op unless you add tests.
- `npm run test:e2e` is stale right now: `package.json` points to `test/jest-e2e.json`, but that file is not present.

## Architecture

- App wiring lives in `src/app.module.ts`; add new feature modules there or they will never load.
- WhatsApp-specific code is under `src/whatsapp/`.
- Message flow is: `WhatsappService` emits `whatsapp.message` -> `CommandHandlerService` builds context and resolves commands -> command handlers execute.
- Commands register themselves on module init through `AbstractCommand.onModuleInit()`. A new command must be provided by a loaded Nest module or it will not appear in `CommandRegistry`.
- Slash commands are detected from `message.body.startsWith('/')` in `CommandHandlerService`.
- Sessions are in-memory through `SessionManager`; `SessionCleaner` expires them every 5 minutes and sends a timeout message.

## WhatsApp / Persistence Quirks

- `whatsapp.provider.ts` connects Mongoose on client startup, but auth is currently `LocalAuth`, not `RemoteAuth`.
- Session state is therefore tied to the local `.wwebjs_auth/` directory, which is gitignored.
- `.wwebjs_cache/` is also gitignored and should be treated as runtime state, not source.

## Tooling

- TypeScript is strict enough to matter (`strictNullChecks: true`) but still allows implicit `any` (`noImplicitAny: false`).
- Path aliases are defined only for WhatsApp areas: `@application`, `@client`, `@command-handler`, `@command-registry`, `@features`, `@session`, `@shared`.
- ESLint uses the flat config in `eslint.config.mjs` with type-aware linting (`projectService: true`) and `--fix` is enabled in the `lint` script.
- Prettier uses `singleQuote: true` and `trailingComma: all`.

## Docker / Deploy

- Local Mongo expects an external Docker network named `chat-pack-net`; create it first with `docker network create chat-pack-net`.
- Start Mongo only with `docker compose up -d`; the compose file defines a single `mongo` service on that external network.
- The Docker image installs both `chromium` and `ffmpeg`; the app still depends on `CHROMIUM_DIR` at runtime.
- GitHub Actions deployment is push-to-`main` only and SSHes into a VPS, hard-resets to `origin/main`, rebuilds the Docker image, and runs the container there.
