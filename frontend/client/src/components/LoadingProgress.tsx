import { useEffect, useState } from "react";
import { Loader2, Database, Brain, Sparkles } from "lucide-react";

interface LoadingProgressProps {
  isLoading: boolean;
}

export function LoadingProgress({ isLoading }: LoadingProgressProps) {
  const [step, setStep] = useState(0);
  
  const steps = [
    { icon: Database, label: "Searching databases...", duration: 3000 },
    { icon: Brain, label: "Analyzing context...", duration: 3000 },
    { icon: Sparkles, label: "Generating answer...", duration: 4000 },
  ];
  
  useEffect(() => {
    if (!isLoading) {
      setStep(0);
      return;
    }
    
    // Progress through steps
    const timers: NodeJS.Timeout[] = [];
    let currentTime = 0;
    
    steps.forEach((stepInfo, index) => {
      const timer = setTimeout(() => {
        setStep(index);
      }, currentTime);
      timers.push(timer);
      currentTime += stepInfo.duration;
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isLoading]);
  
  if (!isLoading) return null;
  
  const CurrentIcon = steps[step]?.icon || Loader2;
  const currentLabel = steps[step]?.label || "Processing...";
  
  return (
    <div className="flex items-center gap-3 text-gray-600 py-4">
      <CurrentIcon className="w-5 h-5 animate-spin" />
      <div className="flex-1">
        <div className="text-sm font-medium">{currentLabel}</div>
        <div className="flex gap-1 mt-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= step ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

