import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);
  
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Buy Now", path: "/products" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];
  
  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-gray-100 dark:border-gray-800 dark:bg-gray-900 shadow-sm dark:shadow-none transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img
                src="/public/images/LogoWithoutBack.png"
                alt="YooBoba Logo" 
                className="h-10 w-10 mr-2 group-hover:scale-105 transition-transform"
              />
              <span className="text-2xl font-bold font-display bg-yooboba-gradient bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink">
                YooBoba
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="font-medium text-gray-600 dark:text-gray-300 hover:text-yooboba-purple dark:hover:text-yooboba-blue transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yooboba-gradient dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <Link to="/cart" className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yooboba-purple dark:bg-yooboba-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center dark:shadow-glow-sm">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Mobile Menu using Sheet component */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:max-w-sm p-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center">
                      <img
                        src="/public/images/LogoWithoutBack.png"
                        alt="YooBoba Logo" 
                        className="h-8 w-8 mr-2"
                      />
                      <span className="text-xl font-bold font-display bg-yooboba-gradient bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink">
                        YooBoba
                      </span>
                    </div>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </Button>
                    </SheetClose>
                  </div>
                  
                  <div className="flex flex-col items-center py-8 space-y-6">
                    {navItems.map((item, index) => (
                      <SheetClose key={index} asChild>
                        <Link
                          to={item.path}
                          className="text-xl font-medium text-gray-800 dark:text-gray-200 hover:text-yooboba-purple dark:hover:text-yooboba-blue transition-colors relative group"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yooboba-gradient dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;