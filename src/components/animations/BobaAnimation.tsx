
import { useEffect, useState } from 'react';

interface Boba {
  id: number;
  size: number;
  top: number;
  delay: number;
  duration: number;
  color: string;
}

const BobaAnimation = () => {
  const [bobas, setBobas] = useState<Boba[]>([]);
  
  useEffect(() => {
    // Create 15 random boba pearls
    const bobasArray: Boba[] = [];
    const colors = ['#9B87F5', '#F870C5', '#5B6DF8', '#9B87F5', '#D6BCFA'];
    
    for (let i = 0; i < 5; i++) {
      bobasArray.push({
        id: i,
        size: Math.random() * 20 + 10, // Size between 10-30px
        top: Math.random() * 100, // Random vertical position
        delay: Math.random() * 2, // Random delay
        duration: Math.random() * 4 + 3, // Animation duration between 3-7s
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setBobas(bobasArray);
  }, []);

  return (
    <div className="fixed left-0 top-0 h-full w-24 pointer-events-none z-50">
      {bobas.map((boba) => (
        <div
          key={boba.id}
          className="absolute rounded-full animate-float-in-left"
          style={{
            width: `${boba.size}px`,
            height: `${boba.size}px`,
            top: `${boba.top}%`,
            backgroundColor: boba.color,
            animationDelay: `${boba.delay}s`,
            animationDuration: `${boba.duration}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
};

export default BobaAnimation;
