import { motion } from 'framer-motion';
import { Flame, Zap, Trophy, BookOpen, Target, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StreakGraph from '@/components/StreakGraph';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  if (!user) return null;

  const accuracy = user.totalQuizzes > 0 
    ? Math.round((user.correctAnswers / (user.totalQuizzes * 5)) * 100) 
    : 0;

  const stats = [
    { 
      icon: Flame, 
      label: 'Daily Streak', 
      value: user.dailyStreak, 
      color: 'text-streak', 
      bg: 'bg-streak/10',
      border: 'border-streak/20'
    },
    { 
      icon: Zap, 
      label: 'Practice Streak', 
      value: user.practiceStreak, 
      color: 'text-practice', 
      bg: 'bg-practice/10',
      border: 'border-practice/20'
    },
    { 
      icon: Trophy, 
      label: 'Best Daily', 
      value: user.bestDailyStreak, 
      color: 'text-streak', 
      bg: 'bg-streak/10',
      border: 'border-streak/20'
    },
    { 
      icon: Trophy, 
      label: 'Best Practice', 
      value: user.bestPracticeStreak, 
      color: 'text-practice', 
      bg: 'bg-practice/10',
      border: 'border-practice/20'
    },
    { 
      icon: BookOpen, 
      label: 'Topics Done', 
      value: user.topicsCompleted, 
      color: 'text-primary', 
      bg: 'bg-primary/10',
      border: 'border-primary/20'
    },
    { 
      icon: Target, 
      label: 'Accuracy', 
      value: `${accuracy}%`, 
      color: 'text-practice', 
      bg: 'bg-practice/10',
      border: 'border-practice/20'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background grain">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-10 max-w-2xl">
        {/* Profile Header */}
        <motion.header 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-practice/20 mx-auto mb-4 flex items-center justify-center border border-border/50">
            <User className="w-10 h-10 text-foreground/60" />
          </div>
          <h1 className="font-serif text-2xl font-semibold">{user.username}</h1>
          <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
        </motion.header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label} 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.05 }}
              className={`card-elevated p-5 text-center border ${stat.border}`}
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} mx-auto mb-3 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`text-2xl font-semibold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* GitHub-style Streak Graph */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-elevated p-6 mb-10"
        >
          <StreakGraph user={user} />
        </motion.div>

        {/* Encouragement */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-muted-foreground">
            {user.dailyStreak > 0 
              ? `Keep going! You're on a ${user.dailyStreak}-day streak.`
              : 'Complete today\'s topic to start your streak.'
            }
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;