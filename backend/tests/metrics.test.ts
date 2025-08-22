import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';

describe('Metrics API', () => {
  const testClinicId = '550e8400-e29b-41d4-a716-446655440000';
  const fromDate = '2025-01-01';
  const toDate = '2025-01-31';

  describe('GET /api/metrics/summary', () => {
    it('should validate required parameters', async () => {
      await request(app)
        .get('/api/metrics/summary')
        .expect(400);
    });

    it('should validate UUID format for clinic_id', async () => {
      await request(app)
        .get('/api/metrics/summary?clinic_id=invalid&from=2025-01-01&to=2025-01-31')
        .expect(400);
    });

    it('should validate date format', async () => {
      await request(app)
        .get(`/api/metrics/summary?clinic_id=${testClinicId}&from=invalid&to=2025-01-31`)
        .expect(400);
    });

    it('should return metrics summary with valid parameters', async () => {
      const response = await request(app)
        .get(`/api/metrics/summary?clinic_id=${testClinicId}&from=${fromDate}&to=${toDate}`)
        .expect(200);

      expect(response.body).toMatchObject({
        agendamentosHoje: expect.any(Number),
        agendamentosPeriodo: expect.any(Number),
        tempoMedioRespostaSeg: expect.any(Number),
        p50RespostaSeg: expect.any(Number),
        taxaResposta: expect.any(Number),
        noShows: expect.any(Number),
        faltasReagendadas: expect.any(Number),
      });
    });
  });

  describe('GET /api/metrics/timeseries', () => {
    it('should validate metric parameter', async () => {
      await request(app)
        .get(`/api/metrics/timeseries?clinic_id=${testClinicId}&metric=invalid&from=${fromDate}&to=${toDate}`)
        .expect(400);
    });

    it('should return timeseries data for valid metric', async () => {
      const response = await request(app)
        .get(`/api/metrics/timeseries?clinic_id=${testClinicId}&metric=agendamentos&from=${fromDate}&to=${toDate}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        expect(response.body[0]).toMatchObject({
          day: expect.any(String),
          value: expect.any(Number),
        });
      }
    });
  });
});