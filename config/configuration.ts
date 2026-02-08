export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  chromium_dir: process.env.CHROMIUM_DIR,
  MONGODB_URI: process.env.MONGODB_URI,
  MAPS_API: process.env.MAPS_API,
  SEE_BUS_BASE_URL: process.env.SEE_BUS_BASE_URL,
});
