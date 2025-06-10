
-- RLS für order_invoices aktivieren
ALTER TABLE public.order_invoices ENABLE ROW LEVEL SECURITY;

-- Policy: Kunden können ihre eigenen Rechnungen sehen
CREATE POLICY "Users can view their own order invoices" 
  ON public.order_invoices 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_invoices.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Policy: Admins können alle Rechnungen sehen
CREATE POLICY "Admins can view all order invoices" 
  ON public.order_invoices 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.customer_profiles 
      WHERE customer_profiles.user_id = auth.uid() 
      AND customer_profiles.app_role = 'admin'
    )
  );
