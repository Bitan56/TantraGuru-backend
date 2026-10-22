import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Security and utility middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    frameguard: false, // Allow running in iframe previews
  })
);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1', routes);

// 404 Catch-All Handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Mongoose / Database offline fallback middleware
app.use((err, req, res, next) => {
  if (
    err.name === 'MongooseError' ||
    err.name === 'MongoNetworkError' ||
    (err.message && err.message.includes('buffering timed out'))
  ) {
    console.warn('[AI Studio] Database offline — returning mock response');
    if (req.method === 'GET') {
      return res.json(
        req.path.endsWith('s') || req.path.endsWith('s/')
          ? { success: true, data: [] }
          : { success: true, data: null }
      );
    }
    return res.status(503).json({
      success: false,
      error: 'Service temporarily unavailable (database offline)',
    });
  }
  next(err);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;