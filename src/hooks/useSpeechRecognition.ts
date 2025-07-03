import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ko-KR';
      
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
  }, []);

  const startListening = (onResult: (transcript: string) => void) => {
    if (recognition) {
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    recognition: !!recognition,
    startListening,
    stopListening
  };
};