import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, BookOpen, Bot, AlertCircle, Mic, MicOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initial greeting
    setMessages([{
      id: '1',
      type: 'student',
      content: `안녕하세요! ${categoryNames[category || '']} 수업을 듣게 되어 기뻐요. 어떤 내용을 가르쳐주실 건가요?`,
      timestamp: new Date()
    }]);
    
    // Load Gemini API key
    const savedApiKey = localStorage.getItem('geminiApiKey') || '';
    setGeminiApiKey(savedApiKey);

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ko-KR';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentInput(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({
          title: "음성 인식 오류",
          description: "음성 인식에 실패했습니다. 다시 시도해주세요.",
          variant: "destructive"
        });
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [category]);

  useEffect(() => {
    if (!geminiApiKey || !currentInput.trim() || currentInput.length < 20) {
      setAiFeedback('');
      return;
    }
    const timeoutId = setTimeout(() => {
      getAiFeedback(currentInput);
    }, 1000); // 1초 디바운스
    return () => clearTimeout(timeoutId);
  }, [currentInput, geminiApiKey]);

  const getAiFeedback = async (content: string) => {
    if (!geminiApiKey) return;
    setIsGettingFeedback(true);
    try {
      const prompt = `아래의 설명에 대해 논리적, 사실적 오류가 있다면 지적해주고, 개선점을 50자 이내로 알려주세요.\n설명: "${content}"`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (response.ok) {
        const data = await response.json();
        const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        setAiFeedback(feedback);
      } else {
        setAiFeedback('피드백을 가져올 수 없습니다.');
      }
    } catch (error) {
      setAiFeedback('피드백을 가져올 수 없습니다.');
    } finally {
      setIsGettingFeedback(false);
    }
  };

  const getStudentQuestion = async (content: string) => {
    if (!geminiApiKey) return;
    setIsGettingFeedback(true);
    try {
      const prompt = `아래는 선생님의 설명입니다. 설명을 들은 학생이 실제로 말하는 것처럼 자연스럽고 친근하게 반응해 주고, 이어서 학생이 정말 궁금한 핵심 질문 한 가지만 해 주세요.\n\n설명: "${content}"`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (response.ok) {
        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'student',
          content: answer,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'student',
          content: '질문을 생성할 수 없습니다.',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'student',
        content: '질문을 생성할 수 없습니다.',
        timestamp: new Date()
      }]);
    } finally {
      setIsGettingFeedback(false);
    }
  };

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

    // Gemini에 학생 질문 생성 요청
    await getStudentQuestion(newMessage.content);

    setIsLoading(false);
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
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
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

          {/* AI Feedback Panel */}
          <div className="space-y-4">
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-600" />
                  실시간 AI 피드백
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!geminiApiKey ? (
                  <div className="text-center py-6">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-3">
                      AI 피드백을 받으려면 마이페이지에서 Gemini API 키를 설정해주세요
                    </p>
                    <Button 
                      onClick={() => navigate('/mypage')}
                      variant="outline"
                      size="sm"
                    >
                      설정하러 가기
                    </Button>
                  </div>
                ) : isGettingFeedback ? (
                  <div className="text-center py-6">
                    <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-sm text-gray-600">AI가 분석 중입니다...</p>
                  </div>
                ) : aiFeedback ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-purple-200">
                      <p className="text-sm text-gray-700">{aiFeedback}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      * 입력하신 내용을 바탕으로 실시간 피드백을 제공합니다
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Bot className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                    <p className="text-sm text-gray-600">
                      교육 내용을 입력하시면 실시간 피드백을 받을 수 있습니다
                    </p>
                  </div>
                )}
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
                  <div className="relative">
                    <Textarea
                      placeholder={
                        phase === 'initial' 
                          ? "학생에게 가르치고 싶은 내용을 설명해주세요..."
                          : "학생의 질문에 답변해주세요..."
                      }
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (currentInput.trim() && !isLoading) {
                            handleSendMessage();
                          }
                        }
                      }}
                      className="min-h-[100px] pr-12"
                      disabled={isLoading}
                    />
                    {recognition && (
                      <Button
                        onClick={() => {
                          if (isListening) {
                            recognition.stop();
                            setIsListening(false);
                          } else {
                            recognition.start();
                            setIsListening(true);
                          }
                        }}
                        variant="ghost"
                        size="sm"
                        className={`absolute top-2 right-2 ${isListening ? 'text-red-500' : 'text-gray-500'}`}
                        disabled={isLoading}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    줄바꿈 : shift + enter
                  </p>
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
