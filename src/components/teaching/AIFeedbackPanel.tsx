import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AIFeedbackPanelProps {
  geminiApiKey: string;
  isGettingFeedback: boolean;
  aiFeedback: string;
}

const AIFeedbackPanel = ({ geminiApiKey, isGettingFeedback, aiFeedback }: AIFeedbackPanelProps) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default AIFeedbackPanel;