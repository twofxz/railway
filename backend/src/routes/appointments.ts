import { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { recentAppointmentsQuerySchema } from '../lib/validation';

export const getRecentAppointments = async (req: Request, res: Response) => {
  try {
    const { clinic_id, limit } = recentAppointmentsQuerySchema.parse(req.query);

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .select('id, patient_id, status, scheduled_for, scheduled_at')
      .eq('clinic_id', clinic_id)
      .order('scheduled_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Recent appointments error:', error);
      return res.status(500).json({ error: 'Failed to fetch recent appointments' });
    }

    res.json(data || []);
  } catch (error) {
    console.error('Recent appointments validation error:', error);
    res.status(400).json({ error: 'Invalid query parameters' });
  }
};