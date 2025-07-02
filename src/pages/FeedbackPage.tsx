import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Lightbulb, ArrowRight, Home, BookOpen } from "lucide-react";

const categoryNames: { [key: string]: string } = {
  mathematics: "수학",
  science: "과학",
  history: "역사",
  economics: "경제",
  computer_science: "컴퓨터과학",
  language: "언어"
};

const FeedbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const teachingData = location.state?.teachingData;
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (teachingData) {
      generateAIFeedback();
    }
  }, [teachingData]);

  const generateAIFeedback = async () => {
    const geminiApiKey = localStorage.getItem('geminiApiKey');
    
    if (!geminiApiKey) {
      // Fallback to mock data if no API key
      setTimeout(() => {
        const mockFeedback = {
          overallScore: Math.floor(Math.random() * 31) + 70,
          strengths: [
            "명확하고 이해하기 쉬운 설명",
            "체계적인 내용 구성",
            "학생의 질문에 적절한 답변"
          ],
          improvements: [
            "구체적인 예시를 더 많이 활용하세요",
            "학생의 이해도를 더 자주 확인해보세요",
            "개념 간의 연결고리를 더 명확히 설명하세요"
          ],
          suggestions: [
            "미분과 적분의 기본 개념",
            "실생활 응용 사례",
            "관련 수학 공식의 증명 과정"
          ]
        };
        setFeedback(mockFeedback);
        setIsLoading(false);
      }, 2000);
      return;
    }

    try {
      const conversationText = teachingData.messages
        .map((m: any) => `${m.type === 'teacher' ? '선생님' : '학생'}: ${m.content}`)
        .join('\n');

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `다음은 ${categoryNames[teachingData.category]} 분야의 교육 세션입니다. 이 교육 내용을 분석하여 피드백을 제공해주세요.

대화 내용:
${conversationText}

다음 형식으로 JSON 응답해주세요:
{
  "strengths": ["강점1", "강점2", "강점3"],
  "improvements": ["개선점1", "개선점2", "개선점3"],
  "suggestions": ["추천 학습 주제1", "추천 학습 주제2", "추천 학습 주제3"]
}

각 항목은 구체적이고 실용적인 조언으로 작성해주세요.`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        try {
          // Try to parse JSON response
          const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedFeedback = JSON.parse(jsonMatch[0]);
            setFeedback({
              overallScore: Math.floor(Math.random() * 31) + 70, // Keep random score for now
              strengths: parsedFeedback.strengths || [],
              improvements: parsedFeedback.improvements || [],
              suggestions: parsedFeedback.suggestions || []
            });
          } else {
            throw new Error('JSON 파싱 실패');
          }
        } catch (parseError) {
          console.error('AI 응답 파싱 실패:', parseError);
          // Fallback to mock data
          setFeedback({
            overallScore: Math.floor(Math.random() * 31) + 70,
            strengths: ["AI 응답을 파싱할 수 없어 기본 피드백을 제공합니다"],
            improvements: ["더 구체적인 설명이 필요합니다"],
            suggestions: ["기본 개념 복습을 권장합니다"]
          });
        }
      } else {
        throw new Error('API 응답 실패');
      }
    } catch (error) {
      console.error('Gemini API 오류:', error);
      // Fallback to mock data
      setFeedback({
        overallScore: Math.floor(Math.random() * 31) + 70,
        strengths: [
          "명확하고 이해하기 쉬운 설명",
          "체계적인 내용 구성",
          "학생의 질문에 적절한 답변"
        ],
        improvements: [
          "구체적인 예시를 더 많이 활용하세요",
          "학생의 이해도를 더 자주 확인해보세요",
          "개념 간의 연결고리를 더 명확히 설명하세요"
        ],
        suggestions: [
          "미분과 적분의 기본 개념",
          "실생활 응용 사례",
          "관련 수학 공식의 증명 과정"
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">AI가 교육 내용을 분석하고 있습니다...</p>
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
                <BookOpen className="w-8 h-8 text-white" />
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
          {/* Overview */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                교육 성과 분석
                <Badge variant="secondary" className="ml-2">
                  {categoryNames[teachingData.category]}
                </Badge>
              </CardTitle>
              <CardDescription className="text-base mt-2">
                총 {teachingData.messages.filter((m: any) => m.type === 'teacher').length}번의 설명을 분석했습니다
              </CardDescription>
            </CardHeader>
          </Card>

          {/* AI 학생을 교육한 대화 내역 */}
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                <Lightbulb className="w-5 h-5" />
                AI 학생을 교육한 대화 내역
              </CardTitle>
              <CardDescription>
                선생님(나)와 AI 학생이 주고받은 모든 대화 내역입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teachingData.messages.map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className={`flex ${m.type === 'teacher' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xl p-3 rounded-lg ${
                        m.type === 'teacher'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800 border'
                      }`}
                    >
                      <div className="text-sm">{m.content}</div>
                      <div className="text-xs mt-1 text-right opacity-60">
                        {m.type === 'teacher' ? '선생님' : '학생'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
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
                  {feedback.strengths.map((item: string, index: number) => (
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
                  {feedback.improvements.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-amber-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

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
                {feedback.suggestions.map((step: string, index: number) => (
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
