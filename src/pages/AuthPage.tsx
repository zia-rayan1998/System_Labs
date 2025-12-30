import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/daily" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (success) {
          toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
          navigate('/daily');
        } else {
          toast({ title: 'Login failed', description: 'Invalid email or password.', variant: 'destructive' });
        }
      } else {
        const result = await signup(email, password, username);
        if (result.success) {
          toast({ title: 'Account created!', description: 'Welcome to SystemDesign.io' });
          navigate('/daily');
        } else {
          toast({ title: 'Signup failed', description: result.error, variant: 'destructive' });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/20" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-streak-lightning flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-accent-foreground" />
              </div>
              <span className="font-serif font-bold text-3xl text-primary-foreground">
                SystemDesign<span className="text-accent">.io</span>
              </span>
            </div>
            <h1 className="font-serif text-4xl font-bold text-primary-foreground mb-4">
              Master System Design,<br />One Day at a Time
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-md">
              Build a daily learning habit with curated system design topics. Track your progress, maintain streaks, and become interview-ready.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-streak-lightning flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="font-serif font-bold text-2xl">SystemDesign.io</span>
          </div>

          <h2 className="font-serif text-2xl font-bold mb-2">{isLogin ? 'Welcome back' : 'Create account'}</h2>
          <p className="text-muted-foreground mb-8">
            {isLogin ? 'Sign in to continue your learning journey' : 'Start building your system design skills'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your name" className="pl-10" required />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" required />
              </div>
            </div>

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-secondary/50 text-sm">
            <p className="font-medium mb-2">Demo accounts:</p>
            <p className="text-muted-foreground">Admin: admin@example.com / admin123</p>
            <p className="text-muted-foreground">User: user@example.com / user123</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
