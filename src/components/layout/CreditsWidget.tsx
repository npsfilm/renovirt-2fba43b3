
import React from 'react';
import { Gift } from 'lucide-react';
import { useUserCredits } from '@/hooks/useUserCredits';

const CreditsWidget = () => {
  const { credits, isLoading } = useUserCredits();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
        <Gift className="w-4 h-4" />
        <div className="w-8 h-3 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (credits <= 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg">
      <Gift className="w-4 h-4" />
      <span className="font-medium">{credits} Credits</span>
    </div>
  );
};

export default CreditsWidget;
