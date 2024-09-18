import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Loader2, Check } from "lucide-react";

interface CustomEmailInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSave: (email: string) => void;
  initialValue?: string;
}

const CustomEmailInput = React.forwardRef<HTMLInputElement, CustomEmailInputProps>(
  ({ className, onSave, initialValue = '', ...props }, ref) => {
    const [email, setEmail] = useState(initialValue);
    const [isTyping, setIsTyping] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const validateEmail = (email: string) => {
      if (email === '') return true; // Allow blank email
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(email);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEmail = e.target.value;
      setEmail(newEmail);
      setIsTyping(true);
      setIsSaved(false);
      setIsValid(validateEmail(newEmail));

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        if (validateEmail(newEmail)) {
          onSave(newEmail);
          setIsSaved(true);
        }
      }, 1000); // 1 second debounce
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    useEffect(() => {
      setEmail(initialValue);
      setIsValid(validateEmail(initialValue));
      setIsSaved(false);
    }, [initialValue]);

    return (
      <div className="relative">
        <input
          type="email"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            isValid ? "" : "border-red-500",
            className
          )}
          value={email}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isTyping && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
          {!isTyping && isSaved && email !== '' && <Check className="h-4 w-4 text-green-500" />}
        </div>
        <div className="absolute -bottom-5 left-0 text-xs">
          {!isValid && email !== '' && (
            <span className="text-red-500">Please enter a valid email address</span>
          )}
          {isSaved && isValid && email !== '' && (
            <span className="text-green-500">Saved</span>
          )}
        </div>
      </div>
    );
  }
);

CustomEmailInput.displayName = "CustomEmailInput";

export { CustomEmailInput };