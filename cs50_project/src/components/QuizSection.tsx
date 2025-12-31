import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronRight, Trophy, Flame, Zap } from 'lucide-react';
import { Question } from '@/lib/api';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface QuizSectionProps {
  questions: Question[];
  onComplete: (correctCount: number, totalQuestions: number) => void;
  isDaily?: boolean;
  disabled?: boolean;
}

const QuizSection: React.FC<QuizSectionProps> = ({ 
  questions, 
  onComplete, 
  isDaily = false,
  disabled = false 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctIndex;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    if (showResult || disabled) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || disabled) return;
    setShowResult(true);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete
      setIsComplete(true);
      const finalCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;
      
      // Trigger confetti for good scores
      if (finalCorrect >= questions.length * 0.6) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      onComplete(finalCorrect, questions.length);
    }
  };

  if (isComplete) {
    const finalScore = correctAnswers;
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-accent to-streak-lightning mb-6"
        >
          <Trophy className="w-12 h-12 text-accent-foreground" />
        </motion.div>
        
        <h3 className="font-serif text-3xl font-bold mb-2">Quiz Complete!</h3>
        <p className="text-muted-foreground text-lg mb-4">
          You got <span className="text-foreground font-semibold">{finalScore}</span> out of{' '}
          <span className="text-foreground font-semibold">{questions.length}</span> correct
        </p>
        
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary">
          <span className="text-2xl font-bold">{percentage}%</span>
          <span className="text-muted-foreground">accuracy</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          {isDaily ? (
            <div className="flex items-center gap-2 text-accent">
              <Flame className="w-6 h-6 streak-fire" />
              <span className="font-semibold">Daily streak updated!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-streak-lightning">
              <Zap className="w-6 h-6 streak-lightning" />
              <span className="font-semibold">Practice streak updated!</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <h4 className="text-xl font-medium">{currentQuestion.question}</h4>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let optionClass = 'quiz-option';
              
              if (showResult) {
                if (index === currentQuestion.correctIndex) {
                  optionClass += ' quiz-option-correct';
                } else if (index === selectedAnswer) {
                  optionClass += ' quiz-option-wrong';
                }
              } else if (selectedAnswer === index) {
                optionClass += ' quiz-option-selected';
              }

              return (
                <motion.button
                  key={index}
                  whileHover={!showResult && !disabled ? { scale: 1.01 } : {}}
                  whileTap={!showResult && !disabled ? { scale: 0.99 } : {}}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult || disabled}
                  className={`${optionClass} w-full text-left flex items-center gap-4`}
                >
                  <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && index === currentQuestion.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  )}
                  {showResult && index === selectedAnswer && index !== currentQuestion.correctIndex && (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-lg bg-secondary/50 border border-border"
              >
                <p className="text-sm">
                  <span className="font-medium">Explanation:</span>{' '}
                  {currentQuestion.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            {!showResult ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null || disabled}
                className="bg-primary hover:bg-primary/90"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  'Complete Quiz'
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizSection;
