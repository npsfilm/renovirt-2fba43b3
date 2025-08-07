-- Update niko@renovirt.de to admin role
UPDATE customer_profiles 
SET app_role = 'admin', updated_at = now()
WHERE user_id = 'dbdbe5a3-1b2c-47d8-89c1-d13edeb087a5';

-- Log the role change in audit table
INSERT INTO role_change_audit (
  target_user_id, 
  changed_by, 
  old_role, 
  new_role, 
  change_reason
) VALUES (
  'dbdbe5a3-1b2c-47d8-89c1-d13edeb087a5',
  'dbdbe5a3-1b2c-47d8-89c1-d13edeb087a5', -- Self-promotion for initial setup
  'client',
  'admin',
  'Initial admin setup for system administration'
);