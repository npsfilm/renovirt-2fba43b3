import React from 'react';

interface OrderProgressBarProps {
  currentStep: 'photo-type' | 'upload' | 'package' | 'extras' | 'summary' | 'confirmation';
}

const OrderProgressBar = ({ currentStep }: OrderProgressBarProps) => {
  const getProgressPercentage = () => {
    switch (currentStep) {
      case 'photo-type':
        return 20;
      case 'upload':
        return 40;
      case 'package':
        return 60;
      case 'extras':
        return 80;
      case 'summary':
        return 100;
      case 'confirmation':
        return 100;
      default:
        return 0;
    }
  };

  const progressPercentage = getProgressPercentage();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
      <div 
        className="h-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};

export default OrderProgressBar;