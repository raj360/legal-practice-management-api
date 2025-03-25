import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import {
  mockAdminUserWithoutPassword,
  createMockPrismaService,
} from '../test/mocks';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: PrismaService,
          useValue: createMockPrismaService(),
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user details from a JWT payload with sub claim', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(mockAdminUserWithoutPassword);

      const payload = {
        sub: '1',
        email: 'admin@legaltech.com',
        role: 'ADMIN',
      };

      const result = await strategy.validate(payload);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: { id: true, email: true, name: true, role: true },
      });
      expect(result).toEqual(mockAdminUserWithoutPassword);
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const payload = {
        sub: '999',
        email: 'nonexistent@example.com',
        role: 'ATTORNEY',
      };

      const result = await strategy.validate(payload);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
        select: { id: true, email: true, name: true, role: true },
      });
      expect(result).toBeNull();
    });
  });
});
