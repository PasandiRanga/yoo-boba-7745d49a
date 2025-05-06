import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        sendMessage:
          "relative overflow-hidden bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-white border-2 border-transparent shadow-lg hover:scale-[1.02] active:scale-100 transition-all duration-300 hover:shadow-xl font-semibold text-base min-w-[200px] h-16 px-5 py-4 rounded-xl before:absolute before:inset-[7px] before:bg-gradient-to-t before:from-white before:to-gray-100 dark:before:from-gray-800 dark:before:to-gray-900 before:rounded-lg before:-z-10 before:blur-[0.5px] after:content-[''] after:absolute after:inset-0 after:rounded-xl after:border-[2.5px] after:border-transparent after:bg-gradient-to-b after:from-white after:to-gray-100 dark:after:from-gray-800 dark:after:to-gray-900 after:bg-origin-border after:bg-clip-padding after:box-border after:z-0 hover:after:scale-[1.05,1.1] after:transition-all after:duration-300",
        slide:
          "relative overflow-hidden rounded-full font-bold text-lg px-8 py-4 bg-yooboba-blue text-white hover:text-black dark:hover:text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-16 px-5 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // For send message style button with loading state
    if (variant === "sendMessage") {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <span className="relative z-10 flex items-center">
            {isLoading ? (
              <>
                <span className="mr-2 inline-flex">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span className="mr-2 inline-flex transform transition-transform group-hover:rotate-45">
                  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform">
                    <g>
                      <path d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z" fill="currentColor" />
                      <path d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z" fill="currentColor" />
                    </g>
                  </svg>
                </span>
                {children}
              </>
            )}
          </span>
        </Comp>
      );
    }
    
    // For slide variant button
    if (variant === "slide") {
      return (
        <Comp
          className={cn(
            buttonVariants({ variant, size, className }),
            "group relative overflow-hidden"
          )}
          ref={ref}
          {...props}
        >
          <span className="relative z-10">
            {children}
          </span>
          <span className="absolute inset-0 overflow-hidden pointer-events-none">
            <span className="absolute left-0 top-0 h-full w-[120%] -translate-x-[10%] skew-x-[30deg] bg-gradient-to-r from-yooboba-purple via-yooboba-blue to-yooboba-pink transition-transform duration-300 group-hover:translate-x-full" />
          </span>
        </Comp>
      );
    }
    
    
    
    // Default button rendering
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };