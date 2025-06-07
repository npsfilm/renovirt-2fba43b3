
import { supabase } from '@/integrations/supabase/client';

// This utility updates package names to be consistent
export const updatePackageNames = async () => {
  // Update Basic package
  await supabase
    .from('packages')
    .update({ 
      name: 'basic',
      description: 'Basic HDR'
    })
    .eq('name', 'basic');

  // Update Premium package  
  await supabase
    .from('packages')
    .update({ 
      name: 'premium',
      description: 'Premium HDR & Retusche'
    })
    .eq('name', 'premium');
};
