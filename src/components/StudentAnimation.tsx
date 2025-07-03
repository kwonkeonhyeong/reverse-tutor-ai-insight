
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
      default: return 'M8,12 Q12,10 16,12';
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <div className="text-center">
        <div className="mb-6">
          <div className={`inline-block p-6 rounded-full bg-white shadow-lg ${getFaceColor()}`}>
            <svg width="180" height="180" viewBox="0 0 100 100" className="animate-pulse">
              {/* Face outline */}
              <circle cx="50" cy="50" r="40" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
              
              {/* Hair */}
              <path d="M20 35 Q30 25, 50 25 Q70 25, 80 35 Q75 30, 50 20 Q25 30, 20 35" fill="currentColor" fillOpacity="0.6" />
              
              {/* Eyes */}
              <ellipse 
                cx={35 + eyePosition.x} 
                cy={40 + eyePosition.y} 
                rx={blinkAnimation ? "1" : "3"} 
                ry={blinkAnimation ? "0.5" : "2"} 
                fill="currentColor"
                className="transition-all duration-150"
              />
              <ellipse 
                cx={65 + eyePosition.x} 
                cy={40 + eyePosition.y} 
                rx={blinkAnimation ? "1" : "3"} 
                ry={blinkAnimation ? "0.5" : "2"} 
                fill="currentColor"
                className="transition-all duration-150"
              />
              
              {/* Pupils */}
              {!blinkAnimation && (
                <>
                  <circle cx={35 + eyePosition.x} cy={40 + eyePosition.y} r="1" fill="white" />
                  <circle cx={65 + eyePosition.x} cy={40 + eyePosition.y} r="1" fill="white" />
                </>
              )}
              
              {/* Nose */}
              <ellipse cx="50" cy="50" rx="1" ry="2" fill="currentColor" fillOpacity="0.3" />
              
              {/* Mouth */}
              <path 
                d={getMouthShape().replace(/8,12|12,8|16,12|12,16/g, (match) => {
                  const coords = match.split(',');
                  return `${parseInt(coords[0]) * 3 + 20},${parseInt(coords[1]) * 2 + 35}`;
                })} 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none"
                className="transition-all duration-300"
              />
              
              {/* Cheeks when excited */}
              {mood === 'excited' && (
                <>
                  <circle cx="28" cy="55" r="3" fill="currentColor" fillOpacity="0.2" />
                  <circle cx="72" cy="55" r="3" fill="currentColor" fillOpacity="0.2" />
                </>
              )}
              
              {/* Body/Shoulders */}
              <ellipse cx="50" cy="90" rx="35" ry="15" fill="currentColor" fillOpacity="0.1" />
              
              {/* Listening indicator */}
              {isListening && (
                <>
                  <circle cx="15" cy="25" r="2" fill="currentColor" className="animate-ping" />
                  <circle cx="85" cy="25" r="2" fill="currentColor" className="animate-ping" style={{ animationDelay: '0.2s' }} />
                  <circle cx="50" cy="15" r="2" fill="currentColor" className="animate-ping" style={{ animationDelay: '0.4s' }} />
                </>
              )}
            </svg>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">
            {isListening ? "열심히 듣고 있어요!" : "설명을 기다리고 있어요"}
          </h3>
          <p className="text-base text-gray-600">
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
