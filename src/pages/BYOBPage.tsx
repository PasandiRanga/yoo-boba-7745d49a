
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Coffee, Building, Phone, Mail, MapPin, Package } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import BackToTopButton from "@/components/ui/back-to-top";

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  organizationName: z.string().min(2, { message: "Organization name is required." }),
  category: z.string().min(1, { message: "Please select a category." }),
  contactNumber: z.string().min(10, { message: "Please enter a valid contact number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(5, { message: "Please enter a valid address." }),
  minimumOrder: z.string().min(1, { message: "Minimum order quantity is required." }),
});

type FormValues = z.infer<typeof formSchema>;

const BYOBPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      organizationName: "",
      category: "",
      contactNumber: "",
      email: "",
      address: "",
      minimumOrder: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      // In a real application, you would send this data to your backend
      console.log("Form data:", data);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Your request has been submitted successfully! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-8 text-center">
              Build Your Own Brand with YooBoba
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-10">
              {/* Left side - Description */}
              <div className="flex flex-col justify">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-yooboba-gradient bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink">
                  Elevate Your Business with Premium Boba Supplies
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Partner with YooBoba to bring the authentic bubble tea experience to your customers. 
                  Our customizable solutions are perfect for cafes, restaurants, hotels, and more.
                </p>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We offer:
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="mr-2 text-yooboba-purple dark:text-yooboba-blue">✓</span>
                    <span>Premium quality tapioca pearls and popping boba</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-yooboba-purple dark:text-yooboba-blue">✓</span>
                    <span>Custom branding opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-yooboba-purple dark:text-yooboba-blue">✓</span>
                    <span>Competitive wholesale pricing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-yooboba-purple dark:text-yooboba-blue">✓</span>
                    <span>Training and support for your team</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-yooboba-purple dark:text-yooboba-blue">✓</span>
                    <span>Reliable delivery and consistent supply</span>
                  </li>
                </ul>
                
                <p className="text-gray-600 dark:text-gray-300">
                  Fill out the form and our team will get in touch with you to discuss how we can help grow your business.
                </p>
              </div>
              
              {/* Right side - Cafe Animation and Form */}
              <div>
                {/* Cafe Animation */}
                <div className="relative h-64 mb-8 overflow-hidden rounded-lg shadow-lg">
                  <div className="cafe-animation absolute inset-0 w-full h-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
                    <div className="cafe-scene p-4">
                      {/* Storefront */}
                      <div className="cafe-building w-48 h-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-auto relative">
                        {/* Store Sign */}
                        <div className="absolute -top-6 left-0 right-0 h-6 bg-yooboba-purple dark:bg-yooboba-blue rounded-t-lg flex items-center justify-center">
                          <span className="text-xs text-white font-bold">YOUR BOBA CAFE</span>
                        </div>
                        
                        {/* Door */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-16 bg-gray-800 dark:bg-gray-600 rounded-t-lg"></div>
                        
                        {/* Windows */}
                        <div className="absolute top-4 left-4 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-sm"></div>
                        <div className="absolute top-4 right-4 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-sm"></div>
                        
                        {/* Boba Cup Animation */}
                        <div className="absolute -right-8 bottom-2 w-8 h-12 bg-gradient-to-b from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700 rounded-lg opacity-80 animate-bounce"></div>
                      </div>
                      
                      {/* Ground */}
                      <div className="w-full h-8 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-900 dark:to-green-800 rounded-lg mt-2"></div>
                    </div>
                  </div>
                </div>
                
                {/* Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Request Wholesale Information</h3>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="organizationName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Organization Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your Business" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cafe">Cafe</SelectItem>
                                <SelectItem value="hotel">Hotel</SelectItem>
                                <SelectItem value="restaurant">Restaurant</SelectItem>
                                <SelectItem value="villa">Villa</SelectItem>
                                <SelectItem value="miniBar">Mini Bar</SelectItem>
                                <SelectItem value="catering">Catering</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="contactNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Number</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="123 Business Ave, City, State, ZIP" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="minimumOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Order Quantity (MOQ)</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="e.g., 10 cases" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        variant="sendMessage"
                        className="w-full"
                        isLoading={isSubmitting}
                      >
                        Send Request
                      </Button>
                    </form>
                  </Form>
                </div>
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

export default BYOBPage;
