import React from 'react';
import ScrollAnimation from "@/components/animations/ScrollAnimations";

const features = [
  {
    title: "Premium Quality",
    description:
      "Our boba pearls are made with carefully selected ingredients to ensure consistent quality, texture, and flavor.",
    icon: "🏆",
  },
  {
    title: "Diverse Selection",
    description:
      "From classic tapioca pearls to fruit-flavored popping boba, we offer a wide range of options for your bubble tea needs.",
    icon: "🎨",
  },
  {
    title: "Bulk Ordering",
    description:
      "Save more with our wholesale pricing for bubble tea shops and businesses. Volume discounts available.",
    icon: "📦",
  },
  {
    title: "Fast Shipping",
    description:
      "We ship nationwide with expedited options available to ensure your business never runs out of essential supplies.",
    icon: "🚚",
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimation animation="animate-reveal-text" className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 dark:text-white">
            Why Choose YooBoba?
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We're committed to providing the highest quality boba pearls for your bubble tea business.
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <ScrollAnimation
              key={index}
              animation="animate-zoom-in"
              threshold={0.1}
              delay={200 * index}
            >
              <div
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md dark:hover:shadow-pink-900/20 transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;