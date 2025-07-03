import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { NoticeResponse, NoticeDetailResponse, CreateNoticeRequest } from '@/types/notice';

export const useNotice = () => {
  // 공지사항 목록 조회
  const useNoticeList = () => {
    return useQuery<NoticeResponse>({
      queryKey: ['notices'],
      queryFn: async () => {
        const response = await axiosInstance.get('/api/notices');
        return response.data;
      },
    });
  };

  // 공지사항 상세 조회
  const useNoticeDetail = (noticeId: number) => {
    return useQuery<NoticeDetailResponse>({
      queryKey: ['notice', noticeId],
      queryFn: async () => {
        const response = await axiosInstance.get(`/api/notices/${noticeId}`);
        return response.data;
      },
      enabled: !!noticeId,
    });
  };

  // 공지사항 생성
  const useCreateNotice = () => {
    return useMutation({
      mutationFn: async (data: CreateNoticeRequest) => {
        const response = await axiosInstance.post('/api/notices', data);
        return response.data;
      },
    });
  };

  // 공지사항 수정
  const useUpdateNotice = () => {
    return useMutation({
      mutationFn: async ({ noticeId, data }: { noticeId: number; data: CreateNoticeRequest }) => {
        const response = await axiosInstance.patch(`/api/notices/${noticeId}`, data);
        return response.data;
      },
    });
  };

  // 공지사항 삭제
  const useDeleteNotice = () => {
    return useMutation({
      mutationFn: async (noticeId: number) => {
        const response = await axiosInstance.delete(`/api/notices/${noticeId}`);
        return response.data;
      },
    });
  };

  return {
    useNoticeList,
    useNoticeDetail,
    useCreateNotice,
    useUpdateNotice,
    useDeleteNotice,
  };
};

export default useNotice; 