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
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/daily" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-streak-lightning flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-serif font-bold text-xl hidden sm:block">
                SystemDesign<span className="text-accent">.io</span>
              </span>
            </motion.div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`nav-link flex items-center gap-2 rounded-lg ${
                      isActive ? 'active bg-secondary' : 'hover:bg-secondary/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Streaks & User */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                {/* Daily Streak */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10"
                >
                  <Flame className="w-4 h-4 text-accent streak-fire" />
                  <span className="font-semibold text-accent">{user.dailyStreak}</span>
                </motion.div>

                {/* Practice Streak */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-streak-lightning/10"
                >
                  <Zap className="w-4 h-4 text-streak-lightning streak-lightning" />
                  <span className="font-semibold text-streak-lightning">{user.practiceStreak}</span>
                </motion.div>
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
              <span className="hidden md:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
