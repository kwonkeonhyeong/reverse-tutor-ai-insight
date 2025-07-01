
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
  language: "언어"
};

const categoryQuestions: { [key: string]: string[] } = {
  mathematics: [
    "미분과 적분의 관계를 좀 더 자세히 설명해주실 수 있나요?",
    "이 공식을 실제 문제에 어떻게 적용할 수 있을까요?",
    "혹시 이와 비슷한 다른 수학 개념이 있나요?"
  ],
  science: [
    "이 현상이 일어나는 과학적 원리를 더 구체적으로 알려주세요",
    "일상생활에서 볼 수 있는 비슷한 예가 있을까요?",
    "이 실험 결과를 어떻게 해석해야 하나요?"
  ],
  history: [
    "이 사건이 당시 사회에 미친 영향은 무엇인가요?",
    "비슷한 시기의 다른 나라 상황과 비교하면 어떨까요?",
    "현재 우리에게 주는 교훈은 무엇일까요?"
  ],
  economics: [
    "이 경제 이론이 실제 시장에서는 어떻게 작동하나요?",
    "현재 경제 상황에 이 개념을 적용하면 어떨까요?",
    "다른 경제 지표와는 어떤 관계가 있나요?"
  ],
  computer_science: [
    "이 알고리즘의 시간 복잡도는 어떻게 되나요?",
    "실제 프로젝트에서 이 기술을 어떻게 활용할 수 있을까요?",
    "다른 프로그래밍 언어에서는 어떻게 구현하나요?"
  ],
  language: [
    "이 문법 규칙의 예외 상황은 언제인가요?",
    "원어민들은 실제로 어떻게 사용하나요?",
    "비슷한 의미의 다른 표현 방법이 있나요?"
  ]
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
        generateFollowUpQuestion();
        setQuestionCount(prev => prev + 1);
      }
      setIsLoading(false);
    }, 2000);
  };

  const generateStudentQuestion = () => {
    const questions = categoryQuestions[category || 'mathematics'] || categoryQuestions.mathematics;
    const randomQuestion = questions[0];
    setStudentMood('excited');
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'student',
      content: randomQuestion,
      timestamp: new Date()
    }]);
  };

  const generateFollowUpQuestion = () => {
    const questions = categoryQuestions[category || 'mathematics'] || categoryQuestions.mathematics;
    const questionIndex = Math.min(questionCount + 1, questions.length - 1);
    const followUpQuestion = questions[questionIndex];
    setStudentMood('thinking');
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'student',
      content: followUpQuestion,
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
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold text-blue-800 mb-2">교육 진행 중</h3>
                <p className="text-sm text-blue-700 mb-4">
                  언제든지 교육을 종료할 수 있습니다
                </p>
                <Button 
                  onClick={handleFinishTeaching}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  교육 종료하기
                </Button>
              </CardContent>
            </Card>
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
                  <div className="flex justify-end">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingPage;
