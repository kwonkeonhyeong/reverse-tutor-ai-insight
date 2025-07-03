import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import StudentAnimation from "@/components/StudentAnimation";
import { StudentMood, TeachingPhase } from "@/types/teaching";

interface StudentSectionProps {
  phase: TeachingPhase;
  studentMood: StudentMood;
  onFinishTeaching: () => void;
}

const StudentSection = ({ phase, studentMood, onFinishTeaching }: StudentSectionProps) => {
  return (
    <div className="space-y-4">
      <StudentAnimation 
        isListening={phase !== 'initial'} 
        mood={studentMood}
      />
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <h3 className="font-semibold text-blue-800 mb-2">교육 진행 중</h3>
          <p className="text-sm text-blue-700 mb-4">
            언제든지 교육을 종료할 수 있습니다
          </p>
          <Button 
            onClick={onFinishTeaching}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            교육 종료하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSection;