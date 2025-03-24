import { CaseStatus } from '../../interfaces/case.interface';
import { mockAttorneyUserWithoutPassword } from './users.mock';

export const mockCase = {
  id: '1',
  title: 'Smith vs. Johnson',
  description: 'Dispute over property boundaries',
  status: CaseStatus.OPEN,
  userId: '2', // Attorney user ID
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCaseWithUser = {
  ...mockCase,
  user: mockAttorneyUserWithoutPassword,
}; 