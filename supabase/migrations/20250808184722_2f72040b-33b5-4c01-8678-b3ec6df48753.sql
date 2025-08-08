-- Fix search_path security gaps in database functions
-- This prevents potential SQL injection vulnerabilities by ensuring functions operate in the correct schema

-- Fix generate_referral_code function
CREATE OR REPLACE FUNCTION public.generate_referral_code(user_uuid uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    v_code := upper(substring(md5(random()::text || user_uuid::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = v_code) INTO v_exists;
    
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$function$;

-- Fix create_user_referral_code function
CREATE OR REPLACE FUNCTION public.create_user_referral_code(user_uuid uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_code TEXT;
  v_existing_code TEXT;
BEGIN
  -- Check if user already has an active referral code
  SELECT code INTO v_existing_code 
  FROM referral_codes 
  WHERE user_id = user_uuid AND is_active = true
  LIMIT 1;
  
  IF v_existing_code IS NOT NULL THEN
    RETURN v_existing_code;
  END IF;
  
  -- Generate new code
  v_code := generate_referral_code(user_uuid);
  
  -- Insert new referral code
  INSERT INTO referral_codes (user_id, code)
  VALUES (user_uuid, v_code);
  
  RETURN v_code;
END;
$function$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  -- Hole die Rolle aus den Meta-Daten
  user_role := NEW.raw_user_meta_data->>'role';
  
  -- Füge nur in profiles ein, wenn die Rolle erlaubt ist (nicht 'customer')
  -- Kunden werden separat in customer_profiles über die Anwendung eingefügt
  IF user_role IN ('makler', 'architekt', 'fotograf', 'projektentwickler', 'investor') THEN
    INSERT INTO public.profiles (id, first_name, last_name, role)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      user_role
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix handle_new_customer_profile function
CREATE OR REPLACE FUNCTION public.handle_new_customer_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_code TEXT;
BEGIN
  -- Generate a referral code for the new user
  v_code := generate_referral_code(NEW.user_id);
  
  -- Insert the referral code
  INSERT INTO referral_codes (user_id, code, is_active)
  VALUES (NEW.user_id, v_code, true);
  
  RETURN NEW;
END;
$function$;