import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  
  const baseStyles = "inline-flex items-center justify-center rounded-2xl font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-4 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 border border-transparent focus:ring-indigo-200",
    secondary: "bg-white text-indigo-600 shadow-md shadow-slate-100 hover:shadow-lg border-2 border-indigo-50 hover:border-indigo-100 focus:ring-indigo-100",
    outline: "border-2 border-indigo-200 bg-transparent text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-100",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    glass: "bg-white/80 backdrop-blur-md text-indigo-700 border border-white/50 shadow-sm hover:bg-white"
  };

  const sizes = "px-6 py-4 text-base sm:text-lg";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;