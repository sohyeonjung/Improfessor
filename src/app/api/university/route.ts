import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const universityId = searchParams.get('universityId');
  const page = searchParams.get('page') || '1';
  const type = searchParams.get('type') || 'university';

  const API_KEY = 'qqE4EUYf7PqLHIAzLTlLONl%2BDy%2BQ0HSFXzz9rRHcRCxmwCMilL8Of9ay7py2Fc%2FUWx+HMHHV7GGLvEeZMhgHLA%3D%3D';

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

    const response = await fetch(`${baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const xmlText = await response.text();
    
    return new NextResponse(xmlText, {
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
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