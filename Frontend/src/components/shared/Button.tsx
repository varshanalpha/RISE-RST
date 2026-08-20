import React, { ButtonHTMLAttributes, forwardRef, useRef, useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-150 ease-out rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 overflow-hidden select-none active:translate-y-[2px]";
    
    const variants = {
      primary: "bg-brand-primary text-white hover:bg-blue-700 shadow-[0_4px_0_#1e40af] hover:shadow-[0_6px_12px_rgba(37,99,235,0.2)] active:shadow-[0_1px_0_#1e40af]",
      secondary: "bg-surface-secondary text-text-primary border border-border hover:bg-gray-100 shadow-[0_3px_0_#cbd5e1] hover:shadow-[0_5px_10px_rgba(15,23,42,0.05)] active:shadow-[0_1px_0_#cbd5e1]",
      outline: "bg-transparent text-text-primary border-2 border-border hover:border-brand-primary hover:text-brand-primary",
      ghost: "bg-transparent text-text-secondary hover:bg-surface-secondary hover:text-text-primary active:shadow-none active:translate-y-0"
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-[15px]",
      lg: "h-14 px-8 text-lg rounded-2xl"
    };

    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = { x, y, id: Date.now() };
      setRipples(prev => [...prev, newRipple]);
      
      if (props.onClick) props.onClick(e);
    };

    const handleAnimationEnd = (id: number) => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], props.disabled && "opacity-50 cursor-not-allowed pointer-events-none transform-none shadow-none", className)}
        onClick={handleClick}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        
        {/* Ripples */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full animate-[ripple_0.6s_ease-out_forwards] pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: '10px',
              height: '10px',
              transform: 'translate(-50%, -50%) scale(0)'
            }}
            onAnimationEnd={() => handleAnimationEnd(ripple.id)}
          />
        ))}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
