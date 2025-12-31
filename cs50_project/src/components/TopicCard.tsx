import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Lock, ChevronRight } from 'lucide-react';
import { Topic } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface TopicCardProps {
  topic: Topic;
  isCompleted?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
}

const difficultyColors = {
  Beginner: 'bg-success/10 text-success border-success/20',
  Intermediate: 'bg-streak-lightning/10 text-streak-lightning border-streak-lightning/20',
  Advanced: 'bg-destructive/10 text-destructive border-destructive/20',
};

const TopicCard: React.FC<TopicCardProps> = ({ 
  topic, 
  isCompleted = false, 
  isLocked = false,
  onClick 
}) => {
  return (
    <motion.div
      whileHover={!isLocked ? { y: -4 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
      className={`topic-card bg-card border border-border cursor-pointer transition-shadow ${
        isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg'
      }`}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={topic.imageUrl}
          alt={topic.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
        
        {/* Status badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {isCompleted && (
            <div className="px-2 py-1 rounded-full bg-success/90 text-success-foreground text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </div>
          )}
          {isLocked && (
            <div className="px-2 py-1 rounded-full bg-muted/90 text-muted-foreground text-xs font-medium flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Locked
            </div>
          )}
        </div>

        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
            {topic.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif font-semibold text-lg leading-tight">
            {topic.title}
          </h3>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {topic.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <Badge 
            variant="outline" 
            className={difficultyColors[topic.difficulty]}
          >
            {topic.difficulty}
          </Badge>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{topic.estimatedTime} min</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TopicCard;
