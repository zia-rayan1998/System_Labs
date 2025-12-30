import { motion } from 'framer-motion';
import { Flame, Zap, Trophy, BookOpen, Target, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

const ProfilePage = () => {
  const { user } = useAuth();
  if (!user) return null;

  const accuracy = user.totalQuizzes > 0 ? Math.round((user.correctAnswers / (user.totalQuizzes * 5)) * 100) : 0;

  const stats = [
    { icon: Flame, label: 'Daily Streak', value: user.dailyStreak, color: 'text-accent', bg: 'bg-accent/10' },
    { icon: Zap, label: 'Practice Streak', value: user.practiceStreak, color: 'text-streak-lightning', bg: 'bg-streak-lightning/10' },
    { icon: Trophy, label: 'Best Daily', value: user.bestDailyStreak, color: 'text-accent', bg: 'bg-accent/10' },
    { icon: Trophy, label: 'Best Practice', value: user.bestPracticeStreak, color: 'text-streak-lightning', bg: 'bg-streak-lightning/10' },
    { icon: BookOpen, label: 'Topics Done', value: user.topicsCompleted, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Target, label: 'Quiz Accuracy', value: `${accuracy}%`, color: 'text-success', bg: 'bg-success/10' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-streak-lightning mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-accent-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold">{user.username}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} mx-auto mb-3 flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
