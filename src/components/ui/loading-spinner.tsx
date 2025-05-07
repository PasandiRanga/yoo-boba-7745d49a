import React from "react";
import styled from "styled-components";

const LoadingSpinner: React.FC = () => {
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
    <div style={styles.container}>
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

const Loader = () => {
  return (
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
};

const StyledWrapper = styled.div`
  .typing-indicator {
    width: 150px;
    height:100px;
    position: relative;
    z-index: 4;
  }

  .typing-circle {
    width: 18px;
    height: 18px;
    position: absolute;
    border-radius: 50%;
    background-color: #7e22ce; /* Purple */
    left: 15%;
    transform-origin: 50%;
    animation: typing-circle7124 0.5s alternate infinite ease;
  }

  @keyframes typing-circle7124 {
    0% {
      top: 30px;
      height: 10px;
      border-radius: 50px 50px 25px 25px;
      transform: scaleX(1.7);
    }
    40% {
      height: 16px;
      border-radius: 50%;
      transform: scaleX(1);
    }
    100% {
      top: 0%;
    }
  }

  .typing-circle:nth-child(2) {
    left: 45%;
    animation-delay: 0.2s;
  }

  .typing-circle:nth-child(3) {
    left: auto;
    right: 15%;
    animation-delay: 0.3s;
  }

  .typing-shadow {
    width: 10px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba(126, 34, 206, 0.2); /* Purple shadow */
    position: absolute;
    top: 50px;
    transform-origin: 50%;
    z-index: 3;
    left: 15%;
    filter: blur(1px);
    animation: typing-shadow046 0.5s alternate infinite ease;
  }

  @keyframes typing-shadow046 {
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
  }

  .typing-shadow:nth-child(4) {
    left: 45%;
    animation-delay: 0.2s;
  }

  .typing-shadow:nth-child(5) {
    left: auto;
    right: 15%;
    animation-delay: 0.3s;
  }
`;

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
    marginTop: "2px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#ec4899", // Tailwind's pink-500
  },
};

export default LoadingSpinner;
