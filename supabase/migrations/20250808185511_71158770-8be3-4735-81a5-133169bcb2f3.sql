-- Enhance Help Interactions Security
-- This migration improves security for help interactions by requiring authentication,
-- adding rate limiting, and implementing better session tracking

-- First, drop the overly permissive policy that allows anyone to create help interactions
DROP POLICY IF EXISTS "Anyone can create help interactions" ON public.help_interactions;

-- Create new authenticated-only policy for creating help interactions
CREATE POLICY "Authenticated users can create help interactions" ON public.help_interactions
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Update the view policy to be more restrictive
DROP POLICY IF EXISTS "Users can view their own help interactions" ON public.help_interactions;

CREATE POLICY "Users can view their own help interactions" ON public.help_interactions
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a new table for tracking help interaction rate limits
CREATE TABLE IF NOT EXISTS public.help_interaction_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  ip_address inet,
  session_id text,
  interaction_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE public.help_interaction_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for the rate limiting table
CREATE POLICY "System can manage rate limits" ON public.help_interaction_limits
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to check and enforce rate limits for help interactions
CREATE OR REPLACE FUNCTION public.check_help_interaction_rate_limit(
  p_user_id uuid DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_session_id text DEFAULT NULL,
  p_max_requests integer DEFAULT 10,
  p_window_minutes integer DEFAULT 60
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_current_count integer;
  v_window_start timestamp with time zone;
  v_existing_record record;
BEGIN
  v_window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Check for existing rate limit record
  SELECT * INTO v_existing_record
  FROM help_interaction_limits
  WHERE (
    (p_user_id IS NOT NULL AND user_id = p_user_id) OR
    (p_user_id IS NULL AND ip_address = p_ip_address AND session_id = p_session_id)
  )
  AND window_start >= v_window_start
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_existing_record.id IS NOT NULL THEN
    -- Update existing record
    v_current_count := v_existing_record.interaction_count + 1;
    
    IF v_current_count > p_max_requests THEN
      -- Log rate limit violation
      INSERT INTO security_events (
        event_type,
        user_id,
        details,
        severity,
        ip_address
      ) VALUES (
        'help_interaction_rate_limit_exceeded',
        p_user_id,
        jsonb_build_object(
          'current_count', v_current_count,
          'max_requests', p_max_requests,
          'window_minutes', p_window_minutes,
          'session_id', p_session_id
        ),
        'high',
        p_ip_address
      );
      
      RETURN FALSE;
    END IF;
    
    -- Update count
    UPDATE help_interaction_limits
    SET interaction_count = v_current_count,
        updated_at = now()
    WHERE id = v_existing_record.id;
  ELSE
    -- Create new rate limit record
    INSERT INTO help_interaction_limits (
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
  
  -- Log successful rate limit check
  INSERT INTO security_events (
    event_type,
    user_id,
    details,
    severity,
    ip_address
  ) VALUES (
    'help_interaction_rate_limit_check',
    p_user_id,
    jsonb_build_object(
      'current_count', COALESCE(v_current_count, 1),
      'max_requests', p_max_requests,
      'session_id', p_session_id
    ),
    'low',
    p_ip_address
  );
  
  RETURN TRUE;
END;
$function$;

-- Create function to track enhanced help interaction sessions
CREATE OR REPLACE FUNCTION public.create_secure_help_interaction(
  p_question text,
  p_ai_response text,
  p_session_id text,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_interaction_id uuid;
  v_rate_limit_ok boolean;
BEGIN
  v_user_id := auth.uid();
  
  -- Check rate limits
  SELECT check_help_interaction_rate_limit(
    v_user_id,
    p_ip_address,
    p_session_id,
    10, -- max 10 requests
    60  -- per hour
  ) INTO v_rate_limit_ok;
  
  IF NOT v_rate_limit_ok THEN
    RAISE EXCEPTION 'Rate limit exceeded for help interactions';
  END IF;
  
  -- Create the help interaction
  INSERT INTO help_interactions (
    user_id,
    question,
    ai_response,
    session_id,
    ip_address,
    user_agent
  ) VALUES (
    v_user_id,
    p_question,
    p_ai_response,
    p_session_id,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO v_interaction_id;
  
  -- Log security event
  INSERT INTO security_events (
    event_type,
    user_id,
    details,
    severity,
    ip_address,
    user_agent
  ) VALUES (
    'help_interaction_created',
    v_user_id,
    jsonb_build_object(
      'interaction_id', v_interaction_id,
      'session_id', p_session_id,
      'question_length', length(p_question)
    ),
    'low',
    p_ip_address,
    p_user_agent
  );
  
  RETURN v_interaction_id;
END;
$function$;

-- Create trigger to update help_interaction_limits updated_at
CREATE OR REPLACE FUNCTION update_help_interaction_limits_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE TRIGGER update_help_interaction_limits_updated_at
  BEFORE UPDATE ON public.help_interaction_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_help_interaction_limits_updated_at();

-- Clean up old rate limit records (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_help_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM help_interaction_limits
  WHERE created_at < now() - interval '24 hours';
END;
$function$;