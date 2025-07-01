
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, BookOpen } from "lucide-react";
import StudentAnimation from "@/components/StudentAnimation";

const categoryNames: { [key: string]: string } = {
  mathematics: "수학",
  science: "과학",
  history: "역사",
  economics: "경제",
  computer_science: "컴퓨터과학",
  arts: "예술",
  social_studies: "사회",
  language: "언어"
};

interface ChatMessage {
  id: string;
  type: 'student' | 'teacher';
  content: string;
  timestamp: Date;
}

type TeachingPhase = 'initial' | 'teaching' | 'questions' | 'completed';

const TeachingPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [currentInput, setCurrentInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<TeachingPhase>('initial');
  const [studentMood, setStudentMood] = useState<'neutral' | 'thinking' | 'excited' | 'confused'>('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const maxQuestions = 3;

  useEffect(() => {
    // Initial greeting
    setMessages([{
      id: '1',
      type: 'student',
      content: `안녕하세요! ${categoryNames[category || '']} 수업을 듣게 되어 기뻐요. 어떤 내용을 가르쳐주실 건가요?`,
      timestamp: new Date()
    }]);
  }, [category]);

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'teacher',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentInput("");
    setIsLoading(true);
    setStudentMood('thinking');

    // Simulate AI response
    setTimeout(() => {
      if (phase === 'initial' || phase === 'teaching') {
        generateStudentQuestion();
        setPhase('questions');
      } else if (phase === 'questions') {
        if (questionCount < maxQuestions - 1) {
          generateFollowUpQuestion();
          setQuestionCount(prev => prev + 1);
        } else {
          finishTeaching();
        }
      }
      setIsLoading(false);
    }, 2000);
  };

  const generateStudentQuestion = () => {
    const questions = [
      "정말 흥미로운 설명이었어요! 그런데 실생활에서는 어떻게 활용할 수 있나요?",
      "와! 이해가 되는 것 같아요. 그런데 반대의 경우는 어떻게 되나요?",
      "설명해주신 내용이 다른 개념과는 어떤 관계가 있나요?",
      "혹시 이 내용과 관련된 흥미로운 사례가 있을까요?"
    ];

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setStudentMood('excited');
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'student',
      content: randomQuestion,
      timestamp: new Date()
    }]);
  };

  const generateFollowUpQuestion = () => {
    const followUps = [
      "아하! 그렇군요. 더 자세히 설명해주실 수 있나요?",
      "이해했어요! 그런데 만약 다른 상황이라면 어떨까요?",
      "정말 도움이 되었어요. 추가로 알아두면 좋을 점이 있나요?",
      "좋은 설명이었어요! 마지막으로 궁금한 게 있는데요..."
    ];

    const randomFollowUp = followUps[Math.floor(Math.random() * followUps.length)];
    setStudentMood('thinking');
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'student',
      content: randomFollowUp,
      timestamp: new Date()
    }]);
  };

  const finishTeaching = () => {
    setStudentMood('excited');
    setPhase('completed');
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'student',
      content: "정말 좋은 수업이었어요! 많이 배웠습니다. 감사합니다!",
      timestamp: new Date()
    }]);
  };

  const handleFinishTeaching = () => {
    // Save teaching session data
    const teachingData = {
      category,
      messages,
      timestamp: new Date(),
      completed: true
    };
    
    // Store in localStorage for now (later can be moved to backend)
    const existingSessions = JSON.parse(localStorage.getItem('teachingSessions') || '[]');
    localStorage.setItem('teachingSessions', JSON.stringify([...existingSessions, teachingData]));
    
    navigate('/feedback', { state: { teachingData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {categoryNames[category || '']} 수업
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Student Animation */}
          <div className="space-y-4">
            <StudentAnimation 
              isListening={phase !== 'initial'} 
              mood={studentMood}
            />
            
            {phase === 'completed' && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold text-green-800 mb-2">수업 완료!</h3>
                  <p className="text-sm text-green-700 mb-4">
                    훌륭한 설명이었어요. 이제 피드백을 받아보세요!
                  </p>
                  <Button 
                    onClick={handleFinishTeaching}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    피드백 받기
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Interface */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">교육 진행 상황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'teacher' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          message.type === 'teacher'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'teacher' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 p-3 rounded-lg animate-pulse">
                        <p className="text-sm text-gray-600">학생이 생각하고 있어요...</p>
                      </div>
                    </div>
                  )}
                </div>

                {phase !== 'completed' && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder={
                        phase === 'initial' 
                          ? "학생에게 가르치고 싶은 내용을 설명해주세요..."
                          : "학생의 질문에 답변해주세요..."
                      }
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      className="min-h-[100px]"
                      disabled={isLoading}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        질문 {questionCount + 1}/{maxQuestions}
                      </span>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!currentInput.trim() || isLoading}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {phase === 'initial' ? '가르치기' : '답변하기'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingPage;
