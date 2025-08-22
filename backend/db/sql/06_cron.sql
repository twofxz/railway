-- Cron job setup for automatic materialized view refresh
-- Run this after all other SQL files

-- Schedule materialized view refresh every 5 minutes
SELECT cron.schedule(
    'refresh_mv_dashboard',
    '*/5 * * * *',
    $$SELECT public.refresh_mv_dashboard_daily();$$
);