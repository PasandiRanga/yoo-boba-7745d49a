import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/authContext"; // Import useAuth
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
  const { user, logout } = useAuth(); // Use auth context
  const [open, setOpen] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [showMobileSignIn, setShowMobileSignIn] = useState(false);
  
  const handleLogout = () => {
    logout(); // Use the logout function from auth context
    setOpen(false); // Close mobile menu if open
    setProfileExpanded(false); // Close profile dropdown if open
  };
  
  const handleMobileSignIn = () => {
    setOpen(false); // Close mobile menu
    setShowMobileSignIn(true); // Open sign in dialog
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
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img
                src="/public/images/LogoWithoutBack.png"
                alt="YooBoba Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 mr-2 group-hover:scale-105 transition-transform"
              />
              <span className="text-lg sm:text-2xl font-bold font-display bg-yooboba-gradient bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink">
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
                className="font-medium text-gray-600 dark:text-gray-300 hover:text-yooboba-purple dark:hover:text-yooboba-blue transition-colors relative group py-2 px-1"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yooboba-gradient dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-4">
              <CurrencyToggle />
              <div className="mr-2">
                <ThemeToggle />
              </div>
              
              {/* Profile Menu or Sign In Button - Desktop */}
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
                      {user.FullName || user.emailaddress}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-orders" className="cursor-pointer flex items-center">
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
              
              {/* Cart Button - Desktop */}
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
            </div>
            
            {/* Mobile Menu Button - ONLY visible on mobile */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px]"
                >
                  <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:max-w-sm p-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <div className="flex flex-col h-full overflow-y-auto">
                  {/* Mobile Header */}
                  <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <div className="flex items-center">
                      <img
                        src="/public/images/LogoWithoutBack.png"
                        alt="YooBoba Logo" 
                        className="h-8 w-8 mr-3"
                      />
                      <span className="text-xl font-bold font-display bg-yooboba-gradient bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-yooboba-blue dark:to-yooboba-pink">
                        YooBoba
                      </span>
                    </div>
                    <SheetClose asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px]"
                      >
                        <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                      </Button>
                    </SheetClose>
                  </div>
                  
                  {/* Mobile Navigation Items */}
                  <div className="flex-1 px-4 py-6">
                    {/* Navigation Links */}
                    <div className="space-y-1 mb-8">
                      {navItems.map((item, index) => (
                        <SheetClose key={index} asChild>
                          <Link
                            to={item.path}
                            className="flex items-center py-4 px-4 text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-yooboba-purple dark:hover:text-yooboba-blue hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 min-h-[56px]"
                            onClick={() => setOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                    
                    {/* Cart Link */}
                    <div className="mb-8">
                      <SheetClose asChild>
                        <Link
                          to="/cart"
                          className="flex items-center justify-between py-4 px-4 text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-yooboba-purple dark:hover:text-yooboba-blue hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 min-h-[56px]"
                          onClick={() => setOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <ShoppingCart className="h-6 w-6" />
                            <span>Shopping Cart</span>
                          </div>
                          {totalItems > 0 && (
                            <span className="bg-yooboba-purple dark:bg-yooboba-blue text-white text-sm rounded-full h-6 w-6 flex items-center justify-center">
                              {totalItems}
                            </span>
                          )}
                        </Link>
                      </SheetClose>
                    </div>
                    
                    {/* Settings Section */}
                    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-base text-gray-700 dark:text-gray-300">Theme</span>
                          <ThemeToggle />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-base text-gray-700 dark:text-gray-300">Currency</span>
                          <CurrencyToggle />
                        </div>
                      </div>
                    </div>
                    
                    {/* User Section */}
                    <div>
                      {user ? (
                        <div className="space-y-1">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
                            <div className="flex items-center space-x-3 mb-1">
                              <div className="h-10 w-10 bg-yooboba-gradient rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {user.FullName || 'User'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {user.emailaddress}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <SheetClose asChild>
                            <Link
                              to="/profile"
                              className="flex items-center space-x-3 py-4 px-4 text-base text-gray-800 dark:text-gray-200 hover:text-yooboba-purple dark:hover:text-yooboba-blue hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 min-h-[56px]"
                            >
                              <User className="h-5 w-5" />
                              <span>My Profile</span>
                            </Link>
                          </SheetClose>
                          
                          <SheetClose asChild>
                            <Link
                              to="/my-orders"
                              className="flex items-center space-x-3 py-4 px-4 text-base text-gray-800 dark:text-gray-200 hover:text-yooboba-purple dark:hover:text-yooboba-blue hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 min-h-[56px]"
                            >
                              <Package className="h-5 w-5" />
                              <span>My Orders</span>
                            </Link>
                          </SheetClose>
                          
                          <SheetClose asChild>
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-3 py-4 px-4 text-base text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 min-h-[56px] w-full text-left"
                            >
                              <LogOut className="h-5 w-5" />
                              <span>Sign Out</span>
                            </button>
                          </SheetClose>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <button
                            onClick={handleMobileSignIn}
                            className="flex items-center space-x-3 py-4 px-4 text-lg font-medium text-gray-800 dark:text-gray-200 hover:text-yooboba-purple dark:hover:text-yooboba-blue hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 min-h-[56px] w-full text-left"
                          >
                            <User className="h-6 w-6" />
                            <span>Sign In</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Mobile SignIn Dialog - rendered outside of Sheet */}
      {showMobileSignIn && (
        <SignInDialog 
          variant="mobile" 
          onDialogOpen={() => {}} 
          isOpen={showMobileSignIn}
          onClose={() => setShowMobileSignIn(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;