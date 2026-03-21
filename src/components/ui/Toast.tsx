"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div 
        className={cn(
          "fixed bottom-24 right-6 z-[600] bg-[#252726] border border-white/10 rounded-lg px-5 py-3 text-sm font-normal text-anashe-fg flex items-center gap-3 transition-all duration-300 pointer-events-none",
          toast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <div className="w-2 h-2 rounded-full bg-anashe-mint shrink-0"></div>
        <span>{toast.message}</span>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
