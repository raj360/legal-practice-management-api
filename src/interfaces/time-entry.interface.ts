export interface TimeEntry {
  id: string;
  description: string;
  startTime: Date;
  endTime?: Date;
  billable: boolean;
  rate: number;
  userId: string;
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTimeEntryDto {
  description: string;
  startTime: Date;
  endTime?: Date;
  billable?: boolean;
  rate: number;
  userId: string;
  caseId: string;
}

export interface UpdateTimeEntryDto {
  description?: string;
  startTime?: Date;
  endTime?: Date;
  billable?: boolean;
  rate?: number;
  userId?: string;
  caseId?: string;
}

export interface TimeEntryQueryParams {
  userId?: string;
  caseId?: string;
  billable?: boolean;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
} 