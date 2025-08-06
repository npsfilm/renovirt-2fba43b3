-- Add RLS policies to prevent admin role escalation
-- First, ensure customer_profiles table has proper constraints
ALTER TABLE public.customer_profiles 
ADD CONSTRAINT valid_app_role CHECK (app_role IN ('user', 'admin'));

-- Create policy to prevent users from changing their own role to admin
CREATE POLICY "prevent_self_role_escalation" ON public.customer_profiles
FOR UPDATE
USING (
  CASE 
    WHEN auth.uid() = user_id AND OLD.app_role != 'admin' AND NEW.app_role = 'admin' 
    THEN false
    ELSE true
  END
);

-- Create audit table for role changes
CREATE TABLE public.role_change_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id UUID NOT NULL,
  old_role TEXT,
  new_role TEXT,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE public.role_change_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "admin_view_audit" ON public.role_change_audit
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.customer_profiles 
    WHERE user_id = auth.uid() AND app_role = 'admin'
  )
);

-- Function to log role changes
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.app_role IS DISTINCT FROM NEW.app_role THEN
    INSERT INTO public.role_change_audit (
      target_user_id,
      old_role,
      new_role,
      changed_by,
      change_reason
    ) VALUES (
      NEW.user_id,
      OLD.app_role,
      NEW.app_role,
      auth.uid(),
      'Role updated via system'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role change auditing
CREATE TRIGGER role_change_audit_trigger
  AFTER UPDATE ON public.customer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_role_change();

-- Create function to securely check admin role (prevents recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.customer_profiles 
    WHERE customer_profiles.user_id = is_admin.user_id 
    AND app_role = 'admin'
  );
$$;