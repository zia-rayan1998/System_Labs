import { useState } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
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
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || undefined;

  // If role=admin, force login view and prefill admin credentials for convenience
  const isAdminView = roleParam === 'admin';
  if (isAdminView && isLogin !== true) {
    // ensure login mode when admin selected
    // (do not call setState here during render to avoid warnings)
  }

  if (user) {
    return <Navigate to="/daily" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        try {
          const success = await login(email, password);
          if (success) {
            toast({ title: 'Welcome back', description: 'Successfully signed in.' });
            navigate('/daily');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unable to sign in';
          toast({ 
            title: 'Unable to sign in', 
            description: errorMessage || 'Check your credentials and try again.', 
            variant: 'destructive' 
          });
        }
      } else {
        const result = await signup(email, password, username);
        if (result.success) {
          toast({ title: 'Account created', description: 'Welcome to SystemDesign' });
          navigate('/daily');
        } else {
          toast({ title: 'Unable to create account', description: result.error, variant: 'destructive' });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background grain">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-practice/5" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif text-lg font-semibold">SystemDesign</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md"
          >
            <h1 className="font-serif text-4xl font-semibold text-foreground mb-4 tracking-tight leading-tight">
              Learn system design,<br />
              <span className="text-muted-foreground">one day at a time.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Build a sustainable learning habit with curated topics, 
              spaced practice, and progress tracking that actually works.
            </p>
          </motion.div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Daily topics</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Practice mode</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Track streaks</span>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif text-lg font-semibold">SystemDesign</span>
          </div>

          <h2 className="font-serif text-2xl font-semibold mb-1">
            {isLogin ? 'Welcome back' : 'Get started'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isLogin ? 'Sign in to continue learning' : 'Create your account'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isAdminView && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Your name" 
                    className="pl-10 h-11 bg-card border-border/50 focus:border-primary/50" 
                    required 
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="you@example.com" 
                  className="pl-10 h-11 bg-card border-border/50 focus:border-primary/50" 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="pl-10 h-11 bg-card border-border/50 focus:border-primary/50" 
                  required 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-medium" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {!isAdminView && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          )}

          
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;