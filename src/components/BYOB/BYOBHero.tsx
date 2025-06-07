import FloatingBubbles from "@/components/animations/floatingBubbles";

const BYOBHero = () => (
  <section className="bg-gradient-to-r from-yooboba-blue/10 via-yooboba-purple/10 to-yooboba-pink/10 dark:from-yooboba-blue/20 dark:via-yooboba-purple/20 dark:to-yooboba-pink/20 py-16 md:py-24 relative overflow-hidden">
    <FloatingBubbles />
    <div className="container mx-auto px-4 md:px-6 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 dark:text-white">
          Build Your Own Brand
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
          Elevate Your Business with Premium Boba Supplies
        </p>
      </div>
    </div>
  </section>
);

export default BYOBHero;
