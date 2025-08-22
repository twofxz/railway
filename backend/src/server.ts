import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './lib/config';
import { healthCheck } from './routes/health';
import { getMetricsSummary, getMetricsTimeseries } from './routes/metrics';
import { getRecentAppointments } from './routes/appointments';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - only allow the specified Netlify domain
app.use(cors({
  origin: config.cors.allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', healthCheck);

// Metrics endpoints
app.get('/api/metrics/summary', getMetricsSummary);
app.get('/api/metrics/timeseries', getMetricsTimeseries);

// Appointments endpoints
app.get('/api/appointments/recent', getRecentAppointments);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const server = app.listen(config.port, () => {
  console.log(`🚀 NeoTime AI Backend running on port ${config.port}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔒 CORS allowed origin: ${config.cors.allowedOrigin}`);
  console.log(`🗄️  Supabase URL: ${config.supabase.url}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;