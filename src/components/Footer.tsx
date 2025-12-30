import { Flame, Zap, BookOpen, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                SystemDesign<span className="text-primary">Pro</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Master system design concepts through daily learning and practice. 
              Build your skills one topic at a time with our curated learning paths.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Flame className="w-4 h-4 text-streak" />
                <span>Daily Streaks</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-practice" />
                <span>Practice Mode</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Learn</h4>
            <ul className="space-y-3">
              <li>
                <a href="/daily" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Daily Topic
                </a>
              </li>
              <li>
                <a href="/library" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Topic Library
                </a>
              </li>
              <li>
                <a href="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Your Progress
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SystemDesignPro. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
