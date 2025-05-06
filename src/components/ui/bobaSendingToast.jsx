import { useState, useEffect } from "react";

const BobaSendingToast = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [bobaPearls, setBobaPearls] = useState([]);
  
  // Generate random boba pearls
  useEffect(() => {
    const pearls = [];
    for (let i = 0; i < 8; i++) {
      pearls.push({
        id: i,
        size: Math.random() * 10 + 8, // 8-18px
        left: Math.random() * 60 + 20, // 20-80%
        delay: Math.random() * 0.5, // 0-0.5s delay
        duration: 0.8 + Math.random() * 1.2, // 0.8-2s duration
      });
    }
    setBobaPearls(pearls);
  }, []);

  // Animation sequence
  useEffect(() => {
    if (stage === 0) {
      const timer = setTimeout(() => setStage(1), 1000);
      return () => clearTimeout(timer);
    }
    
    if (stage === 1) {
      const timer = setTimeout(() => setStage(2), 3000);
      return () => clearTimeout(timer);
    }
    
    if (stage === 2) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden">
      <div className="flex flex-col items-center">
      
        {/* Envelope and bubble tea animation container */}
        <div className="relative h-24 w-full mb-4">
          {/* Envelope */}
          <div 
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-in-out ${
              stage === 0 
                ? "translate-y-0" 
                : stage === 1 
                  ? "translate-y-16" 
                  : "translate-y-4 opacity-0"
            }`}
          >
            <div className="h-16 w-20 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-600 dark:to-pink-500 rounded-md relative">
              <div className="absolute top-0 left-0 h-0 w-0 border-l-[40px] border-r-[40px] border-t-[30px] border-l-transparent border-r-transparent border-t-purple-400 dark:border-t-purple-700"></div>
            </div>
          </div>
          
          {/* Bubble tea */}
          <div 
            className={`absolute top-6 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-in-out ${
              stage === 0 
                ? "-translate-y-24" 
                : stage === 1 
                  ? "translate-y-0" 
                  : "translate-y-16 scale-75 opacity-0"
            }`}
          >
            <div className="relative">
              {/* Cup */}
              <div className="h-16 w-12 bg-gradient-to-b from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-b-lg relative overflow-hidden">
                {/* Boba pearls */}
                {bobaPearls.map(pearl => (
                  <div 
                    key={pearl.id}
                    className="absolute bottom-0 rounded-full bg-gray-800 dark:bg-gray-900"
                    style={{
                      width: `${pearl.size}px`,
                      height: `${pearl.size}px`,
                      left: `${pearl.left}%`,
                      animation: stage === 1 ? `floatUp ${pearl.duration}s ease-in ${pearl.delay}s forwards` : 'none'
                    }}
                  ></div>
                ))}
                
                {/* Tea */}
                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-b from-amber-300 to-amber-400 dark:from-amber-600 dark:to-amber-700 rounded-b-lg"></div>
              </div>
              
              {/* Lid */}
              <div className="h-3 w-14 bg-purple-400 dark:bg-purple-700 rounded-t-md relative -top-1 left-1/2 transform -translate-x-1/2"></div>
              
              {/* Straw */}
              <div className="absolute h-20 w-3 bg-gradient-to-b from-pink-400 to-pink-500 dark:from-pink-600 dark:to-pink-700 rounded-full -top-10 left-1/2 transform -translate-x-1/2 -rotate-12"></div>
            </div>
          </div>
        </div>
        
        {/* Text content */}
        <h3 className="font-bold text-lg mb-1 text-center">
          {stage < 2 ? "Sending your message..." : "Message sent!"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          {stage < 2 
            ? "Adding some boba pearls for extra sweetness..." 
            : "We'll get back to you with a refreshing response soon!"}
        </p>
      </div>
      
      {/* Add global keyframe animation for the pearls */}
      <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-40px); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default BobaSendingToast;