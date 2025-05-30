
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
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
  
  // Don't show upload button on order flow pages
  const isOrderFlow = location.pathname.startsWith('/order-flow');

  const handlePhotoUpload = () => {
    navigate('/order-flow');
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        {!isOrderFlow && (
          <Button onClick={handlePhotoUpload} className="bg-green-600 hover:bg-green-700">
            <Upload className="w-4 h-4 mr-2" />
            Fotos hochladen
          </Button>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
