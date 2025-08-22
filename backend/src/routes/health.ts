import { Request, Response } from 'express';

export const healthCheck = async (req: Request, res: Response) => {
  try {
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Health check failed'
    });
  }
};