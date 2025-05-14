import styled from "styled-components";
import React from 'react';

// Flip Checkbox component for quantity controls
const FlipCheckboxWrapper = styled.div`
  .checkbox-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 0;
  }
  .checkbox {
    display: none;
  }
  .checkbox-label {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }
  .checkbox-flip {
    width: 28px;
    height: 28px;
    perspective: 1000px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: transform 0.4s ease;
  }
  .checkbox-front,
  .checkbox-back {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    backface-visibility: hidden;
    transition: transform 0.3s ease;
  }
  .checkbox-front {
    background: transparent;
    border: 2px solid #f472b6;
    color: #f472b6;
    transform: rotateY(0deg);
  }
  .checkbox-back {
    background: transparent;
    border: 2px solid #8b5cf6;
    color: #8b5cf6;
    transform: rotateY(180deg);
  }
  
  /* Dark mode adjustments */
  .dark .checkbox-front {
    border-color: #f472b6;
    color: #f472b6;
    box-shadow: 0 0 5px rgba(244, 114, 182, 0.3);
  }
  
  .dark .checkbox-back {
    border-color: #a78bfa;
    color: #a78bfa;
    box-shadow: 0 0 5px rgba(167, 139, 250, 0.3);
  }
  
  .checkbox-wrapper:hover .checkbox-flip {
    transform: scale(1.1);
    transition: transform 0.4s ease-out;
  }
  .checkbox:checked + .checkbox-label .checkbox-front {
    transform: rotateY(180deg);
  }
  .checkbox:checked + .checkbox-label .checkbox-back {
    transform: rotateY(0deg);
  }
  .checkbox:focus + .checkbox-label .checkbox-flip {
    box-shadow:
      0 0 15px rgba(139, 92, 246, 0.7),
      0 0 20px rgba(167, 139, 250, 0.4);
    transition: box-shadow 0.3s ease;
  }
  .icon-path {
    stroke: currentColor;
    stroke-width: 2;
    fill: currentColor;
  }
  
  /* Make the FlipCheckbox elements disabled when item is not selected */
  &.disabled .checkbox-front,
  &.disabled .checkbox-back {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #d1d5db;
    color: #d1d5db;
  }
  
  .dark&.disabled .checkbox-front,
  .dark&.disabled .checkbox-back {
    border-color: #4b5563;
    color: #4b5563;
    box-shadow: none;
  }
  
  &.disabled .checkbox-wrapper:hover .checkbox-flip {
    transform: none;
  }
`;

// The Increment and Decrement controllers combined in one component
const QuantityController = ({ 
  checked, 
  onChange, 
  isIncrement = false, 
  disabled = false
}) => {
  // Generate a unique ID for the checkbox
  const checkboxId = `checkbox-${isIncrement ? 'plus' : 'minus'}-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <FlipCheckboxWrapper className={disabled ? "disabled" : ""}>
      <div className="checkbox-container">
        <div className="checkbox-wrapper">
          <input 
            className="checkbox" 
            id={checkboxId} 
            type="checkbox" 
            checked={checked} 
            onChange={onChange}
            disabled={disabled}
          />
          <label className="checkbox-label" htmlFor={checkboxId}>
            <div className="checkbox-flip">
              <div className="checkbox-front">
                <svg 
                  fill="currentColor" 
                  height={10} 
                  width={10} 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isIncrement ? (
                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" className="icon-path" />
                  ) : (
                    <path d="M19 13H5V11H19V13Z" className="icon-path" />
                  )}
                </svg>
              </div>
              <div className="checkbox-back">
                <svg 
                  fill="currentColor" 
                  height={10} 
                  width={10} 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isIncrement ? (
                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" className="icon-path" />
                  ) : (
                    <path d="M19 13H5V11H19V13Z" className="icon-path" />
                  )}
                </svg>
              </div>
            </div>
          </label>
        </div>
      </div>
    </FlipCheckboxWrapper>
  );
};

// Export individual components for flexibility
export const DecrementController = (props) => (
  <QuantityController {...props} isIncrement={false} />
);

export const IncrementController = (props) => (
  <QuantityController {...props} isIncrement={true} />
);

// Also export the styled wrapper for advanced customization
export { FlipCheckboxWrapper };

export default QuantityController;