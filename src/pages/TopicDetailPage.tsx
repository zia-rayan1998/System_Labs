import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import QuizSection from '@/components/QuizSection';
import StreakCelebration from '@/components/StreakCelebration';
import { useAuth } from '@/contexts/AuthContext';
import { mockTopicService } from '@/lib/mockData';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TopicDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const topic = mockTopicService.getTopicById(id || '');
  
  const [showCelebration, setShowCelebration] = useState(false);
  const [newStreak, setNewStreak] = useState(0);

  if (!topic) {
    return <div className="min-h-screen flex items-center justify-center">Topic not found</div>;
  }

  const handleQuizComplete = (correctCount: number) => {
    if (!user) return;
    const result = mockTopicService.submitLibraryQuiz(user.id, topic.id, correctCount);
    setNewStreak(result.newStreak);
    setShowCelebration(true);
    refreshUser();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/library')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
          <div className="relative h-64">
            <img src={topic.imageUrl} alt={topic.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <Badge variant="secondary" className="mb-3">{topic.category}</Badge>
              <h1 className="font-serif text-2xl md:text-3xl font-bold">{topic.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{topic.estimatedTime} min</span>
                <Badge variant="outline">{topic.difficulty}</Badge>
              </div>
            </div>
          </div>
          <div className="p-6 md:p-8 prose prose-neutral max-w-none">
            <ReactMarkdown>{topic.content}</ReactMarkdown>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-streak-lightning/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-streak-lightning" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold">Practice Quiz</h3>
              <p className="text-sm text-muted-foreground">Test your understanding</p>
            </div>
          </div>
          <QuizSection questions={topic.questions} onComplete={handleQuizComplete} disabled={!user} />
        </motion.div>
      </main>
      <StreakCelebration isOpen={showCelebration} onClose={() => setShowCelebration(false)} streakType="practice" newStreak={newStreak} />
    </div>
  );
};

export default TopicDetailPage;
