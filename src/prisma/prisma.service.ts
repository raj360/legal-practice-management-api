import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  Role,
  CaseStatus,
  User,
  Case,
  Document,
  TimeEntry,
  FindManyParams,
  FindUniqueParams,
  CreateParams,
  UpdateParams,
} from './prisma.interfaces';

/**
 * PrismaService
 *
 * Simulates Prisma ORM behavior with in-memory arrays.
 *
 * NOTE ON TYPE SAFETY:
 * This implementation uses type assertions (as any) in specific places to handle
 * the dynamic nature of ORM operations. While not ideal for type safety, this approach
 * balances simulation accuracy with reasonable type checking.
 *
 * For a production application, a more rigorous typing system would be implemented.
 */
@Injectable()
export class PrismaService implements OnModuleInit {
  // In-memory database
  private users: User[] = [];
  private cases: Case[] = [];
  private documents: Document[] = [];
  private timeEntries: TimeEntry[] = [];

  async onModuleInit() {
    // Seed initial data
    await this.seedData();
  }

  private async seedData() {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser: User = {
      id: '1',
      email: 'admin@legaltech.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create attorney user
    const attorneyPassword = await bcrypt.hash('attorney123', 10);
    const attorneyUser: User = {
      id: '2',
      email: 'attorney@legaltech.com',
      password: attorneyPassword,
      name: 'Attorney User',
      role: Role.ATTORNEY,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(adminUser, attorneyUser);

    // Create sample case
    const sampleCase: Case = {
      id: '1',
      title: 'Smith vs. Johnson',
      description: 'Dispute over property boundaries',
      status: CaseStatus.OPEN,
      userId: '2', // Belongs to attorney
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.cases.push(sampleCase);

    // Create sample document
    const sampleDocument: Document = {
      id: '1',
      title: 'Property Deed',
      description: 'Copy of the original property deed',
      fileType: 'pdf',
      fileSize: 1024,
      caseId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.documents.push(sampleDocument);

    // Create sample time entry
    const sampleTimeEntry: TimeEntry = {
      id: '1',
      description: 'Initial consultation',
      startTime: new Date('2023-01-01T09:00:00Z'),
      endTime: new Date('2023-01-01T10:30:00Z'),
      billable: true,
      rate: 250,
      userId: '2',
      caseId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.timeEntries.push(sampleTimeEntry);
  }

  // User repository methods
  user = {
    findMany: async (
      params: FindManyParams<User> = {},
    ): Promise<Partial<User>[]> => {
      let results: User[] = [...this.users];

      // Apply filtering
      if (params.where) {
        results = results.filter((user) => {
          return Object.entries(params.where || {}).every(
            ([key, value]) => user[key as keyof User] === value,
          );
        });
      }

      // Apply pagination
      if (params.skip) {
        results = results.slice(params.skip);
      }

      if (params.take) {
        results = results.slice(0, params.take);
      }

      // Apply select
      if (params.select) {
        return results.map((user) => {
          const selected: Partial<User> = {};
          Object.keys(params.select || {}).forEach((key) => {
            const typedKey = key as keyof User;
            if (params.select && params.select[key]) {
              // Use type assertion to fix incompatible type error
              selected[typedKey] = user[typedKey] as any;
            }
          });
          return selected;
        });
      }

      return results;
    },

    findUnique: async (
      params: FindUniqueParams<User>,
    ): Promise<Partial<User> | null> => {
      const user = this.users.find((user) => {
        return Object.entries(params.where || {}).every(
          ([key, value]) => user[key as keyof User] === value,
        );
      });

      if (!user) return null;

      // Apply select
      if (params.select) {
        const selected: Partial<User> = {};
        Object.keys(params.select).forEach((key) => {
          const typedKey = key as keyof User;
          if (params.select && params.select[key]) {
            // Use type assertion to fix incompatible type error
            selected[typedKey] = user[typedKey] as any;
          }
        });
        return selected;
      }

      return user;
    },

    // Update create method to use the proper type

    create: async (
      params: CreateParams<User>,
    ): Promise<Partial<User> | User> => {
      const id = (this.users.length + 1).toString();
      const now = new Date();
      const newUser: User = {
        id,
        ...params.data,
        createdAt: now,
        updatedAt: now,
      } as User; // Type assertion needed due to incomplete data

      this.users.push(newUser);

      // Apply select
      if (params.select) {
        const selected: Partial<User> = {};
        Object.keys(params.select).forEach((key) => {
          const typedKey = key as keyof User;
          if (params.select && params.select[key]) {
            selected[typedKey] = newUser[typedKey] as any;
          }
        });
        return selected;
      }

      return newUser;
    },

    update: async (
      params: UpdateParams<User>,
    ): Promise<Partial<User> | User | null> => {
      const index = this.users.findIndex((user) => {
        return Object.entries(params.where || {}).every(
          ([key, value]) => user[key as keyof User] === value,
        );
      });

      if (index === -1) return null;

      const updatedUser: User = {
        ...this.users[index],
        ...params.data,
        updatedAt: new Date(),
      };

      this.users[index] = updatedUser;

      // Apply select
      if (params.select) {
        const selected: Partial<User> = {};
        Object.keys(params.select).forEach((key) => {
          const typedKey = key as keyof User;
          if (params.select && params.select[key]) {
            selected[typedKey] = updatedUser[typedKey] as any;
          }
        });
        return selected;
      }

      return updatedUser;
    },

    delete: async (params: any) => {
      const index = this.users.findIndex((user) => {
        for (const [key, value] of Object.entries(params.where)) {
          if (user[key] !== value) return false;
        }
        return true;
      });

      if (index === -1) return null;

      const deletedUser = this.users[index];
      this.users.splice(index, 1);

      return deletedUser;
    },
  };

  // Case repository methods
  case = {
    findMany: async (params: any = {}) => {
      let results = [...this.cases];

      // Apply filtering
      if (params.where) {
        for (const [key, value] of Object.entries(params.where)) {
          results = results.filter((case_) => case_[key] === value);
        }
      }

      // Apply pagination
      if (params.skip) {
        results = results.slice(params.skip);
      }

      if (params.take) {
        results = results.slice(0, params.take);
      }

      // Apply select
      if (params.select) {
        results = results.map((case_) => {
          const selected: any = {};
          for (const key of Object.keys(params.select)) {
            if (params.select[key]) {
              selected[key] = case_[key];
            }
          }
          return selected;
        });
      }

      // Apply include
      if (params.include) {
        results = results.map((case_) => {
          const included = { ...case_ };

          if (params.include.user) {
            included.user = this.users.find((user) => user.id === case_.userId);
          }

          if (params.include.documents) {
            included.documents = this.documents.filter(
              (doc) => doc.caseId === case_.id,
            );
          }

          if (params.include.timeEntries) {
            included.timeEntries = this.timeEntries.filter(
              (entry) => entry.caseId === case_.id,
            );
          }

          return included;
        });
      }

      return results;
    },

    findUnique: async (params: any) => {
      const case_ = this.cases.find((case_) => {
        for (const [key, value] of Object.entries(params.where)) {
          if (case_[key] !== value) return false;
        }
        return true;
      });

      if (!case_) return null;

      // Apply select
      if (params.select) {
        const selected: any = {};
        for (const key of Object.keys(params.select)) {
          if (params.select[key]) {
            selected[key] = case_[key];
          }
        }
        return selected;
      }

      // Apply include
      if (params.include) {
        const included = { ...case_ };

        if (params.include.user) {
          included.user = this.users.find((user) => user.id === case_.userId);
        }

        if (params.include.documents) {
          included.documents = this.documents.filter(
            (doc) => doc.caseId === case_.id,
          );
        }

        if (params.include.timeEntries) {
          included.timeEntries = this.timeEntries.filter(
            (entry) => entry.caseId === case_.id,
          );
        }

        return included;
      }

      return case_;
    },

    create: async (params: any) => {
      const id = (this.cases.length + 1).toString();
      const now = new Date();
      const newCase = {
        id,
        ...params.data,
        createdAt: now,
        updatedAt: now,
      };

      this.cases.push(newCase);

      // Apply include
      if (params.include) {
        const included = { ...newCase };

        if (params.include.user) {
          included.user = this.users.find((user) => user.id === newCase.userId);
        }

        return included;
      }

      return newCase;
    },

    update: async (params: any) => {
      const index = this.cases.findIndex((case_) => {
        for (const [key, value] of Object.entries(params.where)) {
          if (case_[key] !== value) return false;
        }
        return true;
      });

      if (index === -1) return null;

      const updatedCase = {
        ...this.cases[index],
        ...params.data,
        updatedAt: new Date(),
      };

      this.cases[index] = updatedCase;

      // Apply include
      if (params.include) {
        const included = { ...updatedCase };

        if (params.include.user) {
          included.user = this.users.find(
            (user) => user.id === updatedCase.userId,
          );
        }

        if (params.include.documents) {
          included.documents = this.documents.filter(
            (doc) => doc.caseId === updatedCase.id,
          );
        }

        if (params.include.timeEntries) {
          included.timeEntries = this.timeEntries.filter(
            (entry) => entry.caseId === updatedCase.id,
          );
        }

        return included;
      }

      return updatedCase;
    },

    delete: async (params: any) => {
      const index = this.cases.findIndex((case_) => {
        for (const [key, value] of Object.entries(params.where)) {
          if (case_[key] !== value) return false;
        }
        return true;
      });

      if (index === -1) return null;

      const deletedCase = this.cases[index];
      this.cases.splice(index, 1);

      return deletedCase;
    },
  };

  // Document repository methods
  document = {
    findMany: async (params: any = {}) => {
      let results = [...this.documents];

      // Apply filtering
      if (params.where) {
        for (const [key, value] of Object.entries(params.where)) {
          results = results.filter((doc) => doc[key] === value);
        }
      }

      // Apply pagination
      if (params.skip) {
        results = results.slice(params.skip);
      }

      if (params.take) {
        results = results.slice(0, params.take);
      }

      // Apply select
      if (params.select) {
        results = results.map((doc) => {
          const selected: any = {};
          for (const key of Object.keys(params.select)) {
            if (params.select[key]) {
              selected[key] = doc[key];
            }
          }
          return selected;
        });
      }

      // Apply include
      if (params.include) {
        results = results.map((doc) => {
          const included = { ...doc };

          if (params.include.case) {
            included.case = this.cases.find((case_) => case_.id === doc.caseId);
          }

          return included;
        });
      }

      return results;
    },

    findUnique: async (params: any) => {
      const doc = this.documents.find((doc) => {
        for (const [key, value] of Object.entries(params.where)) {
          if (doc[key] !== value) return false;
        }
        return true;
      });

      if (!doc) return null;

      // Apply select
      if (params.select) {
        const selected: any = {};
        for (const key of Object.keys(params.select)) {
          if (params.select[key]) {
            selected[key] = doc[key];
          }
        }
        return selected;
      }

      // Apply include
      if (params.include) {
        const included = { ...doc };

        if (params.include.case) {
          included.case = this.cases.find((case_) => case_.id === doc.caseId);
        }

        return included;
      }

      return doc;
    },

    create: async (params: any) => {
      const id = (this.documents.length + 1).toString();
      const now = new Date();
      const newDoc = {
        id,
        ...params.data,
        createdAt: now,
        updatedAt: now,
      };

      this.documents.push(newDoc);

      // Apply include
      if (params.include) {
        const included = { ...newDoc };

        if (params.include.case) {
          included.case = this.cases.find(
            (case_) => case_.id === newDoc.caseId,
          );
        }

        return included;
      }

      return newDoc;
    },

    update: async (params: any) => {
      const index = this.documents.findIndex((doc) => {
        for (const [key, value] of Object.entries(params.where)) {
          if (doc[key] !== value) return false;
        }
        return true;
      });

      if (index === -1) return null;

      const updatedDoc = {
        ...this.documents[index],
        ...params.data,
        updatedAt: new Date(),
      };

      this.documents[index] = updatedDoc;

      // Apply include
      if (params.include) {
        const included = { ...updatedDoc };

        if (params.include.case) {
          included.case = this.cases.find(
            (case_) => case_.id === updatedDoc.caseId,
          );
        }

        return included;
      }

      return updatedDoc;
    },

    delete: async (params: any) => {
      const index = this.documents.findIndex((doc) => {
        for (const [key, value] of Object.entries(params.where)) {
          if (doc[key] !== value) return false;
        }
        return true;
      });

      if (index === -1) return null;

      const deletedDoc = this.documents[index];
      this.documents.splice(index, 1);

      return deletedDoc;
    },
  };

  // TimeEntry repository methods
  timeEntry = {
    findMany: async (params: any = {}) => {
      let results = [...this.timeEntries];

      // Apply filtering
      if (params.where) {
        for (const [key, value] of Object.entries(params.where)) {
          results = results.filter((entry) => entry[key] === value);
        }
      }

      // Apply pagination
      if (params.skip) {
        results = results.slice(params.skip);
      }

      if (params.take) {
        results = results.slice(0, params.take);
      }

      // Apply select
      if (params.select) {
        results = results.map((entry) => {
          const selected: any = {};
          for (const key of Object.keys(params.select)) {
            if (params.select[key]) {
              selected[key] = entry[key];
            }
          }
          return selected;
        });
      }

      // Apply include
      if (params.include) {
        results = results.map((entry) => {
          const included = { ...entry };

          if (params.include.user) {
            included.user = this.users.find((user) => user.id === entry.userId);
          }

          if (params.include.case) {
            included.case = this.cases.find(
              (case_) => case_.id === entry.caseId,
            );
          }

          return included;
        });
      }

      return results;
    },

    findUnique: async (params: any) => {
      const entry = this.timeEntries.find((entry) => {
        for (const [key, value] of Object.entries(params.where)) {
          if (entry[key] !== value) return false;
        }
        return true;
      });

      if (!entry) return null;

      // Apply select
      if (params.select) {
        const selected: any = {};
        for (const key of Object.keys(params.select)) {
          if (params.select[key]) {
            selected[key] = entry[key];
          }
        }
        return selected;
      }

      // Apply include
      if (params.include) {
        const included = { ...entry };

        if (params.include.user) {
          included.user = this.users.find((user) => user.id === entry.userId);
        }

        if (params.include.case) {
          included.case = this.cases.find((case_) => case_.id === entry.caseId);
        }

        return included;
      }

      return entry;
    },

    create: async (params: any) => {
      const id = (this.timeEntries.length + 1).toString();
      const now = new Date();
      const newEntry = {
        id,
        ...params.data,
        createdAt: now,
        updatedAt: now,
      };

      this.timeEntries.push(newEntry);

      // Apply include
      if (params.include) {
        const included = { ...newEntry };

        if (params.include.user) {
          included.user = this.users.find(
            (user) => user.id === newEntry.userId,
          );
        }

        if (params.include.case) {
          included.case = this.cases.find(
            (case_) => case_.id === newEntry.caseId,
          );
        }

        return included;
      }

      return newEntry;
    },

    update: async (params: any) => {
      const index = this.timeEntries.findIndex((entry) => {
        for (const [key, value] of Object.entries(params.where)) {
          if (entry[key] !== value) return false;
        }
        return true;
      });

      if (index === -1) return null;

      const updatedEntry = {
        ...this.timeEntries[index],
        ...params.data,
        updatedAt: new Date(),
      };

      this.timeEntries[index] = updatedEntry;

      // Apply include
      if (params.include) {
        const included = { ...updatedEntry };

        if (params.include.user) {
          included.user = this.users.find(
            (user) => user.id === updatedEntry.userId,
          );
        }

        if (params.include.case) {
          included.case = this.cases.find(
            (case_) => case_.id === updatedEntry.caseId,
          );
        }

        return included;
      }

      return updatedEntry;
    },

    delete: async (params: any) => {
      const index = this.timeEntries.findIndex((entry) => {
        for (const [key, value] of Object.entries(params.where)) {
          if (entry[key] !== value) return false;
        }
        return true;
      });

      if (index === -1) return null;

      const deletedEntry = this.timeEntries[index];
      this.timeEntries.splice(index, 1);

      return deletedEntry;
    },
  };
}
