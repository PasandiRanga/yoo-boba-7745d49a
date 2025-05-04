
import { useEffect, useRef } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation: string;
  threshold?: number;
  delay?: number;
  className?: string;
}

const ScrollAnimation = ({
  children,
  animation,
  threshold = 0.1,
  delay = 0,
  className = '',
}: ScrollAnimationProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add(animation);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [animation, threshold, delay]);

  return (
    <div 
      ref={elementRef} 
      className={`opacity-0 ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
