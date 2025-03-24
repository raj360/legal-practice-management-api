export interface Document {
  id: string;
  title: string;
  description?: string;
  fileType: string;
  fileSize: number;
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentDto {
  title: string;
  description?: string;
  fileType: string;
  fileSize: number;
  caseId: string;
}

export interface UpdateDocumentDto {
  title?: string;
  description?: string;
  fileType?: string;
  fileSize?: number;
  caseId?: string;
}

export interface DocumentQueryParams {
  caseId?: string;
  fileType?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
} 