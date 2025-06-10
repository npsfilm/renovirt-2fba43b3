
-- RPC-Funktion zum Abrufen von Sicherheitsereignissen
CREATE OR REPLACE FUNCTION public.get_security_events()
RETURNS TABLE(
  id UUID,
  event_type TEXT,
  user_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  severity TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    se.id,
    se.event_type,
    se.user_id,
    se.details,
    se.ip_address,
    se.user_agent,
    se.created_at,
    se.severity
  FROM public.security_events se
  ORDER BY se.created_at DESC
  LIMIT 100;
$$;

-- RPC-Funktion zum Protokollieren von Sicherheitsereignissen
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_details JSONB DEFAULT '{}',
  p_severity TEXT DEFAULT 'low',
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    event_type,
    user_id,
    details,
    ip_address,
    user_agent,
    severity
  ) VALUES (
    p_event_type,
    auth.uid(),
    p_details,
    p_ip_address::INET,
    p_user_agent,
    p_severity
  ) RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$;
