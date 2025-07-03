import jsPDF from 'jspdf';

interface FeedbackData {
  category: string;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  messages: Array<{
    type: 'teacher' | 'student';
    content: string;
    timestamp: Date;
  }>;
}

const categoryNames: { [key: string]: string } = {
  mathematics: "수학",
  science: "과학", 
  history: "역사",
  economics: "경제",
  computer_science: "컴퓨터과학",
  language: "언어"
};

export const generateFeedbackPDF = (feedbackData: FeedbackData) => {
  const pdf = new jsPDF();
  
  // Set font for Korean support (basic)
  pdf.setFont('helvetica');
  
  let yPosition = 20;
  const lineHeight = 10;
  const pageHeight = pdf.internal.pageSize.height;
  
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(fontSize);
    if (isBold) {
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }
    
    const lines = pdf.splitTextToSize(text, 170);
    lines.forEach((line: string) => {
      pdf.text(line, 20, yPosition);
      yPosition += lineHeight;
    });
    yPosition += 5;
  };

  // Title
  addText('교육 피드백 보고서', 20, true);
  addText(`과목: ${categoryNames[feedbackData.category]}`, 14, true);
  addText(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, 12);
  yPosition += 10;

  // Teaching conversation
  addText('교육 대화 내역', 16, true);
  feedbackData.messages.forEach((message, index) => {
    const speaker = message.type === 'teacher' ? '선생님' : '학생';
    addText(`${speaker}: ${message.content}`, 10);
  });
  yPosition += 10;

  // Strengths
  addText('잘하신 부분', 16, true);
  feedbackData.strengths.forEach((strength, index) => {
    addText(`${index + 1}. ${strength}`, 12);
  });
  yPosition += 10;

  // Improvements
  addText('개선할 부분', 16, true);
  feedbackData.improvements.forEach((improvement, index) => {
    addText(`${index + 1}. ${improvement}`, 12);
  });
  yPosition += 10;

  // Suggestions
  addText('다음 학습 단계', 16, true);
  feedbackData.suggestions.forEach((suggestion, index) => {
    addText(`${index + 1}. ${suggestion}`, 12);
  });

  // Save the PDF
  const fileName = `교육피드백_${categoryNames[feedbackData.category]}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};