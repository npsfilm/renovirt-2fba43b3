-- Security Enhancement: Restrict Help Documents Access
-- Remove public access and require authentication for help documents
DROP POLICY IF EXISTS "Everyone can view active help documents" ON public.help_documents;

-- Create new policy requiring authentication for help documents
CREATE POLICY "Authenticated users can view active help documents" 
ON public.help_documents 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- Security Enhancement: Restrict Business Data Exposure
-- Remove public access to detailed pricing information
DROP POLICY IF EXISTS "Anyone can view packages" ON public.packages;
DROP POLICY IF EXISTS "Anyone can view add-ons" ON public.add_ons;

-- Create new policies requiring authentication for pricing data
CREATE POLICY "Authenticated users can view packages" 
ON public.packages 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view add-ons" 
ON public.add_ons 
FOR SELECT 
TO authenticated
USING (true);

-- Security Enhancement: Add audit logging for admin role changes
CREATE OR REPLACE FUNCTION public.audit_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log role changes for app_role column
  IF OLD.app_role IS DISTINCT FROM NEW.app_role THEN
    INSERT INTO public.role_change_audit (
      target_user_id,
      changed_by,
      old_role,
      new_role,
      change_reason
    ) VALUES (
      NEW.user_id,
      auth.uid(),
      OLD.app_role::text,
      NEW.app_role::text,
      'Admin role change via profile update'
    );
    
    -- Log security event
    INSERT INTO public.security_events (
      event_type,
      user_id,
      details,
      severity
    ) VALUES (
      'admin_role_change',
      auth.uid(),
      jsonb_build_object(
        'target_user_id', NEW.user_id,
        'old_role', OLD.app_role,
        'new_role', NEW.app_role,
        'timestamp', now()
      ),
      CASE 
        WHEN NEW.app_role = 'admin' THEN 'high'
        ELSE 'medium'
      END
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role change auditing
DROP TRIGGER IF EXISTS trigger_audit_role_change ON public.customer_profiles;
CREATE TRIGGER trigger_audit_role_change
  AFTER UPDATE ON public.customer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_role_change();

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
    v_current_count := v_existing_record.interaction_count + 1;
    
    IF v_current_count > p_max_requests THEN
      -- Log enhanced security event for rate limit violation
      INSERT INTO security_events (
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
    
    UPDATE help_interaction_limits
    SET interaction_count = v_current_count,
        updated_at = now()
    WHERE id = v_existing_record.id;
  ELSE
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
  
  RETURN TRUE;
END;
$function$

-- Security Enhancement: Function to detect suspicious authentication patterns
CREATE OR REPLACE FUNCTION public.detect_suspicious_auth_pattern(
  p_user_id uuid,
  p_ip_address inet DEFAULT NULL::inet,
  p_user_agent text DEFAULT NULL::text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_recent_failures integer;
  v_recent_ips integer;
  v_is_suspicious boolean := false;
BEGIN
  -- Check for multiple failed login attempts in last hour
  SELECT COUNT(*) INTO v_recent_failures
  FROM security_events
  WHERE event_type LIKE '%failed%'
    AND user_id = p_user_id
    AND created_at >= now() - interval '1 hour';
  
  -- Check for multiple different IP addresses in last 24 hours
  SELECT COUNT(DISTINCT ip_address) INTO v_recent_ips
  FROM security_events
  WHERE user_id = p_user_id
    AND ip_address IS NOT NULL
    AND created_at >= now() - interval '24 hours';
  
  -- Mark as suspicious if multiple failures or multiple IPs
  IF v_recent_failures >= 3 OR v_recent_ips >= 3 THEN
    v_is_suspicious := true;
    
    -- Log suspicious activity
    INSERT INTO security_events (
      event_type,
      user_id,
      details,
      severity,
      ip_address,
      user_agent
    ) VALUES (
      'suspicious_auth_pattern_detected',
      p_user_id,
      jsonb_build_object(
        'recent_failures', v_recent_failures,
        'recent_ips', v_recent_ips,
        'detection_timestamp', now()
      ),
      'critical',
      p_ip_address,
      p_user_agent
    );
  END IF;
  
  RETURN v_is_suspicious;
END;
$function$