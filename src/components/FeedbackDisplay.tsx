
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Lightbulb, ArrowRight, TrendingUp } from "lucide-react";

interface FeedbackDisplayProps {
  feedback: {
    correctContent: string[];
    incorrectContent: string[];
    improvements: string[];
    nextSteps: string[];
  };
  category: string;
  explanation: string;
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

const FeedbackDisplay = ({ feedback, category, explanation }: FeedbackDisplayProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            AI 피드백 결과
            <Badge variant="secondary" className="ml-2">
              {categoryNames[category]}
            </Badge>
          </CardTitle>
          <CardDescription className="text-base">
            당신의 설명을 분석한 결과입니다. 각 항목을 확인하고 학습에 활용해보세요.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Your Explanation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">작성하신 설명</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {explanation.length > 200 ? `${explanation.substring(0, 200)}...` : explanation}
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span>총 {explanation.length}자</span>
              <span>•</span>
              <span>분석 완료</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Correct Content */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              잘 알고 계신 내용
            </CardTitle>
            <CardDescription>
              정확하게 이해하고 있는 부분들입니다
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

        {/* Incorrect Content */}
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              개선이 필요한 내용
            </CardTitle>
            <CardDescription>
              다시 한 번 확인해보면 좋을 부분들입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {feedback.incorrectContent.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-red-800">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Improvements */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
            <Lightbulb className="w-5 h-5" />
            보완하면 더 좋을 점
          </CardTitle>
          <CardDescription>
            설명을 더욱 풍성하게 만들 수 있는 제안사항들입니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {feedback.improvements.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-amber-800">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Next Steps */}
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
    </div>
  );
};

export default FeedbackDisplay;
