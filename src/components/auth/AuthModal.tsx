import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '../ui/dialog';
import { SignUpForm } from './SignUpForm';
import { SignInForm } from './SignInForm';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AuthMode = 'signin' | 'signup';

// Authentication modal containing sign in and sign up forms
export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signin');

  // Handles successful authentication
  const handleSuccess = () => {
    onOpenChange(false);
  };

  // Switches between sign in and sign up modes
  const switchToSignUp = () => setMode('signup');
  const switchToSignIn = () => setMode('signin');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-amber-100 border-amber-300">
        <DialogHeader className="sr-only">
          <span>Authentication</span>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'signin' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'signin' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {mode === 'signin' ? (
              <SignInForm
                onSuccess={handleSuccess}
                onSwitchToSignUp={switchToSignUp}
              />
            ) : (
              <SignUpForm
                onSuccess={handleSuccess}
                onSwitchToSignIn={switchToSignIn}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}