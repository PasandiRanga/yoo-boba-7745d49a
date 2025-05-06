import React from "react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner = ({ fullScreen = false }: LoadingSpinnerProps) => {
  // Generate random positions for boba bubbles
  const generateBubblePositions = (count: number) => {
    return Array.from({ length: count }, () => ({
      left: `${10 + Math.random() * 80}%`,
      bottom: `${5 + Math.random() * 15}px`,
      size: `${8 + Math.random() * 6}px`,
      delay: Math.random() * 0.5,
      opacity: 0.7 + Math.random() * 0.3
    }));
  };

  const bubbles = generateBubblePositions(24);

  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80' : 'w-full py-12'}`}>
      <div className="relative w-[150px] h-[250px]"> {/* Increased height to accommodate longer straw */}
        {/* Cup */}
        <div className="loader relative w-full h-full border-[6px] border-gray-300 rounded-b-[50px] overflow-hidden bg-white shadow-lg">
          {/* Cup highlight */}
          <div className="absolute top-2 right-2 w-[40px] h-[20px] bg-white/50 rounded-full blur-[2px]"></div>
          
          {/* Liquid */}
          <div className="liquid absolute bottom-0 w-full h-0 bg-gradient-to-t from-purple-400/90 via-pink-300/90 to-amber-100/90 animate-fillCup z-1"></div>
          
          {/* Randomly positioned boba pearls */}
          <div className="boba absolute bottom-0 w-full h-[60px] z-2">
            {bubbles.map((bubble, i) => (
              <span 
                key={i}
                className={`absolute bg-[#3e2723] rounded-full ${
                  i % 4 === 0 ? 'animate-rise' : 
                  i % 4 === 1 ? 'animate-riseDelay1' : 
                  i % 4 === 2 ? 'animate-riseDelay2' : 'animate-riseDelay3'
                }`}
                style={{
                  left: bubble.left,
                  bottom: bubble.bottom,
                  width: bubble.size,
                  height: bubble.size,
                  opacity: bubble.opacity,
                  animationDelay: `${bubble.delay}s`
                }}
              ></span>
            ))}
          </div>
          
          {/* Cup lid */}
          <div className="absolute top-0 w-full h-[20px] bg-gray-100 rounded-t-[10px] border-b-2 border-gray-200">
            {/* Straw hole in lid */}
            <div className="absolute top-[-2px] left-1/2 transform -translate-x-1/2 w-[18px] h-[18px] bg-gray-100 rounded-full border-2 border-gray-200"></div>
          </div>
          
          {/* Lid details */}
          <div className="absolute top-[8px] left-1/2 transform -translate-x-1/2 w-[80%] h-[6px] bg-gray-300 rounded-full"></div>
          <div className="absolute top-[10px] left-1/2 transform -translate-x-1/2 w-[60%] h-[4px] bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Straw - much longer and more natural looking */}
        <div className="straw absolute top-[-40px] left-1/2 transform -translate-x-1/2 w-[14px] h-[180px] z-10">
          <div className="relative w-full h-full">
            {/* Straw main part - goes deep into the cup */}
            <div className="absolute w-full h-full bg-gradient-to-b from-pink-300 to-pink-500 rounded-[6px]"></div>
            
            {/* Visible part inside the liquid */}
            <div className="absolute top-[80px] w-full h-[150px] bg-gradient-to-b from-pink-300/90 to-pink-500/90 rounded-[6px] z-20"></div>
            
            {/* Straw bend - more gradual curve */}
            
            {/* Straw highlight */}
            <div className="absolute top-[10px] left-[2px] w-[10px] h-[160px] bg-white/30 rounded-[4px]"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="absolute top-[110%] w-full text-center font-bold text-[1.2rem] text-pink-700 dark:text-pink-400">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;