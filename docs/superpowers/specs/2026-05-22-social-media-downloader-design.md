# Social Media Downloader Design

## Goal

Add an automatic WhatsApp bot feature that detects public Instagram, TikTok, and Twitter/X links, downloads the linked media with `yt-dlp`, sends it back with the post caption, and deletes every temporary downloaded file after each attempt.

## Scope

- Detect links in normal messages, not slash commands.
- Support public links from Instagram, TikTok, Twitter, and X without cookies.
- Enable private chats by default.
- Keep group handling configurable by environment and disabled by default.
- Download the best available media up to 100 MB.
- Send the post caption extracted by `yt-dlp`; if there is no caption, send a short fallback caption with emoji.
- Reply to download failures with a brief emoji-prefixed user message.
- Always remove temporary files and directories, including failed downloads.
- Leave the feature on a separate branch for manual testing before merging to `develop`.

## Architecture

Create a focused feature module under `src/whatsapp/features/social-media-downloader/`. The module provides a detector, a policy service, a safe `yt-dlp` wrapper, and a handler. The existing command flow remains the entry point: `CommandResolverService` will resolve this feature only after slash commands and media sticker auto-handling are ruled out.

The feature will not register as a public slash command. It behaves like an automatic message handler, similar in spirit to sticker handling, but triggered by supported URLs in message text.

## Components

- `social-link-detector.service.ts`: extracts URLs from message text and returns the first supported social URL.
- `social-download-policy.service.ts`: decides whether the feature should run for the chat based on env config and chat type.
- `yt-dlp-downloader.service.ts`: creates a per-download temp directory, runs `yt-dlp`, reads metadata, enforces max size/timeout, returns file path and caption, and exposes cleanup metadata to the handler.
- `social-download.handler.ts`: coordinates user messaging, download, media sending, error mapping, and cleanup.
- `social-download.command.ts`: internal automatic command so existing command execution infrastructure can invoke the handler.
- `social-media-downloader.module.ts`: wires providers and exports the command for registration.

## Runtime Configuration

- `SOCIAL_DOWNLOAD_ENABLED`: defaults to `true`.
- `SOCIAL_DOWNLOAD_GROUPS_ENABLED`: defaults to `false`.
- `SOCIAL_DOWNLOAD_MAX_FILE_MB`: defaults to `100`.
- `SOCIAL_DOWNLOAD_TIMEOUT_MS`: defaults to `120000`.
- `SOCIAL_DOWNLOAD_TMP_DIR`: defaults to `/tmp/chat-pack-social-downloads`.

The Docker image must install `yt-dlp` in addition to the existing `ffmpeg` and Chromium packages.

## Data Flow

```text
WhatsApp message
  -> CommandHandlerService builds MessageContext
  -> Existing session wins
  -> Slash command wins
  -> Media sticker resolver wins
  -> Social link detector checks text
  -> Social download command executes
  -> Handler sends "downloading" message with emoji
  -> yt-dlp downloads into temp directory
  -> Handler sends media with caption
  -> Handler deletes temp directory in finally
```

## User Messages

Every user-facing message for this feature must include emojis. Examples:

- `*[⏳]* Descargando el contenido...`
- `*[✅]* Listo, aca esta el contenido.`
- `*[🔒]* No pude descargarlo. Puede ser privado o requerir login.`
- `*[📦]* El archivo supera el limite de 100 MB.`
- `*[⏱️]* La descarga tardo demasiado.`
- `*[❎]* No pude descargar ese contenido ahora.`

## Error Handling

- Unsupported URL: do nothing.
- Missing `yt-dlp`: reply with a generic failure message and log the technical detail.
- Private/login-required/rate-limited content: reply with a privacy/login message.
- Max size exceeded: reply with a size message.
- Timeout: kill the process and reply with a timeout message.
- Send failure: reply with a generic failure if possible.
- Cleanup failure: log a warning, but do not fail the user flow after the download result was already handled.

## Testing Strategy

- Unit test URL detection for supported and unsupported domains.
- Unit test group/private policy defaults and env overrides.
- Unit test error-to-message mapping.
- Unit test downloader behavior by mocking child-process execution and filesystem boundaries.
- Unit test command resolution priority: slash commands first, media stickers second, social links after that.
- Unit test handler cleanup runs on success and failure.

## Known Limitations

- Instagram and Twitter/X may fail without cookies for private, sensitive, or rate-limited content.
- WhatsApp may reject files near or below the configured 100 MB limit depending on media type or client constraints.
- Multiple links in one message will process only the first supported URL for the initial version.
