'use client';

import Header from "@/components/Header";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/auth";

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading, error, isAuthenticated } = useUser();
  const { useUpdateUser, useDeleteUser } = useAuth();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const { showAlert, showConfirm } = useAlert();

  // 로컬 상태 (수정 가능한 필드들)
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [inputReferral, setInputReferral] = useState("");

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-0 py-12">
          <div className="text-center">로딩 중...</div>
        </main>
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-0 py-12">
          <div className="text-center text-red-600">사용자 정보를 불러오는데 실패했습니다.</div>
        </main>
      </div>
    );
  }

  // 사용자 정보가 없을 때
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-0 py-12">
          <div className="text-center">사용자 정보를 찾을 수 없습니다.</div>
        </main>
      </div>
    );
  }

  // 사용자 정보가 로드되면 로컬 상태 업데이트
  const displayUniversity = university || user.university || "";
  const displayMajor = major || user.major || "";

  // 변경사항이 있는지 확인
  const hasChanges = () => {
    const universityChanged = university !== "" && university !== (user.university || "");
    const majorChanged = major !== "" && major !== (user.major || "");
    
    return universityChanged || majorChanged;
  };

  const handleUpdateUser = async () => {
    try {
      const updateData: {
        id: number;
        university?: string;
        major?: string;
        recommendNickname?: string;
      } = {
        id: parseInt(user.userId)
      };
      
      // 변경된 필드만 포함
      if (university !== "" && university !== (user.university || "")) {
        updateData.university = university;
      }
      if (major !== "" && major !== (user.major || "")) {
        updateData.major = major;
      }

      await updateUser.mutateAsync(updateData);
      showAlert("계정 정보가 수정되었습니다.");
      // 수정 후 로컬 상태 초기화
      setUniversity("");
      setMajor("");
    } catch (error) {
      console.error('계정 수정 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("계정 수정에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleDeleteUser = () => {
    showConfirm(
      '계정을 삭제하시겠습니까?',
      '현재 해당 서비스는 초기 베타 버전으로 올해 10월 정식 서비스 런칭이 예정되어 있습니다.\n\n모든 데이터는 계정 삭제 후 30일 안에 영구적으로 삭제됩니다.',
      async () => {
      try {
        await deleteUser.mutateAsync(user.userId);
        showAlert("계정이 삭제되었습니다.");
        router.push("/");
      } catch (error) {
        console.error('계정 탈퇴 실패:', error);
        if (error instanceof AxiosError && error.response?.data) {
          const errorResponse = error.response.data as ApiResponse<null>;
          showAlert(errorResponse.message);
        } else {
          showAlert("계정 탈퇴에 실패했습니다. 다시 시도해주세요.");
        }
      }
    });
  };

  const handleReferralSubmit = async () => {
    if (!inputReferral.trim()) {
      showAlert("추천인 코드를 입력해주세요.");
      return;
    }

    try {
      const updateData: {
        id: number;
        recommendNickname: string;
        university?: string;
        major?: string;
      } = {
        id: parseInt(user.userId),
        recommendNickname: inputReferral.trim()
      };

      // 기존 학교, 학과 값이 있으면 함께 전송
      if (user.university) {
        updateData.university = user.university;
      }
      if (user.major) {
        updateData.major = user.major;
      }

      await updateUser.mutateAsync(updateData);
      showAlert("추천인 코드가 입력되었습니다. 문제 생성 횟수가 1회 추가됩니다.");
      setInputReferral("");
    } catch (error) {
      console.error('추천인 코드 입력 실패:', error);
      if (error instanceof AxiosError && error.response?.data) {
        const errorResponse = error.response.data as ApiResponse<null>;
        showAlert(errorResponse.message);
      } else {
        showAlert("추천인 코드 입력에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-0 py-12">
        {/* 내 계정 */}
        <h1 className="text-3xl font-bold text-black mb-8">내 계정</h1>

        {/* 사용자 이메일 */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">사용자 이메일</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2 bg-[#F8FAFC] text-black rounded focus:outline-none cursor-not-allowed border border-[#BCCCDC]"
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">사용자 닉네임</label>
            <input
              type="text"
              value={user.nickname}
              disabled
              className="w-full px-4 py-2 bg-[#F8FAFC] text-black rounded focus:outline-none cursor-not-allowed border border-[#BCCCDC]"
            />
          </div>

          {/* 대학교 + 학과 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">대학교</label>
              <input
                type="text"
                value={displayUniversity}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="대학교를 입력해주세요"
                className="w-full px-4 py-2 bg-white border border-[#BCCCDC] rounded focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">학과</label>
              <input
                type="text"
                value={displayMajor}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="학과를 입력해주세요"
                className="w-full px-4 py-2 bg-white border border-[#BCCCDC] rounded focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black"
              />
            </div>
          </div>

          {/* 수정하기 버튼 */}
          <button
            type="button"
            onClick={handleUpdateUser}
            disabled={updateUser.isPending || !hasChanges()}
            className="w-full bg-[#D9EAFD] text-black py-3 rounded hover:bg-[#BCCCDC] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateUser.isPending ? "수정 중..." : "수정하기"}
          </button>
        </div>

        {/* 프로모션 */}
        <div className="mt-12 pt-8 border-t border-[#BCCCDC] space-y-6">
          <h2 className="text-xl font-semibold text-black">프로모션</h2>
          <p className="text-black">
            친구를 추천하여 최대 99회의 무료 생성 횟수를 받으세요!<br />
            친구가 내 추천인 코드를 입력하면 친구는 3회, 나는 3회의 무료 생성 횟수를 받습니다.<br />
            추천인 코드 입력은 1회만 가능하고, 추천받는 것은 최대 33회까지 가능합니다.
          </p>

          {/* 내 추천인 코드 */}
          <div className="bg-[#F8FAFC] p-4 rounded border border-[#BCCCDC]">
            <span className="text-black">내 추천인 코드 :</span>
            <span className="ml-2 font-mono font-bold text-lg text-black">{user.nickname}</span>
          </div>

          {/* 추천인 코드 입력 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">추천인 코드 입력</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputReferral}
                onChange={(e) => setInputReferral(e.target.value)}
                placeholder="추천인 코드"
                className="w-full px-4 py-2 bg-white border border-[#BCCCDC] rounded focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent text-black"
              />
              <button
                type="button"
                onClick={handleReferralSubmit}
                disabled={updateUser.isPending || !inputReferral.trim()}
                className="px-4 py-2 bg-[#D9EAFD] text-black rounded hover:bg-[#BCCCDC] transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateUser.isPending ? "처리 중..." : "입력"}
              </button>
            </div>
            <p className="text-xs text-black">문제 생성 횟수가 1회 추가됩니다. (1회만 가능)</p>
          </div>
        </div>

        {/* 계정 탈퇴 */}
        <button
          type="button"
          onClick={handleDeleteUser}
          disabled={deleteUser.isPending}
          className="w-full bg-[#BCCCDC] text-black py-3 rounded mt-12 hover:bg-[#D9EAFD] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleteUser.isPending ? "처리 중..." : "계정탈퇴"}
        </button>
      </main>
    </div>
  );
} 