
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show header on order flow pages
  const isOrderFlow = location.pathname.startsWith('/order-flow') || location.pathname === '/order';

  const handlePhotoUpload = () => {
    navigate('/order-flow');
  };

  // Don't render header on order pages
  if (isOrderFlow) {
    return null;
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
