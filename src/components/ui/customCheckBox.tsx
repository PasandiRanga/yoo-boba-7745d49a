import React from 'react';
import styled from "styled-components";

// Styled Checkbox component with Yooboba gradient
const CustomCheckbox = ({ checked, onChange, className = "", disabled = false }) => {
  return (
    <StyledWrapper>
      <div className="checkbox-container">
        <label className={`ios-checkbox ${className} ${disabled ? 'disabled' : ''}`}>
          <input 
            type="checkbox" 
            checked={checked} 
            onChange={onChange} 
            disabled={disabled}
          />
          <div className="checkbox-wrapper">
            <div className="checkbox-bg" />
            <svg className="checkbox-icon" viewBox="0 0 24 24" fill="none">
              <path className="check-path" d="M4 12L10 18L20 6" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .checkbox-container {
    display: flex;
    background: transparent;
    border-radius: 8px;
  }
  .ios-checkbox {
    --checkbox-size: 24px;
    position: relative;
    display: inline-block;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  
  .ios-checkbox.disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .ios-checkbox input {
    display: none;
  }
  .checkbox-wrapper {
    position: relative;
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    border-radius: 6px;
    transition: transform 0.2s ease;
  }
  .checkbox-bg {
    position: absolute;
    inset: 0;
    border-radius: 6px;
    border: 2px solid #d1d5db;
    background: white;
    transition: all 0.2s ease;
  }
  
  .dark .checkbox-bg {
    background: #1f2937;
    border-color: #374151;
  }
  
  .checkbox-icon {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 80%;
    height: 80%;
    color: white;
    transform: scale(0);
    transition: all 0.2s ease;
  }
  .check-path {
    stroke-dasharray: 40;
    stroke-dashoffset: 40;
    transition: stroke-dashoffset 0.3s ease 0.1s;
  }
  
  /* Checked State with gradient */
  .ios-checkbox input:checked + .checkbox-wrapper .checkbox-bg {
    background: linear-gradient(135deg, #f472b6 0%, #8b5cf6 100%);
    border-color: transparent;
  }
  
  /* For dark mode, make the gradient a bit brighter */
  .dark .ios-checkbox input:checked + .checkbox-wrapper .checkbox-bg {
    background: linear-gradient(135deg, #f472b6 0%, #a78bfa 100%);
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
  }
  
  .ios-checkbox input:checked + .checkbox-wrapper .checkbox-icon {
    transform: scale(1);
  }
  .ios-checkbox input:checked + .checkbox-wrapper .check-path {
    stroke-dashoffset: 0;
  }
  
  /* Hover Effects */
  .ios-checkbox:not(.disabled):hover .checkbox-wrapper {
    transform: scale(1.05);
  }
  
  /* Active Animation */
  .ios-checkbox:not(.disabled):active .checkbox-wrapper {
    transform: scale(0.95);
  }
  
  /* Focus Styles */
  .ios-checkbox input:focus + .checkbox-wrapper .checkbox-bg {
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
  }
  
  .dark .ios-checkbox input:focus + .checkbox-wrapper .checkbox-bg {
    box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.3);
  }
  
  /* Animation */
  @keyframes bounce {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
  .ios-checkbox input:checked + .checkbox-wrapper {
    animation: bounce 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

export default CustomCheckbox;