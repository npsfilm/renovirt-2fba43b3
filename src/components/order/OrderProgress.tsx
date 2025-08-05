
import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface OrderProgressProps {
  steps: Step[];
}

const OrderProgress = ({ steps }: OrderProgressProps) => {
  return (
    <div className="w-full bg-card border-0 md:border md:rounded-lg p-3 md:p-6 shadow-sm">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.status === 'completed'
                    ? 'bg-success border-success text-success-foreground shadow-sm'
                    : step.status === 'current'
                    ? 'bg-primary border-primary text-primary-foreground shadow-sm ring-2 ring-primary/20'
                    : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {step.status === 'completed' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.number}</span>
                )}
              </div>
              <span
                className={`mt-2 text-sm transition-colors duration-300 ${
                  step.status === 'current' 
                    ? 'text-primary font-semibold' 
                    : step.status === 'completed'
                    ? 'text-success font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={`h-0.5 transition-all duration-500 ${
                    step.status === 'completed' ? 'bg-success' : 'bg-border'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderProgress;
