import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  mockAdminUser,
  mockAdminUserWithoutPassword,
  createMockPrismaService,
} from '../test/mocks';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: createMockPrismaService(),
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user without password if credentials are valid', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockAdminUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);

      const result = await service.validateUser(
        'admin@legaltech.com',
        'admin123',
      );

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@legaltech.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'admin123',
        'hashedAdminPassword',
      );
      expect(result).toEqual(mockAdminUserWithoutPassword);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password',
      );

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockAdminUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      const result = await service.validateUser(
        'admin@legaltech.com',
        'wrongpassword',
      );

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@legaltech.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedAdminPassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data if credentials are valid', async () => {
      jest
        .spyOn(service, 'validateUser')
        .mockResolvedValue(mockAdminUserWithoutPassword);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test-token');

      const result = await service.login({
        email: 'admin@legaltech.com',
        password: 'admin123',
      });

      expect(service.validateUser).toHaveBeenCalledWith(
        'admin@legaltech.com',
        'admin123',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '1',
        email: 'admin@legaltech.com',
        role: 'ADMIN',
      });
      expect(result).toEqual({
        accessToken: 'test-token',
        user: mockAdminUserWithoutPassword,
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(
        service.login({
          email: 'admin@legaltech.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);

      expect(service.validateUser).toHaveBeenCalledWith(
        'admin@legaltech.com',
        'wrongpassword',
      );
    });
  });
});
