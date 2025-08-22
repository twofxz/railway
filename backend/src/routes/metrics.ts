import { Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { summaryQuerySchema, timeseriesQuerySchema } from '../lib/validation';

export const getMetricsSummary = async (req: Request, res: Response) => {
  try {
    const { clinic_id, from, to } = summaryQuerySchema.parse(req.query);
    
    // Get today's date for "agendamentosHoje"
    const today = new Date().toISOString().split('T')[0];
    
    // Query materialized view for the period
    const { data: periodData, error: periodError } = await supabaseAdmin
      .from('mv_dashboard_daily')
      .select('*')
      .eq('clinic_id', clinic_id)
      .gte('day', from)
      .lte('day', to);

    if (periodError) {
      console.error('Period data error:', periodError);
      return res.status(500).json({ error: 'Failed to fetch period data' });
    }

    // Query today's data specifically
    const { data: todayData, error: todayError } = await supabaseAdmin
      .from('mv_dashboard_daily')
      .select('*')
      .eq('clinic_id', clinic_id)
      .eq('day', today)
      .single();

    if (todayError && todayError.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Today data error:', todayError);
      return res.status(500).json({ error: 'Failed to fetch today data' });
    }

    // Calculate aggregated metrics
    const agendamentosHoje = todayData?.appts_total || 0;
    const agendamentosPeriodo = periodData?.reduce((sum, day) => sum + (day.appts_total || 0), 0) || 0;
    
    // Calculate weighted averages for response times
    const totalConversations = periodData?.reduce((sum, day) => sum + (day.conversations_total || 0), 0) || 0;
    const totalResponseTime = periodData?.reduce((sum, day) => 
      sum + ((day.avg_response_sec || 0) * (day.conversations_total || 0)), 0) || 0;
    const tempoMedioRespostaSeg = totalConversations > 0 ? totalResponseTime / totalConversations : 0;

    // P50 response time (median across period)
    const p50Values = periodData?.map(day => day.p50_response_sec).filter(val => val !== null) || [];
    const p50RespostaSeg = p50Values.length > 0 
      ? p50Values.sort((a, b) => a - b)[Math.floor(p50Values.length / 2)] || 0
      : 0;

    // Response rate
    const totalResponded = periodData?.reduce((sum, day) => sum + (day.conversations_responded || 0), 0) || 0;
    const taxaResposta = totalConversations > 0 ? (totalResponded / totalConversations) * 100 : 0;

    // No shows and rescheduled
    const noShows = periodData?.reduce((sum, day) => sum + (day.no_shows || 0), 0) || 0;
    const faltasReagendadas = periodData?.reduce((sum, day) => sum + (day.rescheduled_from_no_show || 0), 0) || 0;

    const response = {
      agendamentosHoje,
      agendamentosPeriodo,
      tempoMedioRespostaSeg: Math.round(tempoMedioRespostaSeg),
      p50RespostaSeg: Math.round(p50RespostaSeg),
      taxaResposta: Math.round(taxaResposta * 100) / 100,
      noShows,
      faltasReagendadas,
    };

    res.json(response);
  } catch (error) {
    console.error('Metrics summary error:', error);
    res.status(400).json({ error: 'Invalid query parameters' });
  }
};

export const getMetricsTimeseries = async (req: Request, res: Response) => {
  try {
    const { clinic_id, metric, from, to } = timeseriesQuerySchema.parse(req.query);

    const { data, error } = await supabaseAdmin
      .from('mv_dashboard_daily')
      .select('day, appts_total, p50_response_sec, avg_response_sec, no_shows, conversations_responded, conversations_total')
      .eq('clinic_id', clinic_id)
      .gte('day', from)
      .lte('day', to)
      .order('day', { ascending: true });

    if (error) {
      console.error('Timeseries error:', error);
      return res.status(500).json({ error: 'Failed to fetch timeseries data' });
    }

    const timeseries = data?.map(row => {
      let value = 0;
      
      switch (metric) {
        case 'agendamentos':
          value = row.appts_total || 0;
          break;
        case 'resposta_p50':
          value = Math.round(row.p50_response_sec || 0);
          break;
        case 'resposta_media':
          value = Math.round(row.avg_response_sec || 0);
          break;
        case 'no_show':
          value = row.no_shows || 0;
          break;
        case 'taxa_resposta':
          const total = row.conversations_total || 0;
          const responded = row.conversations_responded || 0;
          value = total > 0 ? Math.round((responded / total) * 10000) / 100 : 0;
          break;
      }

      return {
        day: row.day,
        value,
      };
    }) || [];

    res.json(timeseries);
  } catch (error) {
    console.error('Timeseries error:', error);
    res.status(400).json({ error: 'Invalid query parameters' });
  }
};