import { Crown, Lock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContentAccess } from "@/hooks/useContentAccess";

interface FreeContentBannerProps {
  bookId: string;
  chapterNumber?: number;
  contentType?: 'audiobook' | 'chapter' | 'content';
  onUpgrade?: () => void;
}

export function FreeContentBanner({ 
  bookId, 
  chapterNumber = 1, 
  contentType = 'content',
  onUpgrade 
}: FreeContentBannerProps) {
  const { canAccessChapter, getFreeChapterLimit, getAccessMessage } = useContentAccess();
  
  const canAccess = canAccessChapter(bookId, chapterNumber);
  const freeLimit = getFreeChapterLimit(bookId);
  const message = getAccessMessage(bookId, chapterNumber);

  if (canAccess) {
    return (
      <div className="flex items-center gap-2 mb-4">
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <Play className="w-3 h-3 mr-1" />
          {message}
        </Badge>
      </div>
    );
  }

  return (
    <div className="holographic-border bg-gradient-to-r from-purple-900/40 to-cosmic-purple/40 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-cosmic-gold/20 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-cosmic-gold" />
          </div>
        </div>
        
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-white mb-2">
            Premium Content
          </h3>
          <p className="text-gray-300 mb-4">
            You've enjoyed the first {freeLimit} chapters of this {contentType === 'audiobook' ? 'audiobook' : 'story'} for free! 
            Upgrade to Premium to continue your cosmic journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onUpgrade}
              className="bg-gradient-to-r from-cosmic-gold to-bright-gold text-space-dark hover:from-bright-gold hover:to-cosmic-gold font-bold"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium - $9.99/month
            </Button>
            
            <div className="text-sm text-gray-400 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Instant access to all {contentType === 'audiobook' ? 'audiobooks' : 'content'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-cosmic-gold/20">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 bg-cosmic-gold rounded-full"></span>
          <span>Complete trilogy access</span>
          <span className="w-2 h-2 bg-electric-blue rounded-full"></span>
          <span>Young Adult collection</span>
          <span className="w-2 h-2 bg-bright-gold rounded-full"></span>
          <span>Future releases included</span>
        </div>
      </div>
    </div>
  );
}