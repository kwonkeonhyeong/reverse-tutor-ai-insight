
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Lightbulb, ArrowRight, TrendingUp, Home, BookOpen } from "lucide-react";

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

const FeedbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const teachingData = location.state?.teachingData;

  // Mock feedback data - in real app, this would come from AI analysis
  const feedback = {
    correctContent: [
      "핵심 개념에 대한 기본 이해가 탄탄합니다",
      "학생의 질문에 대한 답변이 논리적이고 체계적이었습니다",
      "복잡한 내용을 쉽게 설명하는 능력이 뛰어납니다"
    ],
    incorrectContent: [
      "일부 전문용어의 정확한 정의가 부족했습니다",
      "예시와 실제 적용 사례를 더 구체적으로 제시하면 좋겠습니다"
    ],
    improvements: [
      "학습자의 수준을 고려한 단계별 설명 구성",
      "시각적 자료나 도표를 활용한 설명 보완",
      "개념 간의 연관성을 더욱 명확하게 설명"
    ],
    nextSteps: [
      "심화 개념 학습 및 이론 보강",
      "다양한 문제 해결 사례 연구",
      "교수법 및 의사소통 스킬 향상",
      "관련 최신 연구 동향 파악"
    ]
  };

  const overallScore = 85;

  if (!teachingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">피드백 데이터를 찾을 수 없습니다.</p>
            <Button onClick={() => navigate('/')}>
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">교육 피드백</h1>
                <p className="text-gray-600">당신의 교육 능력을 분석한 결과입니다</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/')} variant="outline">
                <Home className="w-4 h-4 mr-2" />
                홈
              </Button>
              <Button onClick={() => navigate('/mypage')} variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                마이페이지
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Score Overview */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    교육 성과 분석
                    <Badge variant="secondary" className="ml-2">
                      {categoryNames[teachingData.category]}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    총 {teachingData.messages.filter((m: any) => m.type === 'teacher').length}번의 설명을 분석했습니다
                  </CardDescription>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-1">{overallScore}점</div>
                  <div className="text-sm text-gray-600">종합 점수</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  잘하신 부분
                </CardTitle>
                <CardDescription>
                  교육 과정에서 특히 우수했던 점들입니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feedback.correctContent.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-green-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                  <XCircle className="w-5 h-5" />
                  개선할 부분
                </CardTitle>
                <CardDescription>
                  더 나은 교육을 위해 보완하면 좋을 점들입니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feedback.incorrectContent.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-amber-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Improvement Suggestions */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                <Lightbulb className="w-5 h-5" />
                개선 제안사항
              </CardTitle>
              <CardDescription>
                교육 효과를 높이기 위한 구체적인 제안들입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {feedback.improvements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-blue-800">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Next Learning Steps */}
          <Card className="border-purple-200 bg-purple-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                <ArrowRight className="w-5 h-5" />
                다음 학습 단계
              </CardTitle>
              <CardDescription>
                더 깊이 있는 학습을 위한 추천 주제들입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {feedback.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-purple-800 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              size="lg"
            >
              새로운 교육 시작하기
            </Button>
            <Button 
              onClick={() => navigate('/mypage')}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              교육 기록 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
