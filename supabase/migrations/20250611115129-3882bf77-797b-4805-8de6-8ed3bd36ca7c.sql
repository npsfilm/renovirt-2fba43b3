
-- Drop existing policies to recreate them with proper permissions
DROP POLICY IF EXISTS "Users can upload to their own folder in order-images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files in order-images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files in order-images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files in order-images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage order-deliverables" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage order-invoices" ON storage.objects;

-- Create more permissive policies for order-images bucket
CREATE POLICY "Allow authenticated uploads to order-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'order-images');

CREATE POLICY "Allow authenticated reads from order-images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'order-images');

CREATE POLICY "Allow authenticated updates to order-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'order-images');

CREATE POLICY "Allow authenticated deletes from order-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'order-images');

-- Create policies for order-deliverables bucket (admin access)
CREATE POLICY "Admins can manage order-deliverables"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'order-deliverables' 
  AND EXISTS (
    SELECT 1 FROM customer_profiles 
    WHERE user_id = auth.uid() AND app_role = 'admin'
  )
);

-- Create policies for order-invoices bucket (admin access)
CREATE POLICY "Admins can manage order-invoices"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'order-invoices' 
  AND EXISTS (
    SELECT 1 FROM customer_profiles 
    WHERE user_id = auth.uid() AND app_role = 'admin'
  )
);

-- Update the file size limit to 100MB as requested
UPDATE storage.buckets 
SET file_size_limit = 104857600  -- 100MB limit
WHERE id = 'order-images';
