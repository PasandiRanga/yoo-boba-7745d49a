// src/components/FloatingBobaPearls.tsx
import { FC } from "react";

interface BobaPearlProps {
  delay?: number;
  size?: 'small' | 'medium' | 'large';
  color?: 'purple' | 'pink';
}

const BobaPearl: FC<BobaPearlProps> = ({ delay = 0, size = 'small', color = 'purple' }) => {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  };
  
  const colorClasses = {
    purple: 'bg-purple-400/30',
    pink: 'bg-pink-400/30'
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
      style={{ 
        animationDelay: `${delay}ms`,
        animationDuration: '3s' // Slower animation
      }}
    />
  );
};

export const FloatingBobaPearls: FC = () => {
  const pearls = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3000, // Longer delay
    size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as 'small' | 'medium' | 'large',
    color: ['purple', 'pink'][Math.floor(Math.random() * 2)] as 'purple' | 'pink',
    duration: 5 + Math.random() * 3 // Slower movement
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {pearls.map((pearl) => (
        <div
          key={pearl.id}
          className="absolute animate-float"
          style={{
            left: `${pearl.left}%`,
            animationDelay: `${pearl.delay}ms`,
            animationDuration: `${pearl.duration}s`
          }}
        >
          <BobaPearl size={pearl.size} color={pearl.color} />
        </div>
      ))}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-10vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};