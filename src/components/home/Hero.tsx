import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ScrollAnimation from "@/components/animations/ScrollAnimations";
// Import the slide animations CSS
import "@/styles/slideAnimations.css";

const Hero = () => {
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
    <div className="relative overflow-hidden bg-white">
      {/* Background decorative elements */}
      <div className="hidden lg:block lg:absolute lg:inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-yooboba-light rounded-bl-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-yooboba-light rounded-tr-[100px] opacity-20"></div>
      </div>

      {/* Continuously Moving Pearls Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left to Right pearls - Row 1 (Top) */}
        <div className="absolute -left-16 top-1/6 w-32 h-32 rounded-full bg-yooboba-light opacity-70 animate-pearl-move"
             style={{ animationDelay: "0s", animationDuration: "15s" }}></div>
        <div className="absolute -left-12 top-1/6 w-24 h-24 rounded-full bg-yooboba-pink opacity-60 animate-pearl-move"
             style={{ animationDelay: "7s", animationDuration: "12s" }}></div>
        <div className="absolute -left-20 top-1/6 w-16 h-16 rounded-full bg-yooboba-purple opacity-40 animate-pearl-move"
             style={{ animationDelay: "12s", animationDuration: "17s" }}></div>
             
        {/* Left to Right pearls - Row 2 */}
        <div className="absolute -left-14 top-1/3 w-20 h-20 rounded-full bg-yooboba-blue opacity-60 animate-pearl-move"
             style={{ animationDelay: "2s", animationDuration: "18s" }}></div>
        <div className="absolute -left-16 top-1/3 w-28 h-28 rounded-full bg-yooboba-purple opacity-50 animate-pearl-move"
             style={{ animationDelay: "9s", animationDuration: "13s" }}></div>
        <div className="absolute -left-12 top-1/3 w-18 h-18 rounded-full bg-yooboba-light opacity-40 animate-pearl-move"
             style={{ animationDelay: "15s", animationDuration: "16s" }}></div>
             
        {/* Left to Right pearls - Row 3 (Middle) */}
        <div className="absolute -left-20 top-1/2 w-16 h-16 rounded-full bg-yooboba-pink opacity-40 animate-pearl-move"
             style={{ animationDelay: "3s", animationDuration: "14s" }}></div>
        <div className="absolute -left-14 top-1/2 w-22 h-22 rounded-full bg-yooboba-blue opacity-70 animate-pearl-move"
             style={{ animationDelay: "8s", animationDuration: "19s" }}></div>
        <div className="absolute -left-18 top-1/2 w-26 h-26 rounded-full bg-yooboba-light opacity-50 animate-pearl-move"
             style={{ animationDelay: "14s", animationDuration: "15s" }}></div>
             
        {/* Left to Right pearls - Row 4 */}
        <div className="absolute -left-12 top-2/3 w-24 h-24 rounded-full bg-yooboba-light opacity-50 animate-pearl-move"
             style={{ animationDelay: "4s", animationDuration: "16s" }}></div>
        <div className="absolute -left-16 top-2/3 w-20 h-20 rounded-full bg-yooboba-purple opacity-60 animate-pearl-move"
             style={{ animationDelay: "10s", animationDuration: "13s" }}></div>
        <div className="absolute -left-14 top-2/3 w-18 h-18 rounded-full bg-yooboba-pink opacity-40 animate-pearl-move"
             style={{ animationDelay: "16s", animationDuration: "17s" }}></div>
             
        {/* Left to Right pearls - Row 5 (Bottom) */}
        <div className="absolute -left-10 top-5/6 w-12 h-12 rounded-full bg-yooboba-light opacity-40 animate-pearl-move"
             style={{ animationDelay: "5s", animationDuration: "12s" }}></div>
        <div className="absolute -left-16 top-5/6 w-14 h-14 rounded-full bg-yooboba-blue opacity-80 animate-pearl-move"
             style={{ animationDelay: "11s", animationDuration: "18s" }}></div>
        <div className="absolute -left-20 top-5/6 w-16 h-16 rounded-full bg-yooboba-pink opacity-50 animate-pearl-move"
             style={{ animationDelay: "17s", animationDuration: "14s" }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-28 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollAnimation animation="animate-reveal-text" delay={300} className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight">
              <span className="block">Premium</span>
              <span className="block hero-gradient">Boba Pearls</span>
              <span className="block">For Your Business</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Elevate your bubble tea with YooBoba's premium quality boba pearls. 
              Crafted with care, delivered with consistency.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <Button 
                asChild
                size="lg" 
                className="bg-yooboba-gradient hover:opacity-90 text-white font-semibold py-3 px-6 rounded-md"
              >
                <Link to="/products">
                  Shop Now
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="font-semibold py-3 px-6 rounded-md border-2 border-yooboba-purple text-yooboba-purple"
              >
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </ScrollAnimation>

          <div className="relative" ref={imageContainerRef}>
            <div className="relative h-[500px] sm:h-[500px] lg:h-[600px] lg:-mr-8 overflow-hidden">
              <div className="absolute bottom-150px right-0 w-1 h-1 bg-gradient-to-r from-yooboba-blue to-yooboba-pink rounded-full blur-3xl opacity-20"></div>
              <div className="image-container">
                {/* Current image */}
                <img
                  key={`current-${currentImageIndex}`}
                  src={images[currentImageIndex]}
                  alt={`Boba Pearls ${currentImageIndex + 1}`}
                  className="sliding-image"
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
                    className="sliding-image"
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