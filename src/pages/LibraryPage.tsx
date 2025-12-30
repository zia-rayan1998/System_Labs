import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mockTopics, mockTopicService, type Topic } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Sparkles
} from "lucide-react";

const LibraryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  const getTopicStatus = (topic: Topic) => {
    if (!user) return "locked";
    const isCompleted = mockTopicService.hasCompletedTopic(user.id, topic.id);
    if (isCompleted) return "completed";
    return "available";
  };

  const handleTopicClick = (topicId: string) => {
    navigate(`/topic/${topicId}`);
  };

  const completedCount = user 
    ? mockTopics.filter(t => mockTopicService.hasCompletedTopic(user.id, t.id)).length 
    : 0;

  // Position nodes in a flowing path pattern
  const getNodeStyle = (index: number) => {
    const totalTopics = mockTopics.length;
    const isEven = index % 2 === 0;
    
    return {
      marginLeft: isEven ? '0%' : '40%',
      marginRight: isEven ? '40%' : '0%',
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-background grain">
      <Navbar />
      
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-primary mb-3">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Learning Path</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-3 tracking-tight">
              Your Journey
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Navigate through {mockTopics.length} carefully crafted topics. 
              Each one builds on the last.
            </p>
          </motion.div>

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 max-w-md"
          >
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">{completedCount} of {mockTopics.length}</span>
            </div>
            <div className="progress-track">
              <motion.div 
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / mockTopics.length) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Journey Map */}
      <main className="flex-1 py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Path visualization */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-border via-border to-transparent -translate-x-1/2 hidden md:block" />

            {/* Topic Nodes */}
            <div className="space-y-6">
              {mockTopics.map((topic, index) => {
                const status = getTopicStatus(topic);
                const isHovered = hoveredTopic === topic.id;
                const nodeStyle = getNodeStyle(index);
                
                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.06,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    style={nodeStyle}
                    className="relative"
                  >
                    {/* Node connector dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-8 w-3 h-3 rounded-full bg-border hidden md:block" style={{ left: index % 2 === 0 ? 'calc(100% + 24px)' : '-24px' }}>
                      {status === 'completed' && (
                        <div className="w-3 h-3 rounded-full bg-practice" />
                      )}
                    </div>

                    <motion.div
                      className={`map-node cursor-pointer ${status === 'completed' ? 'map-node-completed' : ''} ${status === 'locked' ? 'map-node-locked' : ''}`}
                      onMouseEnter={() => setHoveredTopic(topic.id)}
                      onMouseLeave={() => setHoveredTopic(null)}
                      onClick={() => handleTopicClick(topic.id)}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="map-node-inner">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-muted-foreground font-medium">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                topic.difficulty === 'Beginner' 
                                  ? 'bg-practice/10 text-practice' 
                                  : topic.difficulty === 'Intermediate'
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-destructive/10 text-destructive'
                              }`}>
                                {topic.difficulty}
                              </span>
                            </div>
                            <h3 className="font-serif text-lg font-semibold text-foreground leading-tight">
                              {topic.title}
                            </h3>
                          </div>

                          {/* Status indicator */}
                          {status === 'completed' && (
                            <div className="w-6 h-6 rounded-full bg-practice/20 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-practice" />
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {topic.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {topic.estimatedTime} min
                            </span>
                            <span>{topic.questions.length} questions</span>
                          </div>

                          {/* Hover indicator */}
                          <motion.div
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ 
                              opacity: isHovered ? 1 : 0, 
                              x: isHovered ? 0 : -4 
                            }}
                            className="flex items-center gap-1 text-primary text-sm font-medium"
                          >
                            Start <ArrowRight className="w-3.5 h-3.5" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LibraryPage;