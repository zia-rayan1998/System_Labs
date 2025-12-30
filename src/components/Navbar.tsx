import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Library, User, LogOut, Flame, Zap, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { path: '/daily', label: 'Daily Topic', icon: BookOpen },
    { path: '/library', label: 'Library', icon: Library },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin', icon: Shield });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/daily" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center transition-colors group-hover:bg-primary/20">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif text-lg font-semibold tracking-tight hidden sm:block">
              SystemDesign
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`nav-link flex items-center gap-2 ${isActive ? 'active text-foreground bg-muted' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Streaks & User */}
          <div className="flex items-center gap-3">
            {user && (
              <>
                {/* Daily Streak */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-streak/10 border border-streak/20">
                  <Flame className="w-4 h-4 text-streak streak-fire" />
                  <span className="text-sm font-medium text-streak/90">{user.dailyStreak}</span>
                </div>

                {/* Practice Streak */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-practice/10 border border-practice/20">
                  <Zap className="w-4 h-4 text-practice" />
                  <span className="text-sm font-medium text-practice/90">{user.practiceStreak}</span>
                </div>
              </>
            )}

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;