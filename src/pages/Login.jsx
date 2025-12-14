import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Particle component
const Particle = ({ delay }) => {
  const randomX = Math.random() * 100;
  const duration = 2 + Math.random() * 3;
  
  return (
    <motion.div
      initial={{ y: -20, x: `${randomX}vw`, opacity: 0 }}
      animate={{ 
        y: '100vh',
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute w-1 h-1 bg-gray-300 rounded-full"
      style={{
        boxShadow: '0 0 2px rgba(0,0,0,0.1)'
      }}
    />
  );
};

const SuccessDialog = ({ onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
        onDismiss();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6"
        onClick={(e) => e.stopPropagation()} // Optional: keep dialog clickable or let background click dismiss
      >
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
          >
            <motion.svg
              className="w-12 h-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>
          
          <motion.div
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute inset-0 bg-green-500/20 rounded-full -z-10"
          />
        </div>

        <div className="text-center space-y-2">
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900"
            >
                Login Successful!
            </motion.h3>
            <motion.p
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="text-gray-500 font-medium"
            >
                Welcome back to SpinTech.
            </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !showSuccess) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, showSuccess]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error('Login Failed', { description: error.message });
      } else {
        setShowSuccess(true);
      }
    } catch (err) {
      toast.error('An unexpected error occurred.');
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSuccessDismiss = () => {
      navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 relative overflow-hidden">
      <AnimatePresence>
         {showSuccess && <SuccessDialog onDismiss={handleSuccessDismiss} />}
      </AnimatePresence>

      {/* Animated particle rain background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <Particle key={i} delay={i * 0.1} />
        ))}
      </div>
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md shadow-2xl border-gray-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-center">SpinTech CRM</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="bg-white"
                />
              </div>
              <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={authLoading}>
                {authLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-center text-gray-500">
              Protected system. Authorized personnel only.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
