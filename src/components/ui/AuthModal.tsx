"use client";

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { showToast } = useToast();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[900] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#252726] border border-white/10 rounded-2xl w-full max-w-md p-10 relative shadow-2xl"
      >
        <button 
          className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          onClick={onClose}
        >
          <Icon icon="solar:close-circle-linear" width="1.2em" />
        </button>
        
        <h1 className="text-2xl tracking-[0.2em] font-extralight text-center text-anashe-fg mb-4">Anashe</h1>
        <h3 className="text-2xl font-light tracking-tight text-center mb-2 text-white">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h3>
        <p className="text-sm font-light text-white/50 text-center mb-8">
          {isLogin ? 'Access your account to manage orders, wishlist and rituals.' : 'Join our community and access exclusive rituals.'}
        </p>
        
        <button 
          className="w-full py-3.5 px-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center gap-3 text-sm font-normal hover:bg-white/10 transition-colors mb-6 text-white"
          onClick={() => { showToast('Google feature coming soon'); onClose(); }}
        >
          <Icon icon="logos:google-icon" /> Continue with Google
        </button>
        
        <div className="flex items-center gap-4 text-xs font-normal tracking-widest uppercase text-white/20 mb-6 font-medium">
          <div className="flex-1 h-px bg-white/10"></div>or<div className="flex-1 h-px bg-white/10"></div>
        </div>
        
        <div className="flex flex-col gap-3 mb-6">
          <input type="email" placeholder="Your email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-sm font-light text-white focus:outline-none focus:border-anashe-lila/50 placeholder:text-white/30" />
          <input type="password" placeholder="Password" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-sm font-light text-white focus:outline-none focus:border-anashe-lila/50 placeholder:text-white/30" />
        </div>
        
        <button 
          className="w-full bg-white text-anashe-bg text-xs font-normal tracking-widest uppercase rounded-lg px-4 py-4 hover:bg-anashe-lila transition-all font-medium"
          onClick={() => { showToast('Login successful'); onClose(); }}
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
        
        <div className="text-center text-xs font-light text-white/50 mt-6">
          {isLogin ? (
            <>Don't have an account? <button onClick={() => setIsLogin(false)} className="text-anashe-lila hover:text-white ml-1">Create free account</button></>
          ) : (
            <>Already have an account? <button onClick={() => setIsLogin(true)} className="text-anashe-lila hover:text-white ml-1">Sign in now</button></>
          )}
        </div>
      </motion.div>
    </div>
  );
};
