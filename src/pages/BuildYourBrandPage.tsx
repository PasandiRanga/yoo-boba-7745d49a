
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Truck, Cafe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import ScrollAnimation from "@/components/animations/ScrollAnimations";

// Define the form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  business: z.string().min(2, { message: "Business name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  contactNo: z.string().min(10, { message: "Please enter a valid phone number." }),
  category: z.enum(["cafe", "hotels", "restaurants", "villas", "mini_bar", "catering"], {
    required_error: "Please select a business category.",
  }),
  location: z.string().min(2, { message: "Location is required." }),
  address: z.string().min(5, { message: "Please provide your complete address." }),
  minOrderQuantity: z.string().min(1, { message: "Please specify minimum order quantity." }),
});

type FormValues = z.infer<typeof formSchema>;

const BuildYourBrandPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      business: "",
      email: "",
      contactNo: "",
      category: undefined,
      location: "",
      address: "",
      minOrderQuantity: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      console.log("Form data submitted:", data);
      
      // Show success message and animation
      setShowSuccess(true);
      setIsSubmitting(false);
      
      // Show toast notification
      toast.success("Your inquiry has been submitted successfully!", {
        description: "We will contact you soon.",
      });
      
      // Reset form after success
      setTimeout(() => {
        form.reset();
        setShowSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero section with truck animation */}
        <div className="relative h-64 sm:h-80 md:h-96 mb-12 overflow-hidden bg-gradient-to-r from-yooboba-blue/10 via-yooboba-purple/10 to-yooboba-pink/10 dark:from-yooboba-blue/5 dark:via-yooboba-purple/5 dark:to-yooboba-pink/5 rounded-xl">
          <div className="truck-animation absolute inset-0 flex items-center">
            <div className="animate-truck flex items-center gap-2 text-yooboba-purple">
              <Truck className="h-12 w-12 md:h-16 md:w-16" />
              <Cafe className="h-8 w-8 md:h-12 md:w-12" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl md:text-5xl font-bold text-center text-gray-800 dark:text-white font-display bg-white/80 dark:bg-gray-900/80 px-6 py-3 rounded-lg">
              Build Your Own Brand
            </h1>
          </div>
        </div>

        {/* Description */}
        <ScrollAnimation animation="animate-fade-in" className="mb-12 max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Partner with YooBoba to create your unique bubble tea experience. 
            Whether you're a café, hotel, or restaurant, we provide premium bubble tea ingredients 
            and support to help your business thrive. Fill out the form below to get started on your journey.
          </p>
        </ScrollAnimation>
        
        {/* Success message with boba animation */}
        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-32 h-48 mb-6">
              <div className="loader relative w-[120px] h-[200px] border-[5px] border-black rounded-b-[40px] overflow-hidden bg-white">
                <div className="straw absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-[20px] h-[60px] bg-pink-400 rounded-[10px] z-0"></div>
                <div className="liquid absolute bottom-0 w-full h-full bg-gradient-to-t from-purple-300 to-pink-200 z-1"></div>
                <div className="boba absolute bottom-[10px] w-full flex justify-around z-2">
                  <span className="w-[14px] h-[14px] bg-[#3e2723] rounded-full animate-rise"></span>
                  <span className="w-[14px] h-[14px] bg-[#3e2723] rounded-full animate-riseDelay1"></span>
                  <span className="w-[14px] h-[14px] bg-[#3e2723] rounded-full animate-riseDelay2"></span>
                </div>
              </div>
            </div>
            <div className="text-center max-w-md">
              <h3 className="text-2xl font-bold text-yooboba-purple mb-2 flex items-center justify-center gap-2">
                <Check className="h-6 w-6" /> Success!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Thank you for your interest in partnering with YooBoba! We've received your inquiry 
                and will contact you shortly via email and SMS. Get ready to build an amazing brand together!
              </p>
            </div>
          </div>
        ) : (
          /* Form */
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center font-display bg-yooboba-gradient bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink">
              Partner Inquiry Form
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    name="business"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Business Name" {...field} />
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
                  
                  <FormField
                    control={form.control}
                    name="contactNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+94 7X XXX XXXX" {...field} />
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
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cafe">Café</SelectItem>
                            <SelectItem value="hotels">Hotel</SelectItem>
                            <SelectItem value="restaurants">Restaurant</SelectItem>
                            <SelectItem value="villas">Villa</SelectItem>
                            <SelectItem value="mini_bar">Mini Bar</SelectItem>
                            <SelectItem value="catering">Catering</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Province" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your complete business address" 
                          className="min-h-[80px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="minOrderQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Order Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 50 packs, 10 kg, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-yooboba-purple hover:bg-yooboba-purple/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BuildYourBrandPage;
