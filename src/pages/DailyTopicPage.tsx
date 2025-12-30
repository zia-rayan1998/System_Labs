import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Flame, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import QuizSection from '@/components/QuizSection';
import StreakCelebration from '@/components/StreakCelebration';
import { useAuth } from '@/contexts/AuthContext';
import { mockTopicService, getTodayDate } from '@/lib/mockData';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';

const DailyTopicPage = () => {
  const { user, refreshUser } = useAuth();
  const dailyTopic = mockTopicService.getDailyTopic();
  const hasCompleted = user ? mockTopicService.hasCompletedDaily(user.id) : false;
  
  const [showCelebration, setShowCelebration] = useState(false);
  const [newStreak, setNewStreak] = useState(0);
  const [quizComplete, setQuizComplete] = useState(hasCompleted);

  const handleQuizComplete = (correctCount: number, totalQuestions: number) => {
    if (!user) return;
    const result = mockTopicService.submitDailyQuiz(user.id, correctCount, totalQuestions);
    if (result.streakIncreased) {
      setNewStreak(result.newStreak);
      setShowCelebration(true);
    }
    setQuizComplete(true);
    refreshUser();
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{today}</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-3xl md:text-4xl font-bold">Today's Topic</h1>
            {hasCompleted && (
              <Badge className="bg-success/10 text-success border-success/20">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Topic Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
          <div className="relative h-64">
            <img src={dailyTopic.imageUrl} alt={dailyTopic.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <Badge variant="secondary" className="mb-3">{dailyTopic.category}</Badge>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">{dailyTopic.title}</h2>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{dailyTopic.estimatedTime} min read</span>
                <Badge variant="outline">{dailyTopic.difficulty}</Badge>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 prose prose-neutral max-w-none">
            <ReactMarkdown>{dailyTopic.content}</ReactMarkdown>
          </div>
        </motion.div>

        {/* Quiz Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl border border-border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold">Daily Quiz</h3>
              <p className="text-sm text-muted-foreground">Complete to maintain your streak</p>
            </div>
          </div>
          
          {quizComplete ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
              <h4 className="font-serif text-xl font-semibold mb-2">Already Completed!</h4>
              <p className="text-muted-foreground">Come back tomorrow for a new topic.</p>
            </div>
          ) : (
            <QuizSection questions={dailyTopic.questions} onComplete={handleQuizComplete} isDaily disabled={!user} />
          )}
        </motion.div>
      </main>

      <StreakCelebration isOpen={showCelebration} onClose={() => setShowCelebration(false)} streakType="daily" newStreak={newStreak} />
    </div>
  );
};

export default DailyTopicPage;
