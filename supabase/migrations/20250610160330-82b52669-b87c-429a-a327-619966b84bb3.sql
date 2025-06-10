
-- Füge Spalten für Admin-Verwaltung zur referrals Tabelle hinzu
ALTER TABLE referrals 
ADD COLUMN admin_approved BOOLEAN DEFAULT FALSE,
ADD COLUMN admin_approved_by UUID REFERENCES auth.users(id),
ADD COLUMN admin_approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN admin_notes TEXT;

-- Erstelle eine Funktion für manuelle Admin-Freischaltung von Referral-Credits
CREATE OR REPLACE FUNCTION approve_referral_by_admin(
  referral_id_param UUID,
  admin_user_id UUID,
  admin_notes_param TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_referral_record RECORD;
  v_credit_id UUID;
BEGIN
  -- Hole Referral-Datensatz
  SELECT * INTO v_referral_record
  FROM referrals 
  WHERE id = referral_id_param 
  AND admin_approved = FALSE
  AND first_order_id IS NOT NULL; -- Erste Bestellung muss bereits erfolgt sein
  
  IF v_referral_record.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Referral not found or already approved');
  END IF;
  
  -- Prüfe ob Admin-User existiert und Admin-Rolle hat
  IF NOT EXISTS (
    SELECT 1 FROM customer_profiles 
    WHERE user_id = admin_user_id AND app_role = 'admin'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;
  
  -- Aktualisiere Referral-Datensatz
  UPDATE referrals 
  SET 
    admin_approved = TRUE,
    admin_approved_by = admin_user_id,
    admin_approved_at = now(),
    admin_notes = admin_notes_param,
    credits_approved_at = now()
  WHERE id = referral_id_param;
  
  -- Gewähre Credits an den Werber
  INSERT INTO user_credits (
    user_id,
    credit_type,
    amount,
    source,
    source_id,
    status
  ) VALUES (
    v_referral_record.referrer_id,
    'free_images',
    v_referral_record.reward_amount,
    'referral_reward',
    v_referral_record.id,
    'approved'
  ) RETURNING id INTO v_credit_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'referrer_id', v_referral_record.referrer_id,
    'credits_granted', v_referral_record.reward_amount,
    'credit_id', v_credit_id
  );
END;
$$;

-- Modifiziere die bestehende approve_referral_credits Funktion um nur noch zu tracken
CREATE OR REPLACE FUNCTION approve_referral_credits(order_id_param uuid, user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_referral_record RECORD;
BEGIN
  -- Prüfe ob dies die erste bezahlte Bestellung des Users ist
  IF NOT EXISTS (
    SELECT 1 FROM orders 
    WHERE user_id = user_id_param 
    AND payment_status = 'paid' 
    AND id = order_id_param
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found or not paid');
  END IF;
  
  -- Finde Referral-Datensatz für diesen User wo erste Bestellung noch nicht gesetzt ist
  SELECT * INTO v_referral_record
  FROM referrals 
  WHERE referred_user_id = user_id_param 
  AND first_order_id IS NULL;
  
  IF v_referral_record.id IS NULL THEN
    -- Keine ausstehende Empfehlung gefunden, das ist normal für nicht-empfohlene User
    RETURN jsonb_build_object('success', true, 'message', 'No pending referral');
  END IF;
  
  -- Aktualisiere Referral-Datensatz nur mit first_order_id (KEINE automatischen Credits mehr)
  UPDATE referrals 
  SET first_order_id = order_id_param
  WHERE id = v_referral_record.id;
  
  RETURN jsonb_build_object(
    'success', true,
    'referrer_id', v_referral_record.referrer_id,
    'message', 'Referral tracked, awaiting admin approval'
  );
END;
$$;

-- Erstelle View für Admin-Übersicht
CREATE OR REPLACE VIEW admin_referrals_view AS
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
  -- Werber Information
  cp_referrer.first_name || ' ' || cp_referrer.last_name AS referrer_name,
  cp_referrer.user_id AS referrer_user_id,
  -- Geworbener Kunde Information
  cp_referred.first_name || ' ' || cp_referred.last_name AS referred_name,
  cp_referred.user_id AS referred_user_id,
  -- Admin Information
  cp_admin.first_name || ' ' || cp_admin.last_name AS admin_name
FROM referrals r
LEFT JOIN customer_profiles cp_referrer ON r.referrer_id = cp_referrer.user_id
LEFT JOIN customer_profiles cp_referred ON r.referred_user_id = cp_referred.user_id
LEFT JOIN customer_profiles cp_admin ON r.admin_approved_by = cp_admin.user_id
ORDER BY r.created_at DESC;
