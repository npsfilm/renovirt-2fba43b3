import React from 'react';
import { Upload } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigationGuard } from '@/contexts/NavigationGuardContext';

const MobileUploadCTA: React.FC = () => {
  const isMobile = useIsMobile();
  const { navigate } = useNavigationGuard();

  if (!isMobile) return null;

  return (
    <button
      type="button"
      aria-label="Hochladen"
      onClick={() => navigate('/order')}
      className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 h-14 w-14 rounded-full bg-primary text-foreground shadow-lg border border-border hover:opacity-95 active:scale-95 transition-transform"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Upload className="h-6 w-6" />
    </button>
  );
};

export default MobileUploadCTA;
