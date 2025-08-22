import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  supabase: {
    url: process.env.SUPABASE_URL!,
    serviceRole: process.env.SUPABASE_SERVICE_ROLE!,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },
  
  cors: {
    allowedOrigin: process.env.ALLOWED_ORIGIN || 'https://whimsical-starlight-f44116.netlify.app',
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}