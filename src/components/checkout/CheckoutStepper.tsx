import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepperProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-initial">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  isComplete
                    ? 'bg-success text-success-foreground'
                    : isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {isComplete ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:inline ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 sm:mx-3 ${isComplete ? 'bg-success' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutStepper;
