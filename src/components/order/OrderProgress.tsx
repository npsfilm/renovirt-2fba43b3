
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
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step.status === 'completed'
                    ? 'bg-green-600 border-green-600 text-white'
                    : step.status === 'current'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
              >
                {step.status === 'completed' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <span
                className={`mt-2 text-sm ${
                  step.status === 'current' ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={`h-0.5 ${
                    step.status === 'completed' ? 'bg-green-600' : 'bg-gray-300'
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
