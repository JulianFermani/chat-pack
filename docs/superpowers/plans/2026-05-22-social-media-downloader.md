# Social Media Downloader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an automatic WhatsApp feature that downloads public Instagram, TikTok, and Twitter/X media through `yt-dlp`, sends it with the post caption, and removes all temporary files.

**Architecture:** Add a focused `social-media-downloader` feature module with detector, policy, downloader, handler, and internal command. The existing command resolver will invoke it after slash commands and sticker media resolution, preserving current behavior priorities.

**Tech Stack:** NestJS, TypeScript, Jest, whatsapp-web.js `MessageMedia`, Node `child_process`, Node filesystem temp directories, Docker `yt-dlp`.

---

## File Structure

- Create `src/whatsapp/features/social-media-downloader/social-link-detector.service.ts`: URL extraction and supported-domain filtering.
- Create `src/whatsapp/features/social-media-downloader/social-download-policy.service.ts`: env-based enablement for private/group chats and size/time limits.
- Create `src/whatsapp/features/social-media-downloader/social-download-errors.ts`: typed errors and user-facing emoji messages.
- Create `src/whatsapp/features/social-media-downloader/yt-dlp-downloader.service.ts`: safe `yt-dlp` execution and temp cleanup data.
- Create `src/whatsapp/features/social-media-downloader/social-download.handler.ts`: user messaging, download orchestration, WhatsApp media send, cleanup.
- Create `src/whatsapp/features/social-media-downloader/social-download.command.ts`: internal auto-command registered in `CommandRegistry`.
- Create `src/whatsapp/features/social-media-downloader/social-media-downloader.module.ts`: Nest module wiring.
- Modify `src/whatsapp/command-handler/services/command-resolver.service.ts`: resolve social downloader after commands and media.
- Modify `src/whatsapp/client/whatsapp.service.ts`: add generic `sendMediaWithCaption`.
- Modify `src/app.module.ts`: import module.
- Modify `config/configuration.ts`, env templates, `README.md`, and `Dockerfile`: runtime config and `yt-dlp` installation.
- Add Jest specs beside each relevant unit.

## Tasks

### Task 1: Link Detector

**Files:**
- Create: `src/whatsapp/features/social-media-downloader/social-link-detector.service.ts`
- Test: `src/whatsapp/features/social-media-downloader/social-link-detector.service.spec.ts`

- [ ] Write failing tests for supported Instagram, TikTok, X/Twitter URLs and unsupported URLs.
- [ ] Run `npm test -- social-link-detector.service.spec.ts` and confirm missing module failure.
- [ ] Implement detector with `extractFirstSupportedUrl(text: string): string | undefined`.
- [ ] Run detector spec and confirm pass.
- [ ] Commit with `feat(social): detecto links soportados`.

### Task 2: Runtime Policy

**Files:**
- Create: `src/whatsapp/features/social-media-downloader/social-download-policy.service.ts`
- Test: `src/whatsapp/features/social-media-downloader/social-download-policy.service.spec.ts`
- Modify: `config/configuration.ts`
- Modify: `config/env/development.env.template`
- Modify: `config/env/production.env.template`

- [ ] Write failing tests for default private enabled, group disabled, env overrides, max size default 100 MB, and timeout default 120000 ms.
- [ ] Run `npm test -- social-download-policy.service.spec.ts` and confirm missing module failure.
- [ ] Implement policy service using `ConfigService`.
- [ ] Add config keys to `configuration.ts` and env templates.
- [ ] Run policy spec and confirm pass.
- [ ] Commit with `feat(social): agrego politica de descarga`.

### Task 3: Error Mapping

**Files:**
- Create: `src/whatsapp/features/social-media-downloader/social-download-errors.ts`
- Test: `src/whatsapp/features/social-media-downloader/social-download-errors.spec.ts`

- [ ] Write failing tests that map `missing-binary`, `private-content`, `max-size`, `timeout`, and unknown errors to emoji-prefixed messages.
- [ ] Run `npm test -- social-download-errors.spec.ts` and confirm missing module failure.
- [ ] Implement typed error class and `buildSocialDownloadErrorMessage(error, maxFileMb)`.
- [ ] Run error spec and confirm pass.
- [ ] Commit with `feat(social): normalizo errores de descarga`.

### Task 4: Safe yt-dlp Downloader

**Files:**
- Create: `src/whatsapp/features/social-media-downloader/yt-dlp-downloader.service.ts`
- Test: `src/whatsapp/features/social-media-downloader/yt-dlp-downloader.service.spec.ts`

- [ ] Write failing tests with mocked `child_process.execFile` and filesystem helpers for success, max-size stderr, private/login stderr, timeout, and cleanup path return.
- [ ] Run `npm test -- yt-dlp-downloader.service.spec.ts` and confirm missing module failure.
- [ ] Implement downloader using `mkdtemp`, `execFile`, `--dump-single-json`, `--max-filesize`, `--write-info-json`, and output template under temp dir.
- [ ] Return `{ filePath, caption, tempDir }` and expose `cleanup(tempDir)`.
- [ ] Run downloader spec and confirm pass.
- [ ] Commit with `feat(social): agrego descarga segura con yt-dlp`.

### Task 5: WhatsApp Media Send

**Files:**
- Modify: `src/whatsapp/client/whatsapp.service.ts`

- [ ] Add/update existing `WhatsappService` tests if needed to cover generic media sending with caption.
- [ ] Run the focused test and confirm failure because method does not exist.
- [ ] Add `sendMediaWithCaption(to: string, media: MessageMedia, caption?: string)` using the existing outbound queue.
- [ ] Run focused test and confirm pass.
- [ ] Commit with `feat(whatsapp): envio media con caption`.

### Task 6: Handler and Internal Command

**Files:**
- Create: `src/whatsapp/features/social-media-downloader/social-download.handler.ts`
- Create: `src/whatsapp/features/social-media-downloader/social-download.command.ts`
- Create: `src/whatsapp/features/social-media-downloader/social-media-downloader.module.ts`
- Test: `src/whatsapp/features/social-media-downloader/social-download.handler.spec.ts`

- [ ] Write failing handler tests for success, no URL, disabled by policy, download failure user message, and cleanup on success/failure.
- [ ] Run `npm test -- social-download.handler.spec.ts` and confirm missing module failure.
- [ ] Implement handler and command with all user-facing messages including emojis.
- [ ] Implement module wiring.
- [ ] Run handler spec and confirm pass.
- [ ] Commit with `feat(social): agrego handler automatico`.

### Task 7: Resolver Integration

**Files:**
- Modify: `src/whatsapp/command-handler/services/command-resolver.service.ts`
- Modify: `src/whatsapp/command-handler/services/command-resolver.service.spec.ts`
- Modify: `src/app.module.ts`

- [ ] Write failing resolver tests proving slash commands win, media stickers win, social links resolve only afterward, and unsupported text returns undefined.
- [ ] Run `npm test -- command-resolver.service.spec.ts` and confirm social link test fails.
- [ ] Inject `SocialLinkDetectorService` into resolver and return `socialdownload` command for supported URLs.
- [ ] Import `SocialMediaDownloaderModule` in `AppModule`.
- [ ] Run resolver spec and confirm pass.
- [ ] Commit with `feat(social): conecto descarga automatica`.

### Task 8: Runtime Docs and Docker

**Files:**
- Modify: `Dockerfile`
- Modify: `README.md`

- [ ] Update Dockerfile to install `yt-dlp`.
- [ ] Document env keys, group default, no-cookies limitation, supported platforms, and cleanup behavior.
- [ ] Run `npm run build` and `npm test`.
- [ ] Commit with `docs(social): documento configuracion de descargas`.

### Task 9: Final Verification

**Files:**
- No new files expected.

- [ ] Run `npm run build`.
- [ ] Run `npm test`.
- [ ] Run `git status --short --branch` and confirm the branch is clean.
- [ ] Confirm branch is `feature/social-media-downloader` and not merged to `develop`.

## Self-Review

- Spec coverage: all approved requirements are mapped to tasks, including emojis, no cookies, 100 MB limit, group env config, cleanup, and separate feature branch.
- Placeholder scan: no placeholders remain.
- Type consistency: planned services and method names are consistent across tasks.
