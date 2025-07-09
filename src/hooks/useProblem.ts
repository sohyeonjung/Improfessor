import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { GenerateProblemResponse, GenerateProblemRequest, Problem } from '@/types/problem';
import { useUser } from '@/context/UserContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const useProblem = () => {
  const { user } = useUser();

  // 문제 생성
  const useGenerateProblem = () => {
    return useMutation({
      mutationFn: async ({ conceptFiles, formatFiles }: GenerateProblemRequest) => {
        const formData = new FormData();
        
        // conceptFiles 추가
        conceptFiles.forEach((file) => {
          formData.append('conceptFiles', file);
        });

        // formatFiles가 있는 경우 추가
        if (formatFiles) {
          formatFiles.forEach((file) => {
            formData.append('formatFiles', file);
          });
        }

        const response = await axiosInstance.post(`/api/problems/${user?.userId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data as GenerateProblemResponse;
      },
    });
  };

  // 기존 서버 PDF 다운로드 (임시 주석 처리)
  // const downloadProblemPDF = async (downloadKey: string) => {
  //   try {
  //     const response = await axiosInstance.get(`/api/problems/download/${downloadKey}`, {
  //       responseType: 'blob',
  //     });
      
  //     // Blob 생성 및 다운로드
  //     const blob = new Blob([response.data], { type: 'application/pdf' });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = `problems_${downloadKey}.pdf`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error('PDF 다운로드 실패:', error);
  //     throw error;
  //   }
  // };

  // 클라이언트 사이드 PDF 생성 및 다운로드
  const downloadProblemPDF = async (problems: Problem[]) => {
    try {
      // 임시 HTML 요소 생성
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '40px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '14px';
      tempDiv.style.lineHeight = '1.6';
      
      // HTML 내용 생성
      let htmlContent = `
        <div style="margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333;">
            생성된 문제
          </h1>
        </div>
      `;

      problems.forEach((problem) => {
        htmlContent += `
          <div style="margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333;">
              문제 ${problem.number}
            </h3>
            
            <div style="margin-bottom: 15px;">
              <h4 style="font-weight: bold; margin-bottom: 8px; color: #555;">문제 내용</h4>
              <p style="color: #333; white-space: pre-wrap;">${problem.content}</p>
            </div>
            
            ${problem.description ? `
              <div style="margin-bottom: 15px;">
                <h4 style="font-weight: bold; margin-bottom: 8px; color: #555;">설명</h4>
                <p style="color: #333; white-space: pre-wrap;">${problem.description}</p>
              </div>
            ` : ''}
            
            <div>
              <h4 style="font-weight: bold; margin-bottom: 8px; color: #555;">정답</h4>
              <p style="color: #333; white-space: pre-wrap;">${problem.answer}</p>
            </div>
          </div>
        `;
      });

      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);

      // HTML을 캔버스로 변환
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // 캔버스를 PDF로 변환
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 너비
      const pageHeight = 295; // A4 높이
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 임시 요소 제거
      document.body.removeChild(tempDiv);

      // PDF 다운로드
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      pdf.save(`problems_${timestamp}.pdf`);
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      throw error;
    }
  };

  return {
    useGenerateProblem,
    downloadProblemPDF,
  };
};

export default useProblem; 