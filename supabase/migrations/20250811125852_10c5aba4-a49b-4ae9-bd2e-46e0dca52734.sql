-- Security Enhancement: Enhanced rate limiting function for help interactions
CREATE OR REPLACE FUNCTION public.enhanced_help_rate_limit(
  p_user_id uuid DEFAULT NULL::uuid,
  p_ip_address inet DEFAULT NULL::inet,
  p_session_id text DEFAULT NULL::text,
  p_max_requests integer DEFAULT 5,  -- Reduced from 10
  p_window_minutes integer DEFAULT 15  -- Reduced from 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_current_count integer;
  v_window_start timestamp with time zone;
  v_existing_record record;
BEGIN
  v_window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Check for existing rate limit record
  SELECT * INTO v_existing_record
  FROM public.help_interaction_limits
  WHERE (
    (p_user_id IS NOT NULL AND user_id = p_user_id) OR
    (p_user_id IS NULL AND ip_address = p_ip_address AND session_id = p_session_id)
  )
  AND window_start >= v_window_start
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_existing_record.id IS NOT NULL THEN
    v_current_count := v_existing_record.interaction_count + 1;
    
    IF v_current_count > p_max_requests THEN
      -- Log enhanced security event for rate limit violation
      INSERT INTO public.security_events (
        event_type,
        user_id,
        details,
        severity,
        ip_address
      ) VALUES (
        'help_interaction_rate_limit_exceeded_enhanced',
        p_user_id,
        jsonb_build_object(
          'current_count', v_current_count,
          'max_requests', p_max_requests,
          'window_minutes', p_window_minutes,
          'session_id', p_session_id,
          'violation_severity', CASE 
            WHEN v_current_count > p_max_requests * 2 THEN 'severe'
            ELSE 'moderate'
          END
        ),
        'high',
        p_ip_address
      );
      
      RETURN FALSE;
    END IF;
    
    UPDATE public.help_interaction_limits
    SET interaction_count = v_current_count,
        updated_at = now()
    WHERE id = v_existing_record.id;
  ELSE
    INSERT INTO public.help_interaction_limits (
      user_id,
      ip_address,
      session_id,
      interaction_count,
      window_start
    ) VALUES (
      p_user_id,
      p_ip_address,
      p_session_id,
      1,
      now()
    );
  END IF;
  
  RETURN TRUE;
END;
$$;