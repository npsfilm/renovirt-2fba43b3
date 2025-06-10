
-- Add is_note column to order_status_history table to distinguish between notes and status updates
ALTER TABLE public.order_status_history 
ADD COLUMN is_note BOOLEAN NOT NULL DEFAULT false;
