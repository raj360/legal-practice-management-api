import { mockCase } from './cases.mock';

export const mockDocument = {
  id: '1',
  title: 'Property Deed',
  description: 'Copy of the original property deed',
  fileType: 'pdf',
  fileSize: 1024,
  caseId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockDocumentWithCase = {
  ...mockDocument,
  case: mockCase,
}; 