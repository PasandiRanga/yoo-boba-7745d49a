import { useState, useEffect } from "react";

interface BobaPearl {
  id: number;
  size: number;
  bottom: number;
  delay: number;
}

interface BobaSendingToastProps {
  onComplete?: () => void;
}

const BobaSendingToast = ({ onComplete }: BobaSendingToastProps) => {
  const [stage, setStage] = useState(0);
  const [bobaPearls, setBobaPearls] = useState<BobaPearl[]>([]);
  
  // Generate random boba pearls
  useEffect(() => {
    const pearls: BobaPearl[] = [];
    for (let i = 0; i < 12; i++) {
      pearls.push({
        id: i,
        size: Math.random() * 4 + 5, // 5-9px pearls
        bottom: Math.random() * 14 + 3, // Vertical position in cup
        delay: Math.random() * 0.4, // 0-0.4s delay for bouncing
      });
    }
    setBobaPearls(pearls);
  }, []);

  // Animation sequence
  useEffect(() => {
    if (stage === 0) {
      const timer = setTimeout(() => setStage(1), 500);
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
    <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden w-full max-w-md mx-auto">
      {/* Animation container */}
      <div className="relative h-32 w-full mb-4 overflow-hidden">
        {/* The surface */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-300 dark:bg-gray-600"></div>
        
        {/* Envelope pushing boba cup */}
        <div 
          className="absolute bottom-2 transition-all duration-1000 ease-in-out flex items-end gap-1"
          style={{
            left: stage === 0 ? '0%' : 
                  stage === 1 ? '50%' : 
                  '100%',
            transform: stage === 1 ? 'translateX(-50%)' : 'translateX(0)',
            transitionDuration: stage === 0 ? '1000ms' : 
                                stage === 1 ? '3000ms' : 
                                '1000ms'
          }}
        >
          {/* Envelope (pushing) */}
          <div className="relative h-16 w-20 mr-2">
            {/* Envelope body */}
            <div className="absolute bottom-0 h-12 w-20 bg-gradient-to-r from-pink-200 to-pink-300 dark:from-pink-600 dark:to-pink-500 rounded-md shadow-md">
              {/* Envelope flap */}
              <div className="absolute -top-4 left-0 w-0 h-0 border-l-10 border-r-10 border-b-8 border-l-transparent border-r-transparent border-b-pink-300 dark:border-b-pink-500"></div>
              
              {/* Envelope lines */}
              <div className="absolute top-3 left-2 right-2 h-1 bg-blue-400 dark:bg-blue-600"></div>
              <div className="absolute top-6 left-2 right-2 h-1 bg-blue-400 dark:bg-blue-600"></div>
              <div className="absolute top-9 left-2 right-6 h-1 bg-blue-400 dark:bg-blue-600"></div>
            </div>
          </div>
          
          {/* Boba cup */}
          <div className="relative h-24 w-20">
            {/* Cup body */}
            <div className="absolute bottom-0 h-20 w-20 bg-gradient-to-b from-purple-100 to-purple-200 dark:from-purple-600 dark:to-purple-500 rounded-t-xl rounded-b-lg overflow-hidden">
              {/* Cup contents (tea) */}
              <div className="absolute top-4 left-1 right-1 bottom-1 bg-amber-300 dark:bg-amber-600 rounded-lg overflow-hidden">
                {/* Boba pearls in cup */}
                {bobaPearls.map(pearl => (
                  <div 
                    key={pearl.id}
                    className="absolute rounded-full bg-gray-800 dark:bg-gray-900"
                    style={{
                      width: `${pearl.size}px`,
                      height: `${pearl.size}px`,
                      bottom: `${pearl.bottom}px`,
                      left: `${(pearl.id % 4) * 4 + 2}px`,
                      right: pearl.id >= 4 ? `${((pearl.id - 4) % 4) * 4 + 2}px` : 'auto',
                      animation: stage === 1 ? `bounce 0.6s ease-in-out ${pearl.delay}s infinite alternate` : 'none'
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Cup dome lid */}
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-pink-300 to-pink-400 dark:from-pink-700 dark:to-pink-600 rounded-t-xl"></div>
              
              {/* Straw */}
              <div className="absolute top-0 left-1/2 w-3 h-24 bg-gradient-to-r from-pink-400 to-pink-500 dark:from-pink-600 dark:to-pink-700 rounded-full transform -translate-x-1/2 -translate-y-4 z-10"></div>
              
              {/* Cup shine effect */}
              <div className="absolute top-4 left-2 w-2 h-14 bg-white dark:bg-gray-300 rounded-full opacity-20"></div>
              
              {/* Cup branding/logo */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-white dark:bg-gray-300 rounded-md opacity-10"></div>
            </div>
            
            {/* Cup base/bottom */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-purple-300 dark:bg-purple-800 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Text content */}
      <h3 className="font-bold text-lg mb-1 text-center">
        {stage < 2 ? "Delivering your message..." : "Message delivered!"}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center">
        {stage < 2 
          ? "Your sweet message is on its way..." 
          : "We'll get back to you with a refreshing response soon!"}
      </p>
      
      {/* Add global keyframe animation for the bouncing pearls */}
      <style>{`
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default BobaSendingToast;