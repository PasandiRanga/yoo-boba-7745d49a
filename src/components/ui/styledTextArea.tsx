import React, { useState } from 'react';

interface StyledTextareaProps {
  name: string;
  id: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

const StyledTextarea: React.FC<StyledTextareaProps> = ({ 
  name, 
  id, 
  placeholder, 
  value: initialValue = "", 
  onChange, 
  required = false,
  disabled = false, 
  rows = 5 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(initialValue);
  
  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChange) onChange(e);
  };
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return (
    <div className="w-full">
      <textarea
        name={name}
        id={id}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        rows={rows}
        placeholder={placeholder}
        className={`
          w-full border-none outline-none rounded-2xl p-4 text-base
          font-inherit resize-vertical transition-all duration-300 ease-in-out
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
      />
    </div>
  );
};

export default StyledTextarea;