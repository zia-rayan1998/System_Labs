import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/50 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <span className="font-serif text-lg font-semibold">SystemDesign</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Build lasting system design knowledge through daily practice. 
              One topic at a time, designed for the way you learn.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Learn</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/daily" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Today's Topic
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Topics
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Your Progress
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">About</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-muted-foreground">
                  Built for learners
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Open source
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SystemDesign. Made with intention.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;