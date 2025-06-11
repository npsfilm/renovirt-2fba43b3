
-- Create storage bucket for order images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-images', 
  'order-images', 
  false,
  26214400, -- 25MB limit
  ARRAY['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'application/zip']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 26214400,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'application/zip'];

-- Create RLS policies for the order-images bucket
-- Policy to allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload to their own folder in order-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'order-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow users to view their own uploaded files
CREATE POLICY "Users can view their own files in order-images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'order-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow users to update their own files
CREATE POLICY "Users can update their own files in order-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'order-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow users to delete their own files
CREATE POLICY "Users can delete their own files in order-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'order-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Also create bucket for order deliverables (for final files)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-deliverables', 
  'order-deliverables', 
  false,
  52428800, -- 50MB limit for final files
  ARRAY['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'application/pdf', 'application/zip']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'application/pdf', 'application/zip'];

-- RLS policies for order-deliverables bucket (admin access)
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

-- Create bucket for order invoices
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-invoices', 
  'order-invoices', 
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png'];

-- RLS policies for order-invoices bucket (admin access)
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
