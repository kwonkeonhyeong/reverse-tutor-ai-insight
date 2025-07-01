
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Beaker, Clock, TrendingUp, Monitor, Book } from "lucide-react";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const categories = [
  {
    id: "mathematics",
    name: "수학",
    description: "대수, 기하, 미적분, 통계 등",
    icon: Calculator,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "science",
    name: "과학",
    description: "물리, 화학, 생물학, 지구과학",
    icon: Beaker,
    color: "from-green-500 to-green-600"
  },
  {
    id: "history",
    name: "역사",
    description: "한국사, 세계사, 문화사",
    icon: Clock,
    color: "from-amber-500 to-amber-600"
  },
  {
    id: "economics",
    name: "경제",
    description: "미시경제, 거시경제, 금융",
    icon: TrendingUp,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "computer_science",
    name: "컴퓨터과학",
    description: "프로그래밍, 알고리즘, 데이터구조",
    icon: Monitor,
    color: "from-cyan-500 to-cyan-600"
  },
  {
    id: "language",
    name: "언어",
    description: "국어, 영어, 문법, 작문",
    icon: Book,
    color: "from-rose-500 to-rose-600"
  }
];

const CategorySelector = ({ selectedCategory, onCategorySelect }: CategorySelectorProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">학습 분야를 선택해주세요</CardTitle>
        <CardDescription>
          설명하고 싶은 지식의 영역을 선택하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                `}
              >
                <div className={`
                  w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r ${category.color} 
                  flex items-center justify-center
                `}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`font-semibold mb-1 ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 leading-tight">
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySelector;
