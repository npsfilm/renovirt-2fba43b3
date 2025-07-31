-- RLS Policy für help_interactions überprüfen und anpassen
-- Aktuelle Policy ermöglicht nur das Einfügen wenn user_id = auth.uid() ODER user_id IS NULL
-- Die Edge Function läuft mit Service Role Key, daher brauchen wir eine Policy die das erlaubt

-- Temporär alle Policies für help_interactions anzeigen
SELECT policyname, cmd, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'help_interactions';

-- Policy für Service Role hinzufügen
CREATE POLICY "Service role can manage help interactions"
ON help_interactions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);