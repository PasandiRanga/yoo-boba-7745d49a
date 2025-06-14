import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FloatingBubbles from "@/components/animations/floatingBubbles";
import BackToTopButton from "@/components/ui/back-to-top";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900 text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300 py-16 md:py-24">
          {/* Background decorative elements */}
          <div className="hidden lg:block lg:absolute lg:inset-0">
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-yooboba-light dark:bg-yooboba-blue rounded-bl-[100px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-yooboba-light dark:bg-yooboba-blue rounded-tr-[100px] opacity-20"></div>
          </div>

          {/* Floating Bubbles Component */}
          <FloatingBubbles />
          
          <div className="relative container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight text-gray-900 dark:text-white mb-6">
                <span className="block">About</span>
                <span className="block hero-gradient dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink">YooBoba.</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                We're passionate about creating the perfect boba pearls for bubble tea shops and enthusiasts around the world.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold font-display mb-6 dark:text-white">Our Story</h2>
                <p className="text-gray-700 mb-4 dark:text-gray-300">
                  Founded in 2015, YooBoba began with a simple mission: to create the perfect boba pearls for bubble tea enthusiasts worldwide. Our founder, a bubble tea aficionado, was frustrated with inconsistent quality and decided to solve the problem.
                </p>
                <p className="text-gray-700 mb-4 dark:text-gray-300">
                  Starting in a small kitchen with experiments on tapioca flour and brown sugar, we perfected our recipes over years of testing. As word spread about our premium pearls, local bubble tea shops began requesting our products.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Today, YooBoba supplies premium boba pearls to thousands of bubble tea shops across the country, while maintaining our commitment to quality, innovation, and exceptional customer service.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1558857563-c0c8b5962dc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="YooBoba Story" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-yooboba-gradient rounded-full flex items-center justify-center text-white font-bold shadow-lg dark:shadow-gray-800/50">
                  <div className="text-center">
                    <div className="text-xl">Since</div>
                    <div className="text-3xl">2015</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold font-display mb-4 dark:text-white">Our Values</h2>
              <p className="text-gray-600 dark:text-gray-300">
                The core principles that guide everything we do at YooBoba.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow dark:bg-gray-700 dark:hover:shadow-gray-700/50">
                <div className="w-16 h-16 bg-yooboba-light rounded-full flex items-center justify-center text-2xl mb-6 dark:bg-yooboba-dark">
                  🌱
                </div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Quality First</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We never compromise on quality. From ingredient selection to manufacturing processes, excellence is our standard.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow dark:bg-gray-700 dark:hover:shadow-gray-700/50">
                <div className="w-16 h-16 bg-yooboba-light rounded-full flex items-center justify-center text-2xl mb-6 dark:bg-yooboba-dark">
                  🔬
                </div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We're constantly developing new flavors, textures, and products to help our customers stay ahead in the bubble tea industry.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow dark:bg-gray-700 dark:hover:shadow-gray-700/50">
                <div className="w-16 h-16 bg-yooboba-light rounded-full flex items-center justify-center text-2xl mb-6 dark:bg-yooboba-dark">
                  🌎
                </div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Sustainability</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We're committed to environmentally responsible practices in our sourcing, manufacturing, and packaging.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Manufacturing Process */}
        <section className="py-16 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1558857563-c0c8b5962dc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                      alt="Manufacturing Process" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden mt-8">
                    <img 
                      src="https://images.unsplash.com/photo-1588653818221-2651deed55cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                      alt="Manufacturing Process" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                      alt="Manufacturing Process" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-lg overflow-hidden mt-8">
                    <img 
                      src="https://images.unsplash.com/photo-1625349266648-1c31478dac1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                      alt="Manufacturing Process" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold font-display mb-6 dark:text-white">Our Manufacturing Process</h2>
                <p className="text-gray-700 mb-4 dark:text-gray-300">
                  At YooBoba, we combine traditional techniques with modern technology to create the perfect boba pearls. Our manufacturing process involves several carefully monitored steps:
                </p>
                <ol className="list-decimal pl-5 space-y-3 text-gray-700 mb-6 dark:text-gray-300">
                  <li><span className="font-medium dark:text-white">Ingredient Selection:</span> We source premium tapioca starch and natural sweeteners.</li>
                  <li><span className="font-medium dark:text-white">Mixing & Forming:</span> Our proprietary mixing process ensures consistent texture.</li>
                  <li><span className="font-medium dark:text-white">Cooking:</span> Precision cooking techniques for the perfect chewy texture.</li>
                  <li><span className="font-medium dark:text-white">Cooling & Packaging:</span> Rapid cooling preserves freshness before airtight packaging.</li>
                  <li><span className="font-medium dark:text-white">Quality Control:</span> Every batch undergoes rigorous testing before shipping.</li>
                </ol>
                <p className="text-gray-700 dark:text-gray-300">
                  This meticulous process ensures that every YooBoba pearl delivers the perfect texture and flavor that bubble tea enthusiasts crave.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-yooboba-gradient text-white dark:bg-yooboba-gradient-dark">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold font-display mb-4">
                Ready to Experience the YooBoba Difference?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of bubble tea shops that trust YooBoba for premium quality boba pearls.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-white text-yooboba-purple hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                >
                  <Link to="/products">
                    Browse Products
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white/10 dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-700/50"
                >
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default AboutPage;