import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { categoryNames, ChatMessage, TeachingPhase, StudentMood } from "@/types/teaching";
import { useGeminiAPI } from "@/hooks/useGeminiAPI";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import StudentSection from "@/components/teaching/StudentSection";
import AIFeedbackPanel from "@/components/teaching/AIFeedbackPanel";
import ChatInterface from "@/components/teaching/ChatInterface";

const TeachingPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [currentInput, setCurrentInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<TeachingPhase>('initial');
  const [studentMood, setStudentMood] = useState<StudentMood>('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');

  const { aiFeedback, setAiFeedback, isGettingFeedback, getAiFeedback, getStudentQuestion } = useGeminiAPI(geminiApiKey);
  const { isListening, recognition, startListening, stopListening } = useSpeechRecognition();

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
  }, [category]);

  useEffect(() => {
    if (!geminiApiKey || !currentInput.trim() || currentInput.length < 20) {
      setAiFeedback('');
      return;
    }
    const timeoutId = setTimeout(() => {
      getAiFeedback(currentInput);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [currentInput, geminiApiKey]);

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

    const studentResponse = await getStudentQuestion(newMessage.content);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'student',
      content: studentResponse,
      timestamp: new Date()
    }]);

    setIsLoading(false);
  };

  const handleFinishTeaching = () => {
    const teachingData = {
      category,
      messages,
      timestamp: new Date(),
      completed: true
    };
    
    const existingSessions = JSON.parse(localStorage.getItem('teachingSessions') || '[]');
    localStorage.setItem('teachingSessions', JSON.stringify([...existingSessions, teachingData]));
    
    navigate('/feedback', { state: { teachingData } });
  };

  const handleStartListening = () => {
    startListening((transcript: string) => {
      setCurrentInput(transcript);
    });
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
          <StudentSection 
            phase={phase}
            studentMood={studentMood}
            onFinishTeaching={handleFinishTeaching}
          />

          <AIFeedbackPanel 
            geminiApiKey={geminiApiKey}
            isGettingFeedback={isGettingFeedback}
            aiFeedback={aiFeedback}
          />

          <ChatInterface 
            messages={messages}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            phase={phase}
            isListening={isListening}
            onStartListening={handleStartListening}
            onStopListening={stopListening}
            hasSpeechRecognition={recognition}
          />
        </div>
      </div>
    </div>
  );
};

export default TeachingPage;
