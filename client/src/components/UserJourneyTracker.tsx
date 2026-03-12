import { useState, useEffect } from 'react';
import { User, MapPin, Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

interface JourneyStep {
  id: string;
  name: string;
  completed: boolean;
  timestamp?: string;
}

export default function UserJourneyTracker() {
  const { user, isAuthenticated } = useAuth();
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([
    { id: 'landing', name: 'Discovered Eternal Chase', completed: true, timestamp: new Date().toISOString() },
    { id: 'explore', name: 'Explored Star Map', completed: false },
    { id: 'characters', name: 'Met Characters', completed: false },
    { id: 'authentication', name: 'Signed In', completed: isAuthenticated },
    { id: 'subscription', name: 'Joined Premium', completed: false },
    { id: 'audiobooks', name: 'Started Audiobooks', completed: false },
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      setJourneySteps(prev => prev.map(step => 
        step.id === 'authentication' 
          ? { ...step, completed: true, timestamp: new Date().toISOString() }
          : step
      ));
    }
  }, [isAuthenticated]);

  const completedSteps = journeySteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / journeySteps.length) * 100;

  if (!isAuthenticated) return null;

  return (
    <Card className="bg-space-dark/80 backdrop-blur-sm border-electric-blue/30 max-w-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-cosmic-gold" />
          <h3 className="text-sm font-orbitron font-bold text-cosmic-gold">
            Journey Progress
          </h3>
          <Badge variant="outline" className="text-xs border-electric-blue/50 text-electric-blue">
            {completedSteps}/{journeySteps.length}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {journeySteps.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                step.completed 
                  ? 'text-cosmic-gold' 
                  : 'text-gray-500'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                step.completed 
                  ? 'bg-cosmic-gold animate-pulse' 
                  : 'bg-gray-600'
              }`} />
              <span className="flex-1">{step.name}</span>
              {step.completed && (
                <Star className="w-3 h-3 text-cosmic-gold" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-electric-blue/20">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Progress: {progressPercentage.toFixed(0)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}