import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

const ScreenNavbar = () => {
  return (
    <div className="w-full">
      <nav className="full-width py-5 px-8 flex flex-row justify-between items-center bg-background/50 backdrop-blur-md">
        {/* Left: Logo */}
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-8 w-auto object-contain"
            onError={(e) => {
              // Fallback if logo.png doesn't exist
              e.currentTarget.src = "https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png";
              e.currentTarget.className = "h-8 w-auto brightness-0 invert opacity-80";
            }}
          />
        </div>

        {/* Center: Nav Items */}
        <div className="hidden md:flex items-center gap-6">
          <button className="flex items-center gap-1 text-foreground/90 text-base hover:text-foreground transition-colors group">
            Features <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
          <button className="text-foreground/90 text-base hover:text-foreground transition-colors">
            Solutions
          </button>
          <button className="text-foreground/90 text-base hover:text-foreground transition-colors">
            Plans
          </button>
          <button className="flex items-center gap-1 text-foreground/90 text-base hover:text-foreground transition-colors group">
            Learning <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>

        {/* Right: Sign Up */}
        <div>
          <Button variant="heroSecondary" size="sm" className="rounded-full px-4 py-2">
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Gradient Divider */}
      <div className="mt-[3px] w-full h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
    </div>
  );
};

export default ScreenNavbar;
