import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateFeedbackPDF = (element: HTMLElement, fileName: string) => {
  html2canvas(element, {
    useCORS: true,
    scale: 2, // 고해상도 이미지 생성
    backgroundColor: '#ffffff', // 배경색을 흰색으로 명시
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pdfWidth - 20; // 여백 고려
    const imgHeight = imgWidth / ratio;
    
    let heightLeft = imgHeight;
    let position = 10; // 상단 여백

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - 20);

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10; // 다음 페이지 위치 조정
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);
    }
    
    pdf.save(fileName);
  });
};
