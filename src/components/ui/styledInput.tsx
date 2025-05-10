import React, { useState } from 'react';

const StyledInput = ({ 
  type = "text", 
  name, 
  id, 
  placeholder, 
  value: initialValue = "", 
  onChange, 
  required = false 
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
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        autoComplete="off"
        placeholder={placeholder}
        className={`
          w-full border-none outline-none rounded-2xl p-2.5 text-base
          transition-all duration-300 ease-in-out
          ${isFocused ? 'transform scale-105' : ''}
          
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

export default StyledInput;