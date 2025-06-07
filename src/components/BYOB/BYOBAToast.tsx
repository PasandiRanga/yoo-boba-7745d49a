import React, { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface BobaPearl {
  id: number;
  size: number;
  bottom: number;
  delay: number;
}

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 5000,
  onClose,
  isVisible
}) => {
  const [stage, setStage] = useState(0);
  const [bobaPearls, setBobaPearls] = useState<BobaPearl[]>([]);

  // Generate random boba pearls
  useEffect(() => {
    if (isVisible && type === 'success') {
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
    }
  }, [isVisible, type]);

  // Animation sequence for success toast
  useEffect(() => {
    if (isVisible && type === 'success') {
      if (stage === 0) {
        const timer = setTimeout(() => setStage(1), 500);
        return () => clearTimeout(timer);
      }
      
      if (stage === 1) {
        const timer = setTimeout(() => setStage(2), 2000);
        return () => clearTimeout(timer);
      }
      
      if (stage === 2) {
        const timer = setTimeout(() => {
          onClose();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [stage, onClose, isVisible, type]);

  // Auto-close timer for non-success toasts
  useEffect(() => {
    if (isVisible && duration > 0 && type !== 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose, type]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-white dark:bg-gray-800 shadow-lg';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-white dark:bg-gray-800 shadow-lg';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500 dark:text-green-400';
      case 'error':
        return 'text-red-500 dark:text-red-400';
      case 'info':
        return 'text-blue-500 dark:text-blue-400';
      default:
        return 'text-green-500 dark:text-green-400';
    }
  };

  // Success toast with boba animation
  if (type === 'success') {
    return (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden w-full max-w-md mx-auto animate-in zoom-in-95 duration-300">
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
                                      stage === 1 ? '2000ms' : 
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
            <h3 className="font-bold text-lg mb-1 text-center dark:text-white">
              {stage < 2 ? "🎉 We got your inquiry!" : "Message delivered!"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {stage < 2 
                ? "Our team will reach out to you soon with wholesale pricing and details." 
                : "We'll get back to you with a refreshing response soon!"}
            </p>
            
            {/* Close button - only show after animation completes */}
            {stage === 2 && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-500 dark:text-gray-400"
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Add global keyframe animation for the bouncing pearls */}
        <style>{`
          @keyframes bounce {
            0% { transform: translateY(0); }
            100% { transform: translateY(-4px); }
          }
        `}</style>
      </>
    );
  }

  // Regular toast for error/info types (top-right corner)
  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`
        flex items-center gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm
        min-w-[320px] max-w-[480px]
        ${getToastStyles()}
        transform transition-all duration-300 ease-out
      `}>
        <div className={`flex-shrink-0 ${getIconColor()}`}>
          <CheckCircle size={20} />
        </div>
                
        <div className="flex-1">
          <p className="font-medium text-sm leading-relaxed">
            {message}
          </p>
        </div>
                
        <button
          onClick={onClose}
          className={`
            flex-shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 
            transition-colors duration-200
            ${type === 'error' ? 'text-red-600 dark:text-red-400' :
              'text-blue-600 dark:text-blue-400'}
          `}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Toast Provider Hook
export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
  }>>([]);

  const showToast = (
    message: string, 
    type: 'success' | 'error' | 'info' = 'success', 
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => hideToast(toast.id)}
          isVisible={true}
        />
      ))}
    </>
  );

  return { showToast, ToastContainer };
};

export default Toast;