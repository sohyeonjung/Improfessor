import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { GenerateProblemResponse, GenerateProblemRequest } from '@/types/problem';

export const useProblem = () => {
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

        const response = await axiosInstance.post('/api/problems', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data as GenerateProblemResponse;
      },
    });
  };

  // PDF 다운로드
  const downloadProblemPDF = async (downloadKey: string) => {
    try {
      const response = await axiosInstance.get(`/api/problems/download/${downloadKey}`, {
        responseType: 'blob',
      });
      
      // Blob 생성 및 다운로드
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `problems_${downloadKey}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF 다운로드 실패:', error);
      throw error;
    }
  };

  return {
    useGenerateProblem,
    downloadProblemPDF,
  };
};

export default useProblem; 