
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface StudentAnimationProps {
  isListening: boolean;
  mood: 'neutral' | 'thinking' | 'excited' | 'confused';
}

const StudentAnimation = ({ isListening, mood }: StudentAnimationProps) => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [blinkAnimation, setBlinkAnimation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkAnimation(true);
      setTimeout(() => setBlinkAnimation(false), 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isListening) {
      const moveEyes = () => {
        setEyePosition({
          x: Math.random() * 4 - 2,
          y: Math.random() * 2 - 1
        });
      };
      const interval = setInterval(moveEyes, 2000);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  const getFaceColor = () => {
    switch (mood) {
      case 'excited': return 'text-yellow-400';
      case 'thinking': return 'text-blue-400';
      case 'confused': return 'text-orange-400';
      default: return 'text-green-400';
    }
  };

  const getMouthShape = () => {
    switch (mood) {
      case 'excited': return 'M8,12 Q12,8 16,12';
      case 'thinking': return 'M8,12 L16,12';
      case 'confused': return 'M8,12 Q12,16 16,12';
      default: return 'M8,12 L16,12';
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <div className="text-center">
        <div className="mb-4">
          <div className={`inline-block p-4 rounded-full bg-white shadow-lg ${getFaceColor()}`}>
            <svg width="120" height="120" viewBox="0 0 24 24" className="animate-pulse">
              {/* Face */}
              <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
              
              {/* Eyes */}
              <circle 
                cx={6 + eyePosition.x} 
                cy={9 + eyePosition.y} 
                r={blinkAnimation ? "0.5" : "1.5"} 
                fill="currentColor"
                className="transition-all duration-150"
              />
              <circle 
                cx={18 + eyePosition.x} 
                cy={9 + eyePosition.y} 
                r={blinkAnimation ? "0.5" : "1.5"} 
                fill="currentColor"
                className="transition-all duration-150"
              />
              
              {/* Mouth */}
              <path 
                d={getMouthShape()} 
                stroke="currentColor" 
                strokeWidth="1.5" 
                fill="none"
                className="transition-all duration-300"
              />
              
              {/* Listening indicator */}
              {isListening && (
                <>
                  <circle cx="4" cy="6" r="1" fill="currentColor" className="animate-ping" />
                  <circle cx="20" cy="6" r="1" fill="currentColor" className="animate-ping" style={{ animationDelay: '0.2s' }} />
                  <circle cx="12" cy="4" r="1" fill="currentColor" className="animate-ping" style={{ animationDelay: '0.4s' }} />
                </>
              )}
            </svg>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">
            {isListening ? "열심히 듣고 있어요!" : "설명을 기다리고 있어요"}
          </h3>
          <p className="text-sm text-gray-600">
            {mood === 'excited' && "와! 정말 흥미로워요!"}
            {mood === 'thinking' && "음... 생각해보고 있어요"}
            {mood === 'confused' && "조금 어려운 것 같아요"}
            {mood === 'neutral' && "준비됐어요!"}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StudentAnimation;
