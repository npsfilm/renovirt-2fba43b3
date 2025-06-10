
-- Entferne die unsichere SECURITY DEFINER View
DROP VIEW IF EXISTS public.admin_referrals_view;

-- Erstelle eine sichere RPC-Funktion für Admin-Referral-Daten
CREATE OR REPLACE FUNCTION public.get_admin_referrals()
RETURNS TABLE(
  id UUID,
  referral_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  first_order_id UUID,
  admin_approved BOOLEAN,
  admin_approved_at TIMESTAMP WITH TIME ZONE,
  admin_approved_by UUID,
  admin_notes TEXT,
  reward_amount INTEGER,
  referrer_name TEXT,
  referrer_user_id UUID,
  referred_name TEXT,
  referred_user_id UUID,
  admin_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Prüfe Admin-Berechtigung
  IF NOT EXISTS (
    SELECT 1 FROM customer_profiles 
    WHERE user_id = auth.uid() AND app_role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  RETURN QUERY
  SELECT 
    r.id,
    r.referral_code,
    r.created_at,
    r.first_order_id,
    r.admin_approved,
    r.admin_approved_at,
    r.admin_approved_by,
    r.admin_notes,
    r.reward_amount,
    COALESCE(referrer_profile.first_name || ' ' || referrer_profile.last_name, 'Unbekannt') as referrer_name,
    r.referrer_id as referrer_user_id,
    COALESCE(referred_profile.first_name || ' ' || referred_profile.last_name, 'Unbekannt') as referred_name,
    r.referred_user_id,
    COALESCE(admin_profile.first_name || ' ' || admin_profile.last_name, NULL) as admin_name
  FROM referrals r
  LEFT JOIN customer_profiles referrer_profile ON r.referrer_id = referrer_profile.user_id
  LEFT JOIN customer_profiles referred_profile ON r.referred_user_id = referred_profile.user_id
  LEFT JOIN customer_profiles admin_profile ON r.admin_approved_by = admin_profile.user_id
  ORDER BY r.created_at DESC;
END;
$$;
