'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface FormSubmissionStepProps {
  step: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  error?: string;
}

interface FormSubmissionProgressProps {
  steps: FormSubmissionStepProps[];
  currentStep: number;
  onComplete?: () => void;
}

export function FormSubmissionProgress({
  steps,
  currentStep,
  onComplete
}: FormSubmissionProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const percentage = (currentStep / steps.length) * 100;
    setProgress(percentage);

    if (percentage === 100 && onComplete) {
      onComplete();
    }
  }, [currentStep, steps.length, onComplete]);

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-500">
          Step {currentStep} of {steps.length}
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep - 1;
          const isPending = index > currentStep - 1;
          const isCompleted = index < currentStep - 1;

          return (
            <div
              key={step.step}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-50' : ''
              }`}
            >
              {isPending ? (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
              ) : isActive ? (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              ) : step.status === 'error' ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}

              <div className="flex-1 min-w-0">
                <p className={`font-medium ${
                  isPending ? 'text-gray-500' :
                  isActive ? 'text-blue-700' :
                  step.status === 'error' ? 'text-red-700' :
                  'text-green-700'
                }`}>
                  {step.step}
                </p>

                {step.status === 'error' && step.error && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{step.error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}