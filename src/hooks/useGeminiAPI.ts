import { useState, useEffect } from 'react';

export const useGeminiAPI = (geminiApiKey: string) => {
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);

  const getAiFeedback = async (content: string) => {
    if (!geminiApiKey) return;
    setIsGettingFeedback(true);
    try {
      const prompt = `아래의 설명에 대해 논리적, 사실적 오류가 있다면 지적해주고, 개선점을 50자 이내로 알려주세요.\n설명: "${content}"`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (response.ok) {
        const data = await response.json();
        const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        setAiFeedback(feedback);
      } else {
        setAiFeedback('피드백을 가져올 수 없습니다.');
      }
    } catch (error) {
      setAiFeedback('피드백을 가져올 수 없습니다.');
    } finally {
      setIsGettingFeedback(false);
    }
  };

  const getStudentQuestion = async (content: string): Promise<string> => {
    if (!geminiApiKey) return '질문을 생성할 수 없습니다.';
    try {
      const prompt = `아래는 선생님의 설명입니다. 설명을 들은 학생이 실제로 말하는 것처럼 자연스럽고 친근하게 반응해 주고, 이어서 학생이 정말 궁금한 핵심 질문 한 가지만 해 주세요.\n\n설명: "${content}"`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '질문을 생성할 수 없습니다.';
      } else {
        return '질문을 생성할 수 없습니다.';
      }
    } catch (error) {
      return '질문을 생성할 수 없습니다.';
    }
  };

  return {
    aiFeedback,
    setAiFeedback,
    isGettingFeedback,
    getAiFeedback,
    getStudentQuestion
  };
};