import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff } from "lucide-react";
import { ChatMessage, TeachingPhase } from "@/types/teaching";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  currentInput: string;
  setCurrentInput: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  phase: TeachingPhase;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  hasSpeechRecognition: boolean;
}

const ChatInterface = ({
  messages,
  currentInput,
  setCurrentInput,
  onSendMessage,
  isLoading,
  phase,
  isListening,
  onStartListening,
  onStopListening,
  hasSpeechRecognition
}: ChatInterfaceProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentInput.trim() && !isLoading) {
        onSendMessage();
      }
    }
  };

  return (
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
                onKeyDown={handleKeyDown}
                className="min-h-[100px] pr-12"
                disabled={isLoading}
              />
              {hasSpeechRecognition && (
                <Button
                  onClick={isListening ? onStopListening : onStartListening}
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
                onClick={onSendMessage}
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
  );
};

export default ChatInterface;