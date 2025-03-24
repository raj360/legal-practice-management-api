import { mockAttorneyUserWithoutPassword } from './users.mock';
import { mockCase } from './cases.mock';

export const mockTimeEntry = {
  id: '1',
  description: 'Initial consultation',
  startTime: new Date('2023-01-01T09:00:00Z'),
  endTime: new Date('2023-01-01T10:30:00Z'),
  billable: true,
  rate: 250,
  userId: '2', // Attorney user ID
  caseId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockTimeEntryWithRelations = {
  ...mockTimeEntry,
  user: mockAttorneyUserWithoutPassword,
  case: mockCase,
}; 