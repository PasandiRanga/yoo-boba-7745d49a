
import React from "react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner = ({ fullScreen = false }: LoadingSpinnerProps) => {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80' : 'w-full py-12'}`}>
      <div className="loader relative w-[120px] h-[200px] border-[5px] border-black rounded-b-[40px] overflow-hidden bg-white">
        <div className="straw absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-[20px] h-[60px] bg-pink-400 rounded-[10px] z-0"></div>
        <div className="liquid absolute bottom-0 w-full h-0 bg-gradient-to-t from-purple-300 to-pink-200 animate-fillCup z-1"></div>
        <div className="boba absolute bottom-[10px] w-full flex justify-around z-2">
          <span className="w-[14px] h-[14px] bg-[#3e2723] rounded-full animate-rise"></span>
          <span className="w-[14px] h-[14px] bg-[#3e2723] rounded-full animate-riseDelay1"></span>
          <span className="w-[14px] h-[14px] bg-[#3e2723] rounded-full animate-riseDelay2"></span>
        </div>
        <div className="loading-text absolute top-[110%] w-full text-center font-bold text-[1.2rem] text-pink-700">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
