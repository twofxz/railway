-- Database functions for maintenance and optimization

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION public.refresh_mv_dashboard_daily() 
RETURNS VOID 
LANGUAGE SQL 
AS $$
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_dashboard_daily;
$$;