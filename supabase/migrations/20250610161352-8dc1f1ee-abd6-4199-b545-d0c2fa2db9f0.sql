
-- Erstelle security_events Tabelle für Sicherheits-Audit-Logging
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  severity TEXT NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

-- RLS für Security Events - Nur Admins können alle Events sehen
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins können alle Sicherheitsereignisse sehen" ON public.security_events
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM customer_profiles cp 
    WHERE cp.user_id = auth.uid() AND cp.app_role = 'admin'
  )
);

CREATE POLICY "System kann Sicherheitsereignisse erstellen" ON public.security_events
FOR INSERT WITH CHECK (true);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON public.security_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON public.security_events (user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON public.security_events (event_type);
