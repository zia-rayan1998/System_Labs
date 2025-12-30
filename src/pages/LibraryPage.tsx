import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mockTopics, mockTopicService, type Topic } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  MapPin, 
  Lock, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  Zap,
  Star
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-400 bg-green-400/10 border-green-400/30";
      case "intermediate": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "advanced": return "text-red-400 bg-red-400/10 border-red-400/30";
      default: return "text-muted-foreground bg-muted/10 border-border";
    }
  };

  // Calculate positions for a winding path layout
  const getNodePosition = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const isEvenRow = row % 2 === 0;
    
    // Zigzag pattern
    const x = isEvenRow ? col : 2 - col;
    const baseX = 15 + x * 35;
    const baseY = 12 + row * 24;
    
    // Add some organic variation
    const offsetX = (index * 7) % 5 - 2.5;
    const offsetY = (index * 3) % 4 - 2;
    
    return { x: baseX + offsetX, y: baseY + offsetY };
  };

  const handleTopicClick = (topicId: string) => {
    navigate(`/topic/${topicId}`);
  };

  const completedCount = user ? mockTopics.filter(t => mockTopicService.hasCompletedTopic(user.id, t.id)).length : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
              Learning <span className="text-gradient">Journey</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Navigate through system design concepts. Each location unlocks new knowledge.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-6 mt-6"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>{mockTopics.length} Topics</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>{completedCount} Completed</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-practice" />
              <span>Practice Mode</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 map-container grid-pattern relative overflow-hidden">
        {/* SVG Path Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '800px' }}>
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(262, 83%, 58%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {mockTopics.slice(0, -1).map((_, index) => {
            const start = getNodePosition(index);
            const end = getNodePosition(index + 1);
            
            return (
              <motion.path
                key={index}
                d={`M ${start.x}% ${start.y}% Q ${(start.x + end.x) / 2}% ${start.y + 5}% ${end.x}% ${end.y}%`}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="2"
                className="map-path"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Topic Nodes */}
        <div className="relative w-full min-h-[800px] max-w-7xl mx-auto px-4">
          {mockTopics.map((topic, index) => {
            const position = getNodePosition(index);
            const status = getTopicStatus(topic);
            
            return (
              <motion.div
                key={topic.id}
                className="absolute cursor-pointer"
                style={{ 
                  left: `${position.x}%`, 
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 200
                }}
                onMouseEnter={() => setHoveredTopic(topic.id)}
                onMouseLeave={() => setHoveredTopic(null)}
                onClick={() => handleTopicClick(topic.id)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Pulse Ring for Available */}
                {status === "available" && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-primary/30"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Node Card */}
                <div
                  className={`
                    relative w-48 p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300
                    ${status === "completed" 
                      ? "bg-success/10 border-success/30" 
                      : status === "locked"
                      ? "bg-muted/20 border-border opacity-60"
                      : "bg-card/80 border-primary/30 hover:border-primary"
                    }
                  `}
                >
                  {/* Status Icon */}
                  <div className={`
                    absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center
                    ${status === "completed" 
                      ? "bg-success text-success-foreground" 
                      : status === "locked"
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                    }
                  `}>
                    {status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : status === "locked" ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>

                  {/* Topic Number */}
                  <div className="text-xs text-muted-foreground mb-2">
                    Location {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Topic Title */}
                  <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
                    {topic.title}
                  </h3>

                  {/* Meta Info */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyColor(topic.difficulty)}`}>
                      {topic.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {topic.estimatedTime}
                    </span>
                  </div>

                  {/* Expanded Info on Hover */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ 
                      opacity: hoveredTopic === topic.id ? 1 : 0,
                      height: hoveredTopic === topic.id ? "auto" : 0
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2">
                      {topic.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-primary text-xs font-medium">
                      <Star className="w-3 h-3" />
                      <span>{topic.questions.length} Questions</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute bottom-8 right-8 bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4"
        >
          <h4 className="text-sm font-semibold text-foreground mb-3">Map Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-primary" />
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-success" />
              <span className="text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-muted" />
              <span className="text-muted-foreground">Locked</span>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default LibraryPage;
