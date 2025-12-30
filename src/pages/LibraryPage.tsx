import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Library as LibraryIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import TopicCard from '@/components/TopicCard';
import { useAuth } from '@/contexts/AuthContext';
import { mockTopics, mockTopicService } from '@/lib/mockData';
import { Input } from '@/components/ui/input';

const LibraryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredTopics = mockTopics.filter(topic =>
    topic.title.toLowerCase().includes(search.toLowerCase()) ||
    topic.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LibraryIcon className="w-6 h-6 text-accent" />
            <h1 className="font-serif text-3xl font-bold">Topic Library</h1>
          </div>
          <p className="text-muted-foreground">Explore all system design topics at your own pace</p>
        </motion.div>

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search topics..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, index) => (
            <motion.div key={topic.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <TopicCard
                topic={topic}
                isCompleted={user ? mockTopicService.hasCompletedTopic(user.id, topic.id) : false}
                onClick={() => navigate(`/topic/${topic.id}`)}
              />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LibraryPage;
