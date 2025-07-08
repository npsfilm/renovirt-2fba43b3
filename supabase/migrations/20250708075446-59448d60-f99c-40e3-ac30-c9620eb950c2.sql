-- Fix overly permissive RLS policies and strengthen admin access control

-- Drop and recreate proper RLS policies for order_invoices
DROP POLICY IF EXISTS "Admin users can manage order invoices" ON public.order_invoices;

CREATE POLICY "Admins can manage order invoices"
ON public.order_invoices
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.customer_profiles 
    WHERE user_id = auth.uid() AND app_role = 'admin'
  )
);

-- Fix order_remarks policy to use proper admin check
DROP POLICY IF EXISTS "Admin users can manage order remarks" ON public.order_remarks;

CREATE POLICY "Admins can manage order remarks"
ON public.order_remarks
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.customer_profiles 
    WHERE user_id = auth.uid() AND app_role = 'admin'
  )
);

-- Add proper admin management policies for packages
CREATE POLICY "Admins can manage packages"
ON public.packages
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.customer_profiles 
    WHERE user_id = auth.uid() AND app_role = 'admin'
  )
);

-- Add proper admin management policies for add_ons
CREATE POLICY "Admins can manage add-ons"
ON public.add_ons
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.customer_profiles 
    WHERE user_id = auth.uid() AND app_role = 'admin'
  )
);

-- Create enhanced security audit function
CREATE OR REPLACE FUNCTION public.audit_admin_action(
  action_type TEXT,
  table_name TEXT,
  record_id UUID DEFAULT NULL,
  details JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  audit_id UUID;
BEGIN
  -- Only log if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.customer_profiles 
    WHERE user_id = auth.uid() AND app_role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized admin action attempted';
  END IF;

  INSERT INTO public.security_events (
    event_type,
    user_id,
    details,
    severity
  ) VALUES (
    'admin_action_' || action_type,
    auth.uid(),
    jsonb_build_object(
      'table', table_name,
      'record_id', record_id,
      'action', action_type,
      'details', details
    ),
    'medium'
  ) RETURNING id INTO audit_id;

  RETURN audit_id;
END;
$$;

-- Create function for persistent rate limiting using database
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  identifier TEXT,
  max_requests INTEGER DEFAULT 100,
  window_seconds INTEGER DEFAULT 3600
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_count INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  window_start := NOW() - (window_seconds || ' seconds')::INTERVAL;
  
  -- Count requests in current window
  SELECT COUNT(*)
  INTO current_count
  FROM public.security_events
  WHERE details->>'rate_limit_key' = identifier
    AND created_at >= window_start;
  
  -- Check if limit exceeded
  IF current_count >= max_requests THEN
    -- Log rate limit violation
    INSERT INTO public.security_events (
      event_type,
      user_id,
      details,
      severity
    ) VALUES (
      'rate_limit_exceeded',
      auth.uid(),
      jsonb_build_object(
        'rate_limit_key', identifier,
        'current_count', current_count,
        'max_requests', max_requests,
        'window_seconds', window_seconds
      ),
      'high'
    );
    
    RETURN FALSE;
  END IF;
  
  -- Log the request
  INSERT INTO public.security_events (
    event_type,
    user_id,
    details,
    severity
  ) VALUES (
    'rate_limit_check',
    auth.uid(),
    jsonb_build_object(
      'rate_limit_key', identifier,
      'current_count', current_count + 1,
      'max_requests', max_requests
    ),
    'low'
  );
  
  RETURN TRUE;
END;
$$;