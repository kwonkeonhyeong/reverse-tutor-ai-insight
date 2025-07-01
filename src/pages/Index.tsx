
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Users, Lightbulb, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategorySelector from "@/components/CategorySelector";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();

  const handleStartTeaching = () => {
    if (selectedCategory) {
      navigate(`/teach/${selectedCategory}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">역방향 튜터링</h1>
                <p className="text-gray-600">당신의 지식을 설명하고 AI 피드백을 받아보세요</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/mypage')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              마이페이지
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
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

        {/* Category Selection */}
        <div className="max-w-4xl mx-auto space-y-8">
          <CategorySelector 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          
          {selectedCategory && (
            <div className="text-center">
              <Button 
                onClick={handleStartTeaching}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-3 text-lg"
              >
                가르치기 시작하기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
