export enum Role {
  ADMIN = 'ADMIN',
  ATTORNEY = 'ATTORNEY',
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDto = Omit<User, 'password'>;

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: Role;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  user: UserDto;
}
