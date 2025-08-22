-- Materialized views for dashboard performance
-- Run this after views creation

-- Daily dashboard materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_dashboard_daily AS
SELECT
    a.clinic_id,
    (DATE_TRUNC('day', a.scheduled_at))::DATE AS day,
    COUNT(*) FILTER (WHERE a.status IN ('scheduled', 'rescheduled')) AS appts_total,
    COUNT(*) FILTER (WHERE a.status = 'no_show') AS no_shows,
    COUNT(*) FILTER (WHERE a.status = 'rescheduled' AND a.reschedule_of IS NOT NULL) AS rescheduled_from_no_show,
    -- Response metrics from conversations on the same day
    AVG(v.response_seconds) AS avg_response_sec,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY v.response_seconds) AS p50_response_sec,
    COUNT(*) FILTER (WHERE v.responded) AS conversations_responded,
    COUNT(v.conversation_id) AS conversations_total
FROM public.appointments a
LEFT JOIN public.vw_first_response v ON (
    v.clinic_id = a.clinic_id
    AND v.conversation_id IN (
        SELECT c.id 
        FROM public.conversations c
        WHERE c.clinic_id = a.clinic_id
        AND c.started_at::DATE = a.scheduled_at::DATE
    )
)
GROUP BY a.clinic_id, (DATE_TRUNC('day', a.scheduled_at))::DATE;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_dashboard_daily_unique 
ON public.mv_dashboard_daily (clinic_id, day);