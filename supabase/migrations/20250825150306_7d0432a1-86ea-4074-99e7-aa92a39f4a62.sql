-- Ensure allowlisted admin has admin role in customer_profiles
DO $$ 
DECLARE 
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'niko@renovirt.de' LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No user found for niko@renovirt.de';
  ELSE
    IF EXISTS (SELECT 1 FROM public.customer_profiles WHERE user_id = v_user_id) THEN
      UPDATE public.customer_profiles
      SET app_role = 'admin', role = 'admin', updated_at = now()
      WHERE user_id = v_user_id;
    ELSE
      INSERT INTO public.customer_profiles (user_id, role, app_role, first_name, last_name)
      VALUES (v_user_id, 'admin', 'admin', 'Admin', 'User');
    END IF;
  END IF;
END $$;