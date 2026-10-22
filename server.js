import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = '0.0.0.0';

async function start() {
  await connectDB();
  app.listen(PORT, HOST, () => {
    console.log(`[Tarapith Ashram Backend] Running on http://${HOST}:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[Backend Fatal]', err);
  process.exit(1);
});
