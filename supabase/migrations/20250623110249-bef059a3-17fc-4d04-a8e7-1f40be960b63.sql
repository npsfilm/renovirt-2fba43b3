
-- Add extras column to orders table to store order extras as JSONB
ALTER TABLE public.orders 
ADD COLUMN extras JSONB DEFAULT '{}'::jsonb;

-- Add a comment to document the column
COMMENT ON COLUMN public.orders.extras IS 'Stores order extras like upscale, express, watermark as JSON';
