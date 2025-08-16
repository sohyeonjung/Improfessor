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

  const API_KEY = 'qqE4EUYf7PqLHIAzLTlLONl+Dy+Q0HSFXzz9rRHcRCxmwCMilL8Of9ay7py2Fc/UWx+HMHHV7GGLvEeZMhgHLA==';

  try {
    const baseUrl = 'http://openapi.academyinfo.go.kr/openapi/service/rest/SchoolMajorInfoService/getSchoolMajorInfo';
    const params = new URLSearchParams({
      serviceKey: API_KEY,
      pageNo: page,
      numOfRows: type === 'university' ? '20' : '50',
      svyYr: '2025'
    });

    if (type === 'university' && keyword) {
      params.append('schlKrnNm', keyword);
    } else if (type === 'major' && universityId) {
      params.append('schlId', universityId);
    }

    const requestUrl = `${baseUrl}?${params}`;
    console.log('=== 공공데이터 API 요청 정보 ===');
    console.log('요청 URL:', requestUrl);
    console.log('파라미터:', Object.fromEntries(params.entries()));
    console.log('API 키 (디코딩):', decodeURIComponent(API_KEY));
    console.log('================================');

    const response = await fetch(requestUrl);
    
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