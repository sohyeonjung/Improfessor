import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 윈도우 포커스시 자동으로 재요청하지 않음
      retry: 1, // 실패시 재시도 횟수
      staleTime: 5 * 60 * 1000, // 5분동안 캐시 유지
    },
  },
}); 