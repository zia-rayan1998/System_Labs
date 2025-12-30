import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Flame, CheckCircle2, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuizSection from '@/components/QuizSection';
import StreakCelebration from '@/components/StreakCelebration';
import { useAuth } from '@/contexts/AuthContext';
import { mockTopicService } from '@/lib/mockData';
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

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen flex flex-col bg-background grain">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 py-10 max-w-3xl">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{today}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Today's Focus</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">
                {dailyTopic.title}
              </h1>
            </div>
            {hasCompleted && (
              <Badge className="bg-practice/10 text-practice border-practice/20 flex-shrink-0">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Done
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {dailyTopic.estimatedTime} min read
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              dailyTopic.difficulty === 'Beginner' 
                ? 'bg-practice/10 text-practice' 
                : dailyTopic.difficulty === 'Intermediate'
                ? 'bg-primary/10 text-primary'
                : 'bg-destructive/10 text-destructive'
            }`}>
              {dailyTopic.difficulty}
            </span>
          </div>
        </motion.header>

        {/* Content */}
        <motion.article 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="card-elevated p-8 mb-10"
        >
          {dailyTopic.imageUrl && (
            <div className="relative h-48 md:h-64 -m-8 mb-8 overflow-hidden rounded-t-xl">
              <img 
                src={dailyTopic.imageUrl} 
                alt={dailyTopic.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            </div>
          )}
          
          <div className="prose-custom">
            <ReactMarkdown>{dailyTopic.content}</ReactMarkdown>
          </div>
        </motion.article>

        {/* Quiz Section */}
        <motion.section 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="card-elevated p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-streak/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-streak" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold">Daily Quiz</h2>
              <p className="text-sm text-muted-foreground">Complete to maintain your streak</p>
            </div>
          </div>
          
          {quizComplete ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-practice/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-practice" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-2">Completed</h3>
              <p className="text-muted-foreground">Come back tomorrow for a new topic.</p>
            </div>
          ) : (
            <QuizSection 
              questions={dailyTopic.questions} 
              onComplete={handleQuizComplete} 
              isDaily 
              disabled={!user} 
            />
          )}
        </motion.section>
      </main>

      <Footer />

      <StreakCelebration 
        isOpen={showCelebration} 
        onClose={() => setShowCelebration(false)} 
        streakType="daily" 
        newStreak={newStreak} 
      />
    </div>
  );
};

export default DailyTopicPage;