import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-yooboba-blue/10 via-yooboba-purple/10 to-yooboba-pink/10 dark:from-yooboba-blue/5 dark:via-yooboba-purple/5 dark:to-yooboba-pink/5 dark:bg-gray-900 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 dark:text-white">
                Contact Us
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Have questions about our products? Need a custom order? We'd love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Information */}
        <section className="py-16 dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold font-display mb-6 dark:text-white">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="dark:text-gray-300">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-yooboba-purple/70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="dark:text-gray-300">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-yooboba-purple/70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="dark:text-gray-300">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-yooboba-purple/70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="dark:text-gray-300">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-yooboba-purple/70"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject" className="dark:text-gray-300">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-yooboba-purple/70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="dark:text-gray-300">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-yooboba-purple/70"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-yooboba-gradient hover:opacity-90 dark:opacity-90 dark:hover:opacity-100"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 mb-8 border border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-bold font-display mb-6 dark:text-white">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-yooboba-light dark:bg-gray-700 rounded-full p-3 mr-4 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 dark:text-white">Address</h3>
                        <p className="text-gray-600 dark:text-gray-400">1234 Boba Street</p>
                        <p className="text-gray-600 dark:text-gray-400">Tea City, CA 90210</p>
                        <p className="text-gray-600 dark:text-gray-400">United States</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-yooboba-light dark:bg-gray-700 rounded-full p-3 mr-4 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 dark:text-white">Phone</h3>
                        <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                        <p className="text-gray-600 dark:text-gray-400">+1 (555) 987-6543</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-yooboba-light dark:bg-gray-700 rounded-full p-3 mr-4 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 dark:text-white">Email</h3>
                        <p className="text-gray-600 dark:text-gray-400">info@yooboba.com</p>
                        <p className="text-gray-600 dark:text-gray-400">sales@yooboba.com</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-yooboba-light dark:bg-gray-700 rounded-full p-3 mr-4 text-yooboba-purple dark:text-pink-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 dark:text-white">Business Hours</h3>
                        <p className="text-gray-600 dark:text-gray-400">Monday - Friday: 9am - 5pm</p>
                        <p className="text-gray-600 dark:text-gray-400">Saturday: 10am - 2pm</p>
                        <p className="text-gray-600 dark:text-gray-400">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-bold font-display mb-6 dark:text-white">Follow Us</h2>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-yooboba-light dark:bg-gray-700 text-yooboba-purple dark:text-pink-400 p-3 rounded-full hover:bg-yooboba-purple hover:text-white dark:hover:bg-pink-600 dark:hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                    <a href="#" className="bg-yooboba-light dark:bg-gray-700 text-yooboba-purple dark:text-pink-400 p-3 rounded-full hover:bg-yooboba-purple hover:text-white dark:hover:bg-pink-600 dark:hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                      </svg>
                    </a>
                    <a href="#" className="bg-yooboba-light dark:bg-gray-700 text-yooboba-purple dark:text-pink-400 p-3 rounded-full hover:bg-yooboba-purple hover:text-white dark:hover:bg-pink-600 dark:hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="bg-yooboba-light dark:bg-gray-700 text-yooboba-purple dark:text-pink-400 p-3 rounded-full hover:bg-yooboba-purple hover:text-white dark:hover:bg-pink-600 dark:hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold font-display mb-4 dark:text-white">Find Us</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Visit our headquarters or contact us for a factory tour.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm dark:shadow-gray-900/30 h-96 bg-gray-200 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
              {/* Placeholder for map - in a real project, you would embed Google Maps here */}
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <p className="text-gray-500 dark:text-gray-400">Map Placeholder - Google Maps would be integrated here</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;