
import React, { useState } from 'react';
import { X as CloseIcon, Twitter, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleXLogin = async () => {
    setIsAuthenticating(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: 'x_user_123',
      name: 'Creative Soul',
      handle: 'creativesoul_art',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    };
    
    onLogin(mockUser);
    setIsAuthenticating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className="flex justify-end -mr-4 -mt-4">
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
              <CloseIcon className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <div className="w-20 h-20 bg-black rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
             <svg viewBox="0 0 24 24" aria-hidden="true" className="w-10 h-10 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          </div>

          <h2 className="text-2xl font-black text-zinc-900 mb-2">Login Required</h2>
          <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
            To ensure a fair competition, please verify your identity with your X account before casting a vote.
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleXLogin}
              isLoading={isAuthenticating}
              className="w-full py-4 rounded-2xl bg-black hover:bg-zinc-800 text-white flex items-center justify-center gap-3 text-base font-bold transition-transform active:scale-95"
            >
              {!isAuthenticating && (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              )}
              {isAuthenticating ? 'Authenticating...' : 'Sign in with X'}
            </Button>
            
            <p className="text-[10px] text-zinc-400 flex items-center justify-center gap-1 mt-4">
              <ShieldCheck className="w-3 h-3" /> Secure authentication via X.com
            </p>
          </div>
        </div>
        
        <div className="bg-zinc-50 p-6 border-t border-zinc-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-zinc-900">Get AI Feedback</p>
            <p className="text-[10px] text-zinc-500">Sign in to see detailed AI analysis on your favorite entries.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
