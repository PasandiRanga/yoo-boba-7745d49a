
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background decorative elements */}
      <div className="hidden lg:block lg:absolute lg:inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-yooboba-light rounded-bl-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-yooboba-light rounded-tr-[100px] opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
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
          </div>

          <div className="relative">
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] lg:-mr-8">
              <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-r from-yooboba-blue to-yooboba-pink rounded-full blur-3xl opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1558857563-c0c8b5962dc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Boba Pearls"
                className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 object-cover rounded-2xl shadow-2xl animate-float"
              />
              <img
                src="https://images.unsplash.com/photo-1588653818221-2651deed55cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
                alt="Bubble Tea"
                className="absolute z-20 top-1/4 right-0 w-1/2 h-1/2 object-cover rounded-2xl shadow-2xl rotate-6 animate-float"
                style={{ animationDelay: "1s" }}
              />
              <img
                src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Bubble Tea Ingredients"
                className="absolute z-30 bottom-1/4 left-0 w-1/3 h-1/3 object-cover rounded-2xl shadow-2xl -rotate-6 animate-float"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
