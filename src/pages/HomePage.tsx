import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import BackToTopButton from "@/components/ui/back-to-top";
import { useAuth } from "@/context/authContext"; // Import useAuth

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth(); // Use the auth context
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900 text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Hero user={user} />
        <Features />
        <FeaturedProducts />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default HomePage;