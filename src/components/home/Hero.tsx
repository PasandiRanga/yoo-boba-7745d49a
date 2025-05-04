import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ScrollAnimation from "@/components/animations/ScrollAnimations";

const Hero = () => {
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return;
      const scrollY = window.scrollY;
      const speed = 0.3; // Adjustable parallax speed
      parallaxRef.current.style.transform = `translateY(${scrollY * speed}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
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

          <div className="relative">
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] lg:-mr-8">
              <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-r from-yooboba-blue to-yooboba-pink rounded-full blur-3xl opacity-20"></div>
              <ScrollAnimation 
                animation="animate-slide-in-right"
                delay={200}
                className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4"
              >
                <img
                  src="https://images.unsplash.com/photo-1558857563-c0c8b5962dc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="Boba Pearls"
                  className="object-cover rounded-2xl shadow-2xl animate-float w-full h-full"
                  ref={parallaxRef}
                />
              </ScrollAnimation>
              <ScrollAnimation 
                animation="animate-slide-in-right"
                delay={500}
                className="absolute z-20 top-1/4 right-0 w-1/2 h-1/2"
              >
                <img
                  src="https://images.unsplash.com/photo-1588653818221-2651deed55cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
                  alt="Bubble Tea"
                  className="object-cover rounded-2xl shadow-2xl rotate-6 animate-float w-full h-full"
                  style={{ animationDelay: "1s" }}
                />
              </ScrollAnimation>
              <ScrollAnimation 
                animation="animate-slide-in-left"
                delay={800}
                className="absolute z-30 bottom-1/4 left-0 w-1/3 h-1/3"
              >
                <img
                  src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="Bubble Tea Ingredients"
                  className="object-cover rounded-2xl shadow-2xl -rotate-6 animate-float w-full h-full"
                  style={{ animationDelay: "2s" }}
                />
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;