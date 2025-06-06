import React from 'react';
import { Button } from "@/components/ui/button";
import ScrollAnimation from "@/components/animations/ScrollAnimations";
import { Link } from "react-router-dom";


// Note: We're assuming Link is available in your project through your routing setup
const CTASection = () => {
  return (
    <section className="py-20 bg-yooboba-gradient dark:bg-gradient-to-r dark:from-pink-900/70 dark:to-purple-900/70 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollAnimation animation="animate-reveal-text">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Ready to Upgrade Your Bubble Tea?
            </h2>
            <p className="text-xl mb-8 opacity-90 dark:text-gray-100">
              Join thousands of bubble tea shops worldwide who trust YooBoba for premium quality boba pearls.
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation animation="animate-zoom-in" delay={300}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
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
              <Link to="/contact">
                Contact Sales
              </Link>
            </Button>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation animation="animate-reveal-text" delay={600}>
            <p className="mt-8 text-sm opacity-80 dark:text-gray-200">
              Free shipping on orders over $100. Volume discounts available for bulk orders.
            </p>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default CTASection;