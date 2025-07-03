export interface ChatMessage {
  id: string;
  type: 'student' | 'teacher';
  content: string;
  timestamp: Date;
}

export type TeachingPhase = 'initial' | 'teaching' | 'questions' | 'completed';

export type StudentMood = 'neutral' | 'thinking' | 'excited' | 'confused';

export const categoryNames: { [key: string]: string } = {
  mathematics: "수학",
  science: "과학",
  history: "역사",
  economics: "경제",
  computer_science: "컴퓨터과학",
  language: "언어"
};

export const categoryQuestions: { [key: string]: string[] } = {
  mathematics: [
    "미분과 적분의 관계를 좀 더 자세히 설명해주실 수 있나요?",
    "이 공식을 실제 문제에 어떻게 적용할 수 있을까요?",
    "혹시 이와 비슷한 다른 수학 개념이 있나요?"
  ],
  science: [
    "이 현상이 일어나는 과학적 원리를 더 구체적으로 알려주세요",
    "일상생활에서 볼 수 있는 비슷한 예가 있을까요?",
    "이 실험 결과를 어떻게 해석해야 하나요?"
  ],
  history: [
    "이 사건이 당시 사회에 미친 영향은 무엇인가요?",
    "비슷한 시기의 다른 나라 상황과 비교하면 어떨까요?",
    "현재 우리에게 주는 교훈은 무엇일까요?"
  ],
  economics: [
    "이 경제 이론이 실제 시장에서는 어떻게 작동하나요?",
    "현재 경제 상황에 이 개념을 적용하면 어떨까요?",
    "다른 경제 지표와는 어떤 관계가 있나요?"
  ],
  computer_science: [
    "이 알고리즘의 시간 복잡도는 어떻게 되나요?",
    "실제 프로젝트에서 이 기술을 어떻게 활용할 수 있을까요?",
    "다른 프로그래밍 언어에서는 어떻게 구현하나요?"
  ],
  language: [
    "이 문법 규칙의 예외 상황은 언제인가요?",
    "원어민들은 실제로 어떻게 사용하나요?",
    "비슷한 의미의 다른 표현 방법이 있나요?"
  ]
};