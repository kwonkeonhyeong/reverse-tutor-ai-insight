
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Users, Lightbulb } from "lucide-react";
import CategorySelector from "@/components/CategorySelector";
import ExplanationInput from "@/components/ExplanationInput";
import FeedbackDisplay from "@/components/FeedbackDisplay";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCategory || !explanation.trim()) return;
    
    setIsLoading(true);
    // Simulate AI feedback generation
    setTimeout(() => {
      const mockFeedback = {
        correctContent: [
          "기본 개념에 대한 이해가 잘 되어 있습니다.",
          "핵심 원리를 정확하게 파악하고 있어요."
        ],
        incorrectContent: [
          "일부 세부사항에서 오해가 있는 것 같습니다.",
          "연관 개념과의 관계를 다시 정리해보세요."
        ],
        improvements: [
          "더 구체적인 예시를 들어 설명해보세요.",
          "반대 상황에서는 어떻게 적용되는지 생각해보세요."
        ],
        nextSteps: [
          "고급 응용 문제 해결",
          "실생활 적용 사례 탐구",
          "관련 심화 개념 학습"
        ]
      };
      setFeedback(mockFeedback);
      setIsLoading(false);
    }, 2000);
  };

  const resetForm = () => {
    setSelectedCategory("");
    setExplanation("");
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">역방향 튜터링</h1>
              <p className="text-gray-600">당신의 지식을 설명하고 AI 피드백을 받아보세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        {!selectedCategory && !feedback && (
          <div className="text-center mb-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                학습의 새로운 방향을 경험하세요
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                당신이 알고 있는 지식을 설명해주세요. AI가 정확한 피드백과 함께 다음 학습 단계를 제안해드립니다.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="font-semibold mb-2">설명하기</h3>
                  <p className="text-sm text-gray-600">본인의 지식을 자유롭게 설명해보세요</p>
                </Card>
                
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <Users className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="font-semibold mb-2">피드백 받기</h3>
                  <p className="text-sm text-gray-600">AI가 상세한 분석과 피드백을 제공합니다</p>
                </Card>
                
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                  <h3 className="font-semibold mb-2">성장하기</h3>
                  <p className="text-sm text-gray-600">다음 학습 단계로 발전해나가세요</p>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!feedback ? (
            <div className="space-y-8">
              <CategorySelector 
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
              
              {selectedCategory && (
                <ExplanationInput
                  explanation={explanation}
                  onExplanationChange={setExplanation}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  selectedCategory={selectedCategory}
                />
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <FeedbackDisplay 
                feedback={feedback}
                category={selectedCategory}
                explanation={explanation}
              />
              
              <div className="text-center">
                <Button 
                  onClick={resetForm}
                  variant="outline"
                  size="lg"
                  className="bg-white hover:bg-gray-50"
                >
                  새로운 설명 시작하기
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
