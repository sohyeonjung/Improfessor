export interface Notice {
  noticeId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeResponse {
  status: string;
  code: string;
  message: string;
  data: Notice[];
}

export interface NoticeDetailResponse {
  status: string;
  code: string;
  message: string;
  data: Notice;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
} 