// Define enums to simulate Prisma enums
export enum Role {
  ADMIN = 'ADMIN',
  ATTORNEY = 'ATTORNEY',
}

export enum CaseStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PENDING = 'PENDING',
}

// Define interfaces for our data models
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  documents?: Document[];
  timeEntries?: TimeEntry[];
}

export interface Document {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: number;
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
  case?: Case;
}

export interface TimeEntry {
  id: string;
  description: string;
  startTime: Date;
  endTime: Date;
  billable: boolean;
  rate: number;
  userId: string;
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  case?: Case;
}

// Define interfaces for Prisma-like query parameters
export interface WhereInput<T> {
  [key: string]: any;
}

export interface SelectInput<T> {
  [key: string]: boolean;
}

export interface IncludeInput {
  [key: string]: boolean;
}

export interface FindManyParams<T> {
  where?: WhereInput<T>;
  skip?: number;
  take?: number;
  select?: SelectInput<T>;
  include?: IncludeInput;
}

export interface FindUniqueParams<T> {
  where: WhereInput<T>;
  select?: SelectInput<T>;
  include?: IncludeInput;
}

export interface CreateParams<T> {
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
  select?: SelectInput<T>;
  include?: IncludeInput;
}

export interface UpdateParams<T> {
  where: WhereInput<T>;
  data: Partial<T>;
  select?: SelectInput<T>;
  include?: IncludeInput;
}

export interface DeleteParams<T> {
  where: WhereInput<T>;
}
