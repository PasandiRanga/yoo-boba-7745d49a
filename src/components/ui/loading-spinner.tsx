import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";

interface LoadingSpinnerProps {
  visible?: boolean;
  duration?: number; // Optional fade duration in ms
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  visible = true,
  duration = 500,
}) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (!visible) {
      const timeout = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timeout);
    } else {
      setShow(true);
    }
  }, [visible, duration]);

  if (!show) return null;

  const fadeStyle = {
    opacity: visible ? 1 : 0,
    transition: `opacity ${duration}ms ease-in-out`,
  };

  const bubbles = Array.from({ length: 40 }, (_, i) => {
    const left = Math.random() * 100;
    const size = 8 + Math.random() * 8;
    const delay = Math.random() * 2;
    const duration = 2 + Math.random() * 3;
    const opacity = 0.7 + Math.random() * 0.3;
    return {
      id: i,
      left,
      size,
      delay,
      duration,
      opacity,
    };
  });

  return (
    <div style={{ ...styles.container, ...fadeStyle }}>
      {bubbles.map((b) => (
        <div
          key={b.id}
          style={{
            ...styles.bubble,
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            opacity: b.opacity,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}

      <CenterWrapper>
        <Loader />
        <div style={styles.loadingText}>Loading...</div>
      </CenterWrapper>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const CenterWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const bounce = keyframes`
  0% {
    top: 30px;
    height: 10px;
    border-radius: 50px 50px 25px 25px;
    transform: scaleX(1.7);
  }
  40% {
    height: 25px;
    border-radius: 50%;
    transform: scaleX(1);
  }
  100% {
    top: 0%;
  }
`;

const shadowPulse = keyframes`
  0% {
    transform: scaleX(1.5);
  }
  40% {
    transform: scaleX(1);
    opacity: 0.7;
  }
  100% {
    transform: scaleX(0.2);
    opacity: 0.4;
  }
`;

const StyledWrapper = styled.div`
  .typing-indicator {
    width: 100px;
    height: 60px;
    position: relative;
    z-index: 4;
  }

  .typing-circle {
    width: 25px;
    height: 25px;
    position: absolute;
    border-radius: 50%;
    background-color: #7e22ce;
    left: 25%;
    transform-origin: 50%;
    animation: ${bounce} 0.5s alternate infinite ease;
  }

  .typing-circle:nth-child(2) {
    left: 50%;
    animation-delay: 0.2s;
  }

  .typing-circle:nth-child(3) {
    left: auto;
    right: 0%;
    animation-delay: 0.3s;
  }

  .typing-shadow {
    width: 12px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba(126, 34, 206, 0.2);
    position: absolute;
    top: 50px;
    transform-origin: 50%;
    z-index: 3;
    left: 25%;
    filter: blur(1px);
    animation: ${shadowPulse} 0.5s alternate infinite ease;
  }

  .typing-shadow:nth-child(4) {
    left: 50%;
    animation-delay: 0.2s;
  }

  .typing-shadow:nth-child(5) {
    left: auto;
    right: 0%;
    animation-delay: 0.3s;
  }
`;

const Loader = () => (
  <StyledWrapper>
    <div className="typing-indicator">
      <div className="typing-circle" />
      <div className="typing-circle" />
      <div className="typing-circle" />
      <div className="typing-shadow" />
      <div className="typing-shadow" />
      <div className="typing-shadow" />
    </div>
  </StyledWrapper>
);

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "fixed",
    inset: "0",
    background: "linear-gradient(to bottom, #fbcfe8, #ddd6fe)",
    overflow: "hidden",
    zIndex: 9999,
  },
  bubble: {
    position: "absolute",
    top: "-20px",
    backgroundColor: "#3e2723",
    borderRadius: "50%",
    animationName: "fall",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  loadingText: {
    marginTop: "12px",
    textAlign: "center",
    fontWeight: 600,
    fontSize: "1.125rem", // ~18px
    color: "#ec4899",
  },
};

export default LoadingSpinner;
