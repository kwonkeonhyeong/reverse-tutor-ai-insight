
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

  const getMouthShape = () => {
    switch (mood) {
      case 'excited': return 'M40,65 Q50,75 60,65';
      case 'thinking': return 'M40,68 L60,68';
      case 'confused': return 'M40,70 Q50,60 60,70';
      default: return 'M40,68 Q50,72 60,68';
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <div className="text-center">
        <div className="mb-6">
          <div className={`inline-block p-6 rounded-full bg-white shadow-lg`}>
            <svg width="180" height="180" viewBox="0 0 100 100">
              {/* Head */}
              <circle cx="50" cy="50" r="40" fill="#f3e5f5" stroke="#ce93d8" strokeWidth="1"/>

              {/* Hair */}
              <path d="M30,40 C15,15 50,10 70,25 C65,15 50,5 35,15 Z" fill="#6d4c41" />

              {/* Eyes */}
              <g transform={`translate(${eyePosition.x}, ${eyePosition.y})`}>
                {/* Left Eye */}
                <ellipse cx="38" cy="45" rx="6" ry={blinkAnimation ? 0.5 : 5} fill="white" stroke="#6d4c41" strokeWidth="1"/>
                <circle cx="38" cy="45" r="2.5" fill="#6d4c41" />
                <circle cx="39" cy="44" r="1" fill="white" fillOpacity="0.8" />
                
                {/* Right Eye */}
                <ellipse cx="62" cy="45" rx="6" ry={blinkAnimation ? 0.5 : 5} fill="white" stroke="#6d4c41" strokeWidth="1"/>
                <circle cx="62" cy="45" r="2.5" fill="#6d4c41" />
                <circle cx="63"cy="44" r="1" fill="white" fillOpacity="0.8" />
              </g>

              {/* Nose */}
              <path d="M48,52 C50,56 52,56 50,52" stroke="#a1887f" strokeWidth="1.5" fill="none" />

              {/* Mouth */}
              <path
                d={getMouthShape()}
                stroke="#8d6e63"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-300"
              />

              {/* Cheeks when excited */}
              {mood === 'excited' && (
                <>
                  <circle cx="28" cy="55" r="5" fill="#ffcdd2" fillOpacity="0.7" />
                  <circle cx="72" cy="55" r="5" fill="#ffcdd2" fillOpacity="0.7" />
                </>
              )}

              {/* Body/Shoulders */}
              <path d="M25,95 C30,80 70,80 75,95 L50,100 Z" fill="#e3f2fd" />

              {/* Listening indicator */}
              {isListening && (
                <>
                  <circle cx="15" cy="25" r="3" fill="#4fc3f7" className="animate-ping" />
                  <circle cx="85" cy="25" r="3" fill="#4fc3f7" className="animate-ping" style={{ animationDelay: '0.2s' }} />
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
