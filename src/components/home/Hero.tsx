import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ScrollAnimation from "@/components/animations/ScrollAnimations";
import FloatingBubbles from "@/components/animations/floatingBubbles";
import BlurText from "@/components/ui/BlurText";
// Import the slide animations CSS
import "@/styles/slideAnimations.css";
import "@/styles/hero.css";

const Hero = ({ user }) => {
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Array of image paths
  const images = [
    "/images/choco.png",
    "/images/black.png",
    "/images/pink.png"
  ];
  
  // Use throttling to detect when scrolling stops
  useEffect(() => {
    let scrollTimeout;
    
    // Function to handle scroll events
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      setScrollPosition(currentScrollPosition);
      setIsScrolling(true);
      
      if (!imageRef.current) return;
      
      // Calculate zoom factor based on scroll position
      const maxZoom = 100; // Maximum zoom level
      const scrollThreshold = 90; // How much scroll before reaching max zoom
      const zoomFactor = Math.min(1 + (currentScrollPosition / scrollThreshold) * 0.10, maxZoom);
      
      // Calculate the upward movement based on scroll
      const moveUpFactor = currentScrollPosition * 0.4; // Adjust for desired speed
      
      // Apply transform to the image
      imageRef.current.style.transform = `scale(${zoomFactor}) translateY(-${moveUpFactor}px)`;
      imageRef.current.style.transition = "transform 0.2s ease-out";
      
      // Clear any existing timeout
      clearTimeout(scrollTimeout);
      
      // Set a timeout to determine when scrolling has stopped
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Adjust this value to determine how quickly it detects scroll stop
    };

    // Initial call to set starting position
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);


  // Effect for smooth image rotation when not scrolling
  useEffect(() => {
    let rotationInterval;
    
    if (!isScrolling && !isTransitioning) {
      // Only start rotating images when not scrolling and not in transition
      rotationInterval = setInterval(() => {
        // Set the next image to show
        const nextIndex = (currentImageIndex + 1) % images.length;
        
        // First prepare the next image in position (off-screen to the right)
        setNextImageIndex(nextIndex);
        
        // After a small delay, start the transition animation
        setTimeout(() => {
          setIsTransitioning(true);
          
          // After the slide transition animation completes, update the current index
          setTimeout(() => {
            setCurrentImageIndex(nextIndex);
            setNextImageIndex(null);
            setIsTransitioning(false);
          }, 800); // Match this with the CSS transition duration
        }, 50); // Small delay to ensure next image is ready
      }, 3000); // Change image every 3 seconds
    }
    
    return () => {
      if (rotationInterval) {
        clearInterval(rotationInterval);
      }
    };
  }, [isScrolling, isTransitioning, currentImageIndex, images.length]);
  
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Background decorative elements */}
      <div className="hidden lg:block lg:absolute lg:inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-yooboba-light dark:bg-yooboba-blue rounded-bl-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-yooboba-light dark:bg-yooboba-blue rounded-tr-[100px] opacity-20"></div>
      </div>

      {/* Floating Bubbles Component */}
      <FloatingBubbles />
      
      {/* Welcome user message at the very top */}
      {user && (
        <div className="absolute top-4 left-0 right-0 px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-7xl mx-auto">
            <BlurText
              text={`Welcome back, ${user.FullName || user.first_name || user.emailaddress || 'User'}!`}
              className="text-xl sm:text-2xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yooboba-purple to-yooboba-pink dark:from-yooboba-blue dark:to-yooboba-pink"
              delay={150}
              animateBy="words"
              direction="top"
              stepDuration={0.4}
            />
          </div>
        </div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-28 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollAnimation animation="animate-reveal-text" delay={300} className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
              <span className="block">Premium</span>
              <span className="block hero-gradient dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink">Boba Pearls</span>
              <span className="block">For Your Business</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
              Elevate your bubble tea with YooBoba's premium quality boba pearls. 
              Crafted with care, delivered with consistency.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <Button 
                asChild
                size="lg" 
                className="bg-yooboba-gradient hover:opacity-90 text-white font-semibold py-3 px-6 rounded-md dark:shadow-glow-sm"
              >
                <Link to="/products">
                  Shop Now
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="font-semibold py-3 px-6 rounded-md border-2 border-yooboba-purple text-yooboba-purple dark:border-yooboba-blue dark:text-yooboba-blue dark:hover:bg-gray-800"
              >
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </ScrollAnimation>

          <div className="relative" ref={imageContainerRef}>
            <div className="relative h-[500px] sm:h-[500px] lg:h-[600px] lg:-mr-8 overflow-hidden">
              {/* Dark mode glow effect */}
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-yooboba-blue to-yooboba-pink rounded-full blur-3xl opacity-5 dark:opacity-20"></div>
              
              <div className="image-container">
                {/* Current image */}
                <img
                  key={`current-${currentImageIndex}`}
                  src={images[currentImageIndex]}
                  alt={`Boba Pearls ${currentImageIndex + 1}`}
                  className="sliding-image dark:filter dark:brightness-95"
                  ref={imageRef}
                  style={{ 
                    transformOrigin: 'center center',
                    transition: 'transform 800ms ease-in-out',
                    transform: isTransitioning ? 'translateX(-100%)' : 'translateX(0)',
                    zIndex: 5
                  }}
                />
                
                {/* Next image (for slide transition) */}
                {nextImageIndex !== null && (
                  <img
                    key={`next-${nextImageIndex}`}
                    src={images[nextImageIndex]}
                    alt={`Boba Pearls ${nextImageIndex + 1}`}
                    className="sliding-image dark:filter dark:brightness-95"
                    style={{ 
                      transformOrigin: 'center center',
                      transition: 'transform 800ms ease-in-out',
                      transform: isTransitioning ? 'translateX(0)' : 'translateX(100%)',
                      zIndex: 10
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;