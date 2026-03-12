import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface HelpTooltipProps {
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function HelpTooltip({ title, content, position = 'top', className = '' }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className="w-6 h-6 p-0 text-purple-400 hover:text-purple-300"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <HelpCircle className="w-4 h-4" />
      </Button>
      
      {isVisible && (
        <Card className={`absolute z-50 w-64 ${getPositionClasses()} bg-black/90 border-purple-500/50`}>
          <CardContent className="p-3">
            <h4 className="font-semibold text-purple-300 mb-2">{title}</h4>
            <p className="text-sm text-gray-300">{content}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}