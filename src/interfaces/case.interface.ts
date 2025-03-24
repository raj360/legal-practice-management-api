export enum CaseStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
}

export interface Case {
  id: string;
  title: string;
  description?: string;
  status: CaseStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCaseDto {
  title: string;
  description?: string;
  status?: CaseStatus;
  userId: string;
}

export interface UpdateCaseDto {
  title?: string;
  description?: string;
  status?: CaseStatus;
  userId?: string;
}

export interface CaseQueryParams {
  status?: CaseStatus;
  userId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
} 