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