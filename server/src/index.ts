import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { config } from './config.js';
import prisma from './prisma.js';

// Route Imports
import aiProvidersRouter from './routes/aiProviders.js';
import tasksRouter from './routes/tasks.js';
import vocabRouter from './routes/vocab.js';
import grammarRouter from './routes/grammar.js';
import scannerRouter from './routes/scanner.js';
import storiesAndExamsRouter from './routes/storiesAndExams.js';
import securityRouter from './routes/security.js';
import audioTtsRouter from './routes/audioTts.js';
import contentHubRouter from './routes/contentHub.js';

const app = express();
const server = http.createServer(app);

// WebSockets for real-time PC-to-Mobile sync & live task progress
export const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Security & Middlewares
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = [
  config.clientUrl,
  `http://localhost:${config.port}`,
  `http://127.0.0.1:${config.port}`,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://192.168.') || origin.startsWith('http://10.')) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', globalLimiter);

// Health & Status Endpoint
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'degraded',
      database: 'disconnected',
      error: err.message,
    });
  }
});

// Mount Feature Routers
app.use('/api/providers', aiProvidersRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/vocab', vocabRouter);
app.use('/api/grammar', grammarRouter);
app.use('/api/scanner', scannerRouter);
app.use('/api/learning', storiesAndExamsRouter);
app.use('/api/security', securityRouter);
app.use('/api/audio', audioTtsRouter);
app.use('/api/content', contentHubRouter);

// Static Assets & Single Page App (SPA) Routing for Production
const candidateStaticPaths = [
  path.resolve(process.cwd(), 'public'),
  path.resolve(process.cwd(), '../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
];
const staticDistPath = candidateStaticPaths.find((p) => fs.existsSync(p));

if (staticDistPath) {
  console.log(`📦 Serving production client assets from: ${staticDistPath}`);
  app.use(express.static(staticDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(staticDistPath, 'index.html'));
  });
}

// Socket.io Events for Device Pairing & Real-time Task Monitoring
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('join_task_stream', (taskId: string) => {
    socket.join(`task:${taskId}`);
  });

  socket.on('join_pairing_session', (pairingToken: string) => {
    socket.join(`pairing:${pairingToken}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  server.listen(config.port, '0.0.0.0', () => {
    console.log(`🚀 DeutschLab Server running on http://localhost:${config.port}`);
    console.log(`🔒 AES-256 Vault Ready`);
    console.log(`📡 WebSocket Gateway Initialized (Localhost & LAN 0.0.0.0)`);
  });
}

export { app, server };
