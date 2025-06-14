import FloatingBubbles from "@/components/animations/floatingBubbles";
import ScrollAnimation from "@/components/animations/ScrollAnimations";

const BYOBHero = () => (
  <section className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300 py-16 md:py-24">
    {/* Background decorative elements */}
    <div className="hidden lg:block lg:absolute lg:inset-0">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-yooboba-light dark:bg-yooboba-blue rounded-bl-[100px] opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-yooboba-light dark:bg-yooboba-blue rounded-tr-[100px] opacity-20"></div>
    </div>

    {/* Floating Bubbles Component */}
    <FloatingBubbles />
    
    <div className="relative container mx-auto px-4 md:px-6">
      <ScrollAnimation animation="animate-reveal-text" className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-gray-900 dark:text-white mb-6">
          <span className="block">Build Your Own</span>
          <span className="block hero-gradient dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink">Brand</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
          Elevate Your Business with Premium Boba Supplies
        </p>
      </ScrollAnimation>
    </div>
  </section>
);

export default BYOBHero;
