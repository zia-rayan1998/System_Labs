import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import QuizSection from '@/components/QuizSection';
import StreakCelebration from '@/components/StreakCelebration';
import { useAuth } from '@/contexts/AuthContext';
import { topicsAPI, quizzesAPI, Topic } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const TopicDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newStreak, setNewStreak] = useState(0);

  useEffect(() => {
    const fetchTopic = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const topicData = await topicsAPI.getTopicById(id);
        setTopic(topicData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load topic',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopic();
  }, [id, toast]);

  const handleQuizComplete = async (correctCount: number, totalQuestions: number) => {
    if (!user || !topic) return;
    try {
      const result = await quizzesAPI.submitPracticeQuiz(topic.id, correctCount, totalQuestions);
      setNewStreak(result.newStreak);
      setShowCelebration(true);
      await refreshUser();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit quiz',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading topic...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Topic not found</p>
            <Button onClick={() => navigate('/library')} className="mt-4">
              Back to Library
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
          <QuizSection questions={topic.questions} onComplete={(correct, total) => handleQuizComplete(correct, total)} disabled={!user} />
        </motion.div>
      </main>
      <StreakCelebration isOpen={showCelebration} onClose={() => setShowCelebration(false)} streakType="practice" newStreak={newStreak} />
    </div>
  );
};

export default TopicDetailPage;
