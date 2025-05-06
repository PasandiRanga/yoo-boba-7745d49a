
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <FeaturedProducts />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
