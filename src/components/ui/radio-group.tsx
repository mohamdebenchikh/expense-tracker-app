import React from 'react';

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onValueChange) {
        onValueChange(event.target.value);
      }
    };

    // Pass the context to children
    const contextValue = { value, onChange: handleChange };

    return (
      <div 
        className={`space-y-2 ${className || ''}`} 
        ref={ref} 
        role="radiogroup"
        {...props}
      />
    );
  }
);

RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, ...props }, ref) => {
    return (
      <input
        type="radio"
        className={`h-4 w-4 rounded-full border border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 ${className || ''}`}
        value={value}
        ref={ref}
        {...props}
      />
    );
  }
);

RadioGroupItem.displayName = "RadioGroupItem";
