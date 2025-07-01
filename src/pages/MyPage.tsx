
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Home, Calendar, BookOpen, MessageCircle, Eye } from "lucide-react";

const categoryNames: { [key: string]: string } = {
  mathematics: "수학",
  science: "과학",
  history: "역사",
  economics: "경제",
  computer_science: "컴퓨터과학",
  language: "언어"
};

interface TeachingSession {
  category: string;
  messages: any[];
  timestamp: Date;
  completed: boolean;
}

const MyPage = () => {
  const navigate = useNavigate();
  const [teachingSessions, setTeachingSessions] = useState<TeachingSession[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Load teaching sessions from localStorage
    const sessions = JSON.parse(localStorage.getItem('teachingSessions') || '[]');
    setTeachingSessions(sessions.map((session: any) => ({
      ...session,
      timestamp: new Date(session.timestamp)
    })));
  }, []);

  const filteredSessions = selectedCategory === 'all' 
    ? teachingSessions 
    : teachingSessions.filter(session => session.category === selectedCategory);

  const categoryStats = Object.keys(categoryNames).map(category => {
    const sessions = teachingSessions.filter(session => session.category === category);
    return {
      category,
      name: categoryNames[category],
      count: sessions.length
    };
  }).filter(stat => stat.count > 0);

  const totalSessions = teachingSessions.length;

  const handleViewFeedback = (session: TeachingSession) => {
    navigate('/feedback', { state: { teachingData: session } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
                <p className="text-gray-600">나의 교육 기록과 성장 과정을 확인해보세요</p>
              </div>
            </div>
            <Button onClick={() => navigate('/')} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              홈으로 가기
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Overview Statistics */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <div className="text-2xl font-bold text-gray-900 mb-2">{totalSessions}</div>
                <div className="text-gray-600">총 교육 세션</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <div className="text-2xl font-bold text-gray-900 mb-2">{categoryStats.length}</div>
                <div className="text-gray-600">학습 분야</div>
              </CardContent>
            </Card>
          </div>

          {/* Category Performance */}
          {categoryStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>분야별 교육 현황</CardTitle>
                <CardDescription>각 학습 분야에서의 교육 활동 현황입니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryStats.map((stat) => (
                    <div key={stat.category} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{stat.name}</Badge>
                        <span className="text-lg font-semibold text-blue-600">{stat.count}회</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        교육 완료
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Teaching History */}
          <Card>
            <CardHeader>
              <CardTitle>교육 기록</CardTitle>
              <CardDescription>지금까지의 모든 교육 세션을 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                  <TabsTrigger value="all">전체</TabsTrigger>
                  {Object.entries(categoryNames).map(([key, name]) => (
                    <TabsTrigger key={key} value={key} className="text-xs">
                      {name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={selectedCategory} className="mt-6">
                  {filteredSessions.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        {selectedCategory === 'all' ? '아직 교육 기록이 없습니다' : `${categoryNames[selectedCategory]} 교육 기록이 없습니다`}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        새로운 교육을 시작해보세요!
                      </p>
                      <Button onClick={() => navigate('/')}>
                        교육 시작하기
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredSessions.map((session, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline">
                                  {categoryNames[session.category]}
                                </Badge>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Calendar className="w-4 h-4" />
                                  {session.timestamp.toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant={session.completed ? "default" : "secondary"}>
                                  {session.completed ? "완료" : "진행중"}
                                </Badge>
                                <Button
                                  onClick={() => handleViewFeedback(session)}
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  피드백 보기
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">총 메시지: </span>
                                <span className="font-semibold">{session.messages.length}개</span>
                              </div>
                              <div>
                                <span className="text-gray-600">교육 시간: </span>
                                <span className="font-semibold">
                                  {session.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                            
                            {session.messages.length > 0 && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700 line-clamp-2">
                                  첫 설명: {session.messages.find(m => m.type === 'teacher')?.content || '내용 없음'}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
