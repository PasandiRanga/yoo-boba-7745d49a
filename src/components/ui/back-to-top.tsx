
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;

  &.visible {
    opacity: 1;
    visibility: visible;
  }

  .button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-image: linear-gradient(135deg, #5B6DF8, #9B87F5, #F870C5);
    border: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 0px 4px rgba(180, 160, 255, 0.253);
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
    position: relative;

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      background-image: linear-gradient(135deg, pink, purple);
    }
  }

  .svgIcon {
    width: 12px;
    transition-duration: 0.3s;
  }

  .svgIcon path {
    fill: white;
  }

  .button:hover {
    width: 140px;
    border-radius: 50px;
    transition-duration: 0.3s;
    align-items: center;
  }

  .button:hover .svgIcon {
    transition-duration: 0.3s;
    transform: translateY(-200%);
  }

  .button::before {
    position: absolute;
    bottom: -20px;
    content: "Back to Top";
    color: white;
    font-size: 0px;
  }

  .button:hover::before {
    font-size: 13px;
    opacity: 1;
    bottom: unset;
    transition-duration: 0.3s;
  }
`;


const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top when button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <StyledWrapper className={isVisible ? 'visible' : ''}>
      <button onClick={scrollToTop} className="button">
        <svg className="svgIcon" viewBox="0 0 384 512">
          <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
        </svg>
      </button>
    </StyledWrapper>
  );
};

export default BackToTopButton;
