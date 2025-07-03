export interface Problem {
  number: string;
  content: string;
  description: string;
  answer: string;
}

export interface GenerateProblemData {
  downloadKey: string;
  problems: Problem[];
  problemCount: number;
  message: string;
}

export interface GenerateProblemResponse {
  status: string;
  code: string;
  message: string;
  data: GenerateProblemData;
}

export interface GenerateProblemRequest {
  conceptFiles: File[];
  formatFiles?: File[];
} 