import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { GenerateProblemResponse, GenerateProblemRequest, Problem } from '@/types/problem';
import { useUser } from '@/context/UserContext';
import jsPDF from 'jspdf';

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
      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const lineHeight = 7;
      const titleHeight = 10;

      // 제목 추가
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('생성된 문제', margin, yPosition);
      yPosition += titleHeight + 10;

      problems.forEach((problem) => {
        // 페이지 넘침 체크
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }

        // 문제 번호
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`문제 ${problem.number}`, margin, yPosition);
        yPosition += titleHeight;

        // 문제 내용
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const contentLines = doc.splitTextToSize(`문제 내용: ${problem.content}`, 170);
        contentLines.forEach((line: string) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += lineHeight;
        });

        // 설명이 있는 경우
        if (problem.description) {
          yPosition += 5;
          const descLines = doc.splitTextToSize(`설명: ${problem.description}`, 170);
          descLines.forEach((line: string) => {
            if (yPosition > pageHeight - 40) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, margin, yPosition);
            yPosition += lineHeight;
          });
        }

        // 정답
        yPosition += 5;
        const answerLines = doc.splitTextToSize(`정답: ${problem.answer}`, 170);
        answerLines.forEach((line: string) => {
          if (yPosition > pageHeight - 40) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += lineHeight;
        });

        // 문제 간 간격
        yPosition += 15;
      });

      // PDF 다운로드
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      doc.save(`problems_${timestamp}.pdf`);
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