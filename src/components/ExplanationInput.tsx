
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2 } from "lucide-react";

interface ExplanationInputProps {
  explanation: string;
  onExplanationChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  selectedCategory: string;
}

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

const ExplanationInput = ({ 
  explanation, 
  onExplanationChange, 
  onSubmit, 
  isLoading, 
  selectedCategory 
}: ExplanationInputProps) => {
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (value: string) => {
    onExplanationChange(value);
    setWordCount(value.length);
  };

  const isSubmitDisabled = explanation.trim().length < 50 || isLoading;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              지식을 설명해주세요
              <Badge variant="secondary" className="ml-2">
                {categoryNames[selectedCategory]}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-2">
              당신이 알고 있는 개념, 원리, 이론 등을 자세히 설명해주세요. 
              더 구체적이고 상세할수록 정확한 피드백을 받을 수 있습니다.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="예시: 피타고라스 정리는 직각삼각형에서 빗변의 제곱이 나머지 두 변의 제곱의 합과 같다는 정리입니다. 수식으로 표현하면 a² + b² = c²이며, 여기서 c는 빗변을 의미합니다..."
            value={explanation}
            onChange={(e) => handleTextChange(e.target.value)}
            className="min-h-[200px] text-base leading-relaxed resize-none"
            disabled={isLoading}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {wordCount}자
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {explanation.length < 50 ? (
              <span className="text-amber-600">
                최소 50자 이상 작성해주세요 ({50 - explanation.length}자 더 필요)
              </span>
            ) : (
              <span className="text-green-600">
                충분한 길이입니다. 피드백을 받을 준비가 되었어요!
              </span>
            )}
          </div>
          
          <Button
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                AI가 분석 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                피드백 받기
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExplanationInput;
