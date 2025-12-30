import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StreakCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  streakType: 'daily' | 'practice';
  newStreak: number;
}

const StreakCelebration: React.FC<StreakCelebrationProps> = ({
  isOpen,
  onClose,
  streakType,
  newStreak,
}) => {
  const isDaily = streakType === 'daily';
  const Icon = isDaily ? Flame : Zap;
  const colorClass = isDaily ? 'text-accent' : 'text-streak-lightning';
  const bgClass = isDaily 
    ? 'from-accent/20 to-streak-lightning/20' 
    : 'from-streak-lightning/20 to-accent/20';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-card rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${bgClass} rounded-2xl opacity-50`} />

            {/* Content */}
            <div className="relative">
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-accent to-streak-lightning mb-6"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: 2,
                    repeatType: 'reverse'
                  }}
                >
                  <Icon className={`w-12 h-12 text-accent-foreground`} />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-3xl font-bold mb-2"
              >
                {isDaily ? '🔥 Daily Streak!' : '⚡ Practice Streak!'}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <span className={`text-6xl font-bold ${colorClass}`}>
                  {newStreak}
                </span>
                <p className="text-muted-foreground mt-2">
                  {isDaily 
                    ? 'days of consistent learning!' 
                    : 'topics practiced!'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-accent to-streak-lightning text-accent-foreground hover:opacity-90"
                >
                  Keep Going!
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StreakCelebration;
