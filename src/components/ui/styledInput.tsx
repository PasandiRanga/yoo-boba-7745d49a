import React from 'react';
import styled from 'styled-components';

const StyledInput = ({ type = "text", name, id, placeholder, value, onChange, required = false }) => {
  return (
    <StyledWrapper>
      <input 
        type={type} 
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete="off" 
        className="input" 
        placeholder={placeholder} 
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  
  /* Light mode styles */
  .input {
    width: 100%;
    border: none;
    outline: none;
    border-radius: 15px;
    padding: 1em;
    background-color: #f5f5f5;
    box-shadow: inset 2px 5px 10px rgba(0,0,0,0.1);
    transition: 300ms ease-in-out;
    font-size: 16px;
    color: #333;
  }
  
  .input:focus {
    background-color: white;
    transform: scale(1.05);
    box-shadow: 13px 13px 100px #e6e6e6,
               -13px -13px 100px #ffffff;
  }
  
  /* Dark mode styles */
  @media (prefers-color-scheme: dark) {
    .input {
      background-color: #2d2d2d;
      color: white;
      box-shadow: inset 2px 5px 10px rgba(0,0,0,0.3);
    }
    
    .input:focus {
      background-color: #3d3d3d;
      box-shadow: 13px 13px 100px #1a1a1a,
                 -13px -13px 100px #2d2d2d;
    }
  }
`;

export default StyledInput;