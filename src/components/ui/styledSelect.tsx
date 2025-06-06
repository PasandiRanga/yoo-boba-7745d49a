import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StyledSelectProps {
  name: string;
  id: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const StyledSelect: React.FC<StyledSelectProps> = ({
  name,
  id,
  placeholder,
  value,
  onValueChange,
  required = false,
  disabled = false,
  children
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return (
    <div className="w-full">
      <Select 
        name={name}
        value={value}
        onValueChange={onValueChange}
        required={required}
        disabled={disabled}
        onOpenChange={(open) => {
          if (open) {
            handleFocus();
          } else {
            handleBlur();
          }
        }}
      >
        <SelectTrigger 
          id={id}
          className={`
            w-full border-none outline-none rounded-2xl p-2.5 text-base h-auto
            transition-all duration-300 ease-in-out focus:ring-0 focus:ring-offset-0
            ${isFocused ? 'transform scale-105' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            
            /* Light mode */
            bg-white text-gray-700
            ${isFocused 
              ? 'shadow-lg' 
              : 'shadow-inner shadow-gray-200 bg-gray-100'}
            
            /* Dark mode */
            dark:text-white
            ${isFocused 
              ? 'dark:bg-gray-700 dark:shadow-gray-900' 
              : 'dark:bg-gray-800 dark:shadow-gray-900'}
          `}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
          {children}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StyledSelect;