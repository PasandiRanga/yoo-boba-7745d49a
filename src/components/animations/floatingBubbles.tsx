import React from "react";

interface FloatingBubblesProps {
  className?: string;
}

const FloatingBubbles: React.FC<FloatingBubblesProps> = ({ className }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className || ""}`}>
      {/* Left to Right pearls - Row 1 (Top) */}
      <div className="absolute -left-16 top-1/6 w-32 h-32 rounded-full bg-yooboba-light dark:bg-yooboba-blue opacity-70 dark:opacity-50 animate-pearl-move"
           style={{ animationDelay: "0s", animationDuration: "15s" }}></div>
      <div className="absolute -left-12 top-1/6 w-24 h-24 rounded-full bg-yooboba-pink dark:bg-yooboba-purple opacity-60 dark:opacity-40 animate-pearl-move"
           style={{ animationDelay: "7s", animationDuration: "12s" }}></div>
      <div className="absolute -left-20 top-1/6 w-16 h-16 rounded-full bg-yooboba-purple dark:bg-yooboba-pink opacity-40 dark:opacity-30 animate-pearl-move"
           style={{ animationDelay: "12s", animationDuration: "17s" }}></div>
           
      {/* Left to Right pearls - Row 2 */}
      <div className="absolute -left-14 top-1/3 w-20 h-20 rounded-full bg-yooboba-blue dark:bg-yooboba-light opacity-60 dark:opacity-40 animate-pearl-move"
           style={{ animationDelay: "0s", animationDuration: "18s" }}></div>
      <div className="absolute -left-16 top-1/3 w-28 h-28 rounded-full bg-yooboba-purple dark:bg-yooboba-pink opacity-50 dark:opacity-30 animate-pearl-move"
           style={{ animationDelay: "9s", animationDuration: "13s" }}></div>
      <div className="absolute -left-12 top-1/3 w-18 h-18 rounded-full bg-yooboba-light dark:bg-yooboba-blue opacity-40 dark:opacity-20 animate-pearl-move"
           style={{ animationDelay: "15s", animationDuration: "16s" }}></div>
           
      {/* Left to Right pearls - Row 3 (Middle) */}
      <div className="absolute -left-20 top-1/2 w-16 h-16 rounded-full bg-yooboba-pink dark:bg-yooboba-purple opacity-40 dark:opacity-30 animate-pearl-move"
           style={{ animationDelay: "1s", animationDuration: "14s" }}></div>
      <div className="absolute -left-14 top-1/2 w-22 h-22 rounded-full bg-yooboba-blue dark:bg-yooboba-light opacity-70 dark:opacity-40 animate-pearl-move"
           style={{ animationDelay: "8s", animationDuration: "19s" }}></div>
      <div className="absolute -left-18 top-1/2 w-26 h-26 rounded-full bg-yooboba-light dark:bg-yooboba-blue opacity-50 dark:opacity-30 animate-pearl-move"
           style={{ animationDelay: "14s", animationDuration: "15s" }}></div>
           
      {/* Left to Right pearls - Row 4 */}
      <div className="absolute -left-12 top-2/3 w-24 h-24 rounded-full bg-yooboba-light dark:bg-yooboba-blue opacity-50 dark:opacity-30 animate-pearl-move"
           style={{ animationDelay: "2s", animationDuration: "16s" }}></div>
      <div className="absolute -left-16 top-2/3 w-20 h-20 rounded-full bg-yooboba-purple dark:bg-yooboba-pink opacity-60 dark:opacity-40 animate-pearl-move"
           style={{ animationDelay: "10s", animationDuration: "13s" }}></div>
      <div className="absolute -left-14 top-2/3 w-18 h-18 rounded-full bg-yooboba-pink dark:bg-yooboba-purple opacity-40 dark:opacity-30 animate-pearl-move"
           style={{ animationDelay: "16s", animationDuration: "17s" }}></div>
           
      {/* Left to Right pearls - Row 5 (Bottom) */}
      <div className="absolute -left-10 top-5/6 w-12 h-12 rounded-full bg-yooboba-light dark:bg-yooboba-blue opacity-40 dark:opacity-20 animate-pearl-move"
           style={{ animationDelay: "5s", animationDuration: "12s" }}></div>
      <div className="absolute -left-16 top-5/6 w-14 h-14 rounded-full bg-yooboba-blue dark:bg-yooboba-light opacity-80 dark:opacity-50 animate-pearl-move"
           style={{ animationDelay: "11s", animationDuration: "18s" }}></div>
      <div className="absolute -left-20 top-5/6 w-16 h-16 rounded-full bg-yooboba-pink dark:bg-yooboba-purple opacity-50 dark:opacity-30 animate-pearl-move"
           style={{ animationDelay: "17s", animationDuration: "14s" }}></div>
    </div>
  );
};

export default FloatingBubbles;