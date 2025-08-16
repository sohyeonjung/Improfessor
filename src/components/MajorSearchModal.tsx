'use client';

import { useState } from 'react';
import { useAlert } from '@/context/AlertContext';

interface Major {
  korMjrNm: string;
  kediMjrId: string;
  clgNm: string;
  pbnfDgriCrseDivNm: string;
  lsnTrmNm: string;
}

interface MajorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (major: string) => void;
  selectedUniversity: string;
}

export default function MajorSearchModal({ 
  isOpen, 
  onClose, 
  onSelect,
  selectedUniversity
}: MajorSearchModalProps) {
  const { showAlert } = useAlert();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [majors, setMajors] = useState<Major[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const API_KEY = 'qqE4EUYf7PqLHIAzLTlLONl%2BDy%2BQ0HSFXzz9rRHcRCxmwCMilL8Of9ay7py2Fc%2FUWx+HMHHV7GGLvEeZMhgHLA%3D%3D';

  // 학과 검색
  const searchMajors = async (keyword: string = '', page: number = 1) => {
    setIsLoading(true);
    try {
      const baseUrl = 'http://openapi.academyinfo.go.kr/openapi/service/rest/SchoolMajorInfoService/getSchoolMajorInfo';
      const params = new URLSearchParams({
        serviceKey: API_KEY,
        pageNo: page.toString(),
        numOfRows: '50',
        svyYr: '2025',
        schlKrnNm: selectedUniversity
      });

      const response = await fetch(`${baseUrl}?${params}`);
      const xmlText = await response.text();
      
      // XML을 파싱하여 학과 목록 추출
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // 에러 체크
      const resultCode = xmlDoc.querySelector('resultCode')?.textContent;
      const resultMsg = xmlDoc.querySelector('resultMsg')?.textContent;
      
      if (resultCode === '99') {
        throw new Error(`API 에러: ${resultMsg}`);
      }
      
      const items = xmlDoc.querySelectorAll('item');
      const majorList: Major[] = [];
      
      items.forEach((item) => {
        const korMjrNm = item.querySelector('korMjrNm')?.textContent || '';
        const kediMjrId = item.querySelector('kediMjrId')?.textContent || '';
        const clgNm = item.querySelector('clgNm')?.textContent || '';
        const pbnfDgriCrseDivNm = item.querySelector('pbnfDgriCrseDivNm')?.textContent || '';
        const lsnTrmNm = item.querySelector('lsnTrmNm')?.textContent || '';
        
        // 검색어가 있으면 필터링
        if (!keyword || korMjrNm.toLowerCase().includes(keyword.toLowerCase())) {
          majorList.push({
            korMjrNm,
            kediMjrId,
            clgNm,
            pbnfDgriCrseDivNm,
            lsnTrmNm
          });
        }
      });

      setMajors(majorList);
      setTotalCount(majorList.length);
    } catch (error) {
      console.error('학과 검색 실패:', error);
      showAlert('학과 검색에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 학과 선택
  const handleMajorSelect = (major: Major) => {
    onSelect(major.korMjrNm);
    onClose();
  };

  // 검색 실행
  const handleSearch = () => {
    searchMajors(searchKeyword, 1);
  };

  // 모달이 열릴 때 학과 목록 로드
  const handleOpen = () => {
    if (isOpen && selectedUniversity) {
      searchMajors();
    }
  };

  // 모달 닫기
  const handleClose = () => {
    setSearchKeyword('');
    setMajors([]);
    setTotalCount(0);
    onClose();
  };

  // 모달이 열릴 때마다 학과 목록 로드
  if (isOpen && selectedUniversity && majors.length === 0 && !isLoading) {
    handleOpen();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">학과 검색</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 선택된 대학교 표시 */}
        <div className="mb-4 p-3 bg-[#D9EAFD] rounded-lg">
          <p className="text-sm text-black">
            선택된 대학교: <span className="font-semibold">{selectedUniversity}</span>
          </p>
        </div>

        {/* 검색 입력 */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="학과명을 입력하세요"
            className="flex-1 px-4 py-2 border border-[#BCCCDC] rounded-lg focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black placeholder-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-2 bg-[#D9EAFD] text-black rounded-lg hover:bg-[#BCCCDC] transition disabled:opacity-50"
          >
            {isLoading ? '검색 중...' : '검색'}
          </button>
        </div>

        {/* 결과 목록 */}
        <div className="overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">검색 중...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {majors.map((major) => (
                <div
                  key={major.kediMjrId}
                  onClick={() => handleMajorSelect(major)}
                  className="p-3 border border-[#BCCCDC] rounded-lg hover:bg-[#D9EAFD] cursor-pointer transition"
                >
                  <div className="font-semibold text-black">{major.korMjrNm}</div>
                  <div className="text-sm text-gray-600">
                    {major.clgNm} • {major.pbnfDgriCrseDivNm} • {major.lsnTrmNm}
                  </div>
                </div>
              ))}
              {majors.length === 0 && (
                <p className="text-center py-8 text-gray-500">학과 정보가 없습니다.</p>
              )}
            </div>
          )}
        </div>

        {/* 결과 개수 */}
        {totalCount > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            총 {totalCount}개의 결과
          </div>
        )}
      </div>
    </div>
  );
} 