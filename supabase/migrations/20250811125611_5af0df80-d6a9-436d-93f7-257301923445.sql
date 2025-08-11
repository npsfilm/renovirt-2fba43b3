-- Fix security warning: Set proper search_path for function
CREATE OR REPLACE FUNCTION public.audit_role_change()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
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
$$;