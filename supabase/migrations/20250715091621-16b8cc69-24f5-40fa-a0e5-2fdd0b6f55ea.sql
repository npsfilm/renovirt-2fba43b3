-- Update existing draft orders to proper status
-- This fixes orders that are stuck in draft status
UPDATE orders 
SET payment_flow_status = CASE 
  WHEN payment_method = 'invoice' AND payment_status = 'pending' THEN 'payment_pending'
  WHEN payment_method = 'invoice' AND payment_status = 'paid' THEN 'payment_completed'
  WHEN payment_method = 'stripe' AND payment_status = 'paid' THEN 'payment_completed'
  ELSE 'payment_pending'
END,
updated_at = now()
WHERE payment_flow_status = 'draft' 
  AND order_number IS NOT NULL 
  AND order_number != '';