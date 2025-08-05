-- Migrate existing lowercase salutations to capitalized values
UPDATE customer_profiles 
SET salutation = CASE 
  WHEN salutation = 'herr' THEN 'Herr'
  WHEN salutation = 'frau' THEN 'Frau'
  WHEN salutation = 'divers' THEN 'Divers'
  ELSE salutation
END
WHERE salutation IN ('herr', 'frau', 'divers');