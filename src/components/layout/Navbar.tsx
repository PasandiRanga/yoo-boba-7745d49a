import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, LogOut, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import CurrencyToggle from "./CurrencyToggle";
import SignInDialog from "@/components/signin/signInDialog";

const Navbar = () => {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("customer");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("customer");
    setUser(null);
    // Redirect to homepage or reload page if needed
    window.location.href = "/";
  };
  
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Buy Now", path: "/products" },
    { label: "BYOB", path: "/byob" },
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
            <CurrencyToggle />
            <div className="mr-2">
              <ThemeToggle />
            </div>
            
            {/* Profile Menu or Sign In Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    <span className="sr-only">User profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.name || user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SignInDialog />
            )}
            
            {/* Cart Button */}
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
                    <div className="flex items-center space-x-4">
                      <CurrencyToggle />
                      <ThemeToggle />
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
                    
                    {/* User Profile Options or Sign In for mobile */}
                    {user ? (
                      <div className="flex flex-col items-center space-y-4 mt-4 border-t border-gray-100 dark:border-gray-800 pt-6 w-full">
                        <div className="text-center mb-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                          <p className="font-medium">{user.name || user.email}</p>
                        </div>
                        
                        <SheetClose asChild>
                          <Link
                            to="/profile"
                            className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:text-yooboba-purple dark:hover:text-yooboba-blue"
                          >
                            <User className="h-5 w-5" />
                            <span>Profile</span>
                          </Link>
                        </SheetClose>
                        
                        <SheetClose asChild>
                          <Link
                            to="/orders"
                            className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 hover:text-yooboba-purple dark:hover:text-yooboba-blue"
                          >
                            <Package className="h-5 w-5" />
                            <span>Orders</span>
                          </Link>
                        </SheetClose>
                        
                        <SheetClose asChild>
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                          </button>
                        </SheetClose>
                      </div>
                    ) : (
                      <SheetClose asChild>
                        <div className="py-4">
                          <SignInDialog />
                        </div>
                      </SheetClose>
                    )}
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