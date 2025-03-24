import { Role } from '../../interfaces/user.interface';

export const mockAdminUser = {
  id: '1',
  email: 'admin@legaltech.com',
  password: 'hashedAdminPassword',
  name: 'Admin User',
  role: Role.ADMIN,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockAttorneyUser = {
  id: '2',
  email: 'attorney@legaltech.com',
  password: 'hashedAttorneyPassword',
  name: 'Attorney User',
  role: Role.ATTORNEY,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockUserWithoutPassword = (user: any) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const mockAdminUserWithoutPassword = mockUserWithoutPassword(mockAdminUser);
export const mockAttorneyUserWithoutPassword = mockUserWithoutPassword(mockAttorneyUser); 