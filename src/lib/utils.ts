// JWT 토큰 디코딩 함수
export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('토큰 디코딩 실패:', error);
    return null;
  }
};

// localStorage에서 userId 가져오기 (aud 필드 사용)
export const getUserIdFromToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;
  
  const decoded = decodeToken(accessToken);
  // aud 필드가 사용자 ID
  return decoded?.aud || null;
}; 