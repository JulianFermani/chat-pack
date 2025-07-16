export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  chromium_dir: process.env.CHROMIUM_DIR,
  MONGODB_URI: process.env.MONGODB_URI,
});
