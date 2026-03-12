import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function VoiceOverToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const { toast } = useToast();

  const toggleVoiceOver = () => {
    setIsEnabled(!isEnabled);
    toast({
      title: isEnabled ? "Voice Over Disabled" : "Voice Over Enabled",
      description: isEnabled 
        ? "Accessibility narration has been turned off" 
        : "Accessibility narration is now active",
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleVoiceOver}
      className={`border-electric-blue/50 ${
        isEnabled 
          ? 'bg-electric-blue/20 text-electric-blue' 
          : 'text-gray-400 hover:text-electric-blue'
      } transition-all duration-300`}
    >
      {isEnabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
      <span className="ml-2 text-xs">Voice Over</span>
    </Button>
  );
}