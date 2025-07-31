-- Add RLS policy for admins to view all help interactions
CREATE POLICY "Admins can view all help interactions" 
ON public.help_interactions 
FOR SELECT 
TO authenticated
USING (has_admin_role(auth.uid()));