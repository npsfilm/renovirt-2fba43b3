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