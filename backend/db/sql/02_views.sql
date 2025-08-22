-- Views for analytics and dashboard
-- Run this after the schema creation

-- First response time view
CREATE OR REPLACE VIEW public.vw_first_response AS
WITH firsts AS (
    SELECT
        c.id AS conversation_id,
        c.clinic_id,
        MIN(CASE WHEN m.sender = 'patient' THEN m.sent_at END) AS first_patient,
        MIN(CASE WHEN m.sender = 'agent' AND m.sent_at > 
            MIN(CASE WHEN m.sender = 'patient' THEN m.sent_at END) 
            THEN m.sent_at END) AS first_agent
    FROM public.conversations c
    JOIN public.messages m ON m.conversation_id = c.id
    GROUP BY c.id, c.clinic_id
)
SELECT
    conversation_id,
    clinic_id,
    EXTRACT(EPOCH FROM (first_agent - first_patient))::NUMERIC AS response_seconds,
    (first_agent IS NOT NULL) AS responded
FROM firsts
WHERE first_patient IS NOT NULL;