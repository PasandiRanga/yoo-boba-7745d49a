
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

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const storedUser = localStorage.getItem("customer");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {user && (
          <div className="p-4 text-sm text-gray-700 dark:text-gray-300">
            Welcome back, <strong>{user.name || user.email}</strong>!
          </div>
        )}
        <Hero />
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
