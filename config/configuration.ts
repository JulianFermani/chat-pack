export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  chromium_dir: process.env.CHROMIUM_DIR,
  MONGODB_URI: process.env.MONGODB_URI,
  WHATSAPP_AUTH_MODE: process.env.WHATSAPP_AUTH_MODE,
  WHATSAPP_CLIENT_ID: process.env.WHATSAPP_CLIENT_ID,
  WHATSAPP_REMOTE_BACKUP_SYNC_INTERVAL_MS:
    process.env.WHATSAPP_REMOTE_BACKUP_SYNC_INTERVAL_MS,
  NTFY_BASE_URL: process.env.NTFY_BASE_URL,
  NTFY_TOPIC: process.env.NTFY_TOPIC,
  APP_NAME: process.env.APP_NAME,
  MAPS_API: process.env.MAPS_API,
  SEE_BUS_BASE_URL: process.env.SEE_BUS_BASE_URL,
});
