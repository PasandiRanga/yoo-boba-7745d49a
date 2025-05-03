
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-yooboba-gradient text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Ready to Upgrade Your Bubble Tea?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of bubble tea shops worldwide who trust YooBoba for premium quality boba pearls.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              asChild
              size="lg" 
              className="bg-white text-yooboba-purple hover:bg-gray-100"
            >
              <Link to="/products">
                Shop Now
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white/10"
            >
              <Link to="/contact">
                Contact Sales
              </Link>
            </Button>
          </div>
          <p className="mt-8 text-sm opacity-80">
            Free shipping on orders over $100. Volume discounts available for bulk orders.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
