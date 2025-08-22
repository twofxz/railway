-- Row Level Security (RLS) Configuration
-- Enable RLS on all tables - Backend uses SERVICE_ROLE to bypass RLS

-- Enable RLS on all tables
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Default deny policies (SERVICE_ROLE bypasses these)
-- These policies ensure no direct access from frontend

CREATE POLICY "Default deny all" ON public.clinics FOR ALL USING (false);
CREATE POLICY "Default deny all" ON public.patients FOR ALL USING (false);
CREATE POLICY "Default deny all" ON public.conversations FOR ALL USING (false);
CREATE POLICY "Default deny all" ON public.messages FOR ALL USING (false);
CREATE POLICY "Default deny all" ON public.appointments FOR ALL USING (false);

-- Note: RLS is enabled to ensure security by default
-- The backend API uses SERVICE_ROLE which bypasses RLS
-- This prevents any accidental direct database access from frontend