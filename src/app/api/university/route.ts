import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const universityId = searchParams.get('universityId');
  const page = searchParams.get('page') || '1';
  const type = searchParams.get('type') || 'university';

  const API_KEY = 'qqE4EUYf7PqLHIAzLTlLONl%2BDy%2BQ0HSFXzz9rRHcRCxmwCMilL8Of9ay7py2Fc%2FUWx%2BHMHHV7GGLvEeZMhgHLA%3D%3D';

  try {
    const baseUrl = 'http://openapi.academyinfo.go.kr/openapi/service/rest/SchoolMajorInfoService/getSchoolMajorInfo';
    const params = new URLSearchParams();
    
    // API 키는 이미 인코딩되어 있으므로 직접 추가
    params.append('serviceKey', API_KEY);
    params.append('pageNo', page);
    params.append('numOfRows', type === 'university' ? '20' : '50');
    params.append('svyYr', '2025');

    if (type === 'university' && keyword) {
      params.append('schlKrnNm', keyword);
    } else if (type === 'major' && universityId) {
      params.append('schlId', universityId);
    }

    // URL을 직접 구성하여 이중 인코딩 방지
    const requestUrl = `${baseUrl}?serviceKey=${API_KEY}&pageNo=${page}&numOfRows=${type === 'university' ? '20' : '50'}&svyYr=2025`;
    
    // 추가 파라미터가 있으면 추가
    const finalUrl = type === 'university' && keyword 
      ? `${requestUrl}&schlKrnNm=${encodeURIComponent(keyword)}`
      : type === 'major' && universityId
      ? `${requestUrl}&schlId=${encodeURIComponent(universityId)}`
      : requestUrl;

    console.log('=== 공공데이터 API 요청 정보 ===');
    console.log('요청 URL:', finalUrl);
    console.log('API 키 (디코딩):', decodeURIComponent(API_KEY));
    console.log('================================');

    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log('공공데이터 API 응답:', xmlText.substring(0, 500) + '...');
    
    return new NextResponse(xmlText, {
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('대학교 API 호출 실패:', error);
    return NextResponse.json(
      { error: 'API 호출에 실패했습니다.' },
      { status: 500 }
    );
  }
} 