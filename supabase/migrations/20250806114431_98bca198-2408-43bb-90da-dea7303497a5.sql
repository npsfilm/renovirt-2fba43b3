-- Create audit table for role changes (simple version)
CREATE TABLE IF NOT EXISTS public.role_change_audit (
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

-- Only admins can view audit logs (using existing has_admin_role function)
CREATE POLICY "admin_view_audit" ON public.role_change_audit
FOR SELECT
USING (public.has_admin_role(auth.uid()));

-- Create policy to prevent non-admins from escalating to admin role
CREATE POLICY "prevent_role_escalation" ON public.customer_profiles
FOR UPDATE
USING (
  -- Allow if user is admin OR if not trying to become admin
  public.has_admin_role(auth.uid()) OR 
  (auth.uid() = user_id AND app_role != 'admin')
)
WITH CHECK (
  -- Allow if user is admin OR if not trying to become admin
  public.has_admin_role(auth.uid()) OR 
  (auth.uid() = user_id AND app_role != 'admin')
);