import app from '../app.js';
import { connectDB } from '../config/db.js';

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDB();
    } catch (e) {
      console.warn('[Vercel Handler] Database connection attempt error:', e.message);
    }
    isConnected = true;
  }
  return app(req, res);
}
