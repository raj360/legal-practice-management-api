import { Test, TestingModule } from '@nestjs/testing';
import { CasesService } from './cases.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { 
  mockCase, 
  mockCaseWithUser, 
  createMockPrismaService 
} from '../test/mocks';

describe('CasesService', () => {
  let service: CasesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CasesService,
        {
          provide: PrismaService,
          useValue: createMockPrismaService(),
        },
      ],
    }).compile();

    service = module.get<CasesService>(CasesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated cases with total count', async () => {
      const mockCases = [mockCase];
      
      // Mock both findMany calls to return mockCases
      jest.spyOn(prismaService.case, 'findMany')
        .mockResolvedValueOnce(mockCases) // For the count query
        .mockResolvedValueOnce(mockCases); // For the paginated query
      
      const result = await service.findAll({});
      
      expect(prismaService.case.findMany).toHaveBeenCalledWith({ where: {} });
      expect(prismaService.case.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: mockCases,
        total: 1,
        page: 1,
        limit: 10,
      });
    });

    it('should apply filters and pagination correctly', async () => {
      const mockCases = [mockCase];
      
      // Mock both findMany calls
      jest.spyOn(prismaService.case, 'findMany')
        .mockResolvedValueOnce(mockCases) // For the count query
        .mockResolvedValueOnce(mockCases); // For the paginated query
      
      const result = await service.findAll({
        status: mockCase.status,
        userId: mockCase.userId,
        page: 2,
        limit: 5,
      });
      
      expect(prismaService.case.findMany).toHaveBeenCalledWith({
        where: { status: mockCase.status, userId: mockCase.userId },
      });
      expect(prismaService.case.findMany).toHaveBeenCalledWith({
        where: { status: mockCase.status, userId: mockCase.userId },
        skip: 5,
        take: 5,
      });
      expect(result).toEqual({
        data: mockCases,
        total: 1,
        page: 2,
        limit: 5,
      });
    });
  });

  describe('findOne', () => {
    it('should return a case by id', async () => {
      jest.spyOn(prismaService.case, 'findUnique').mockResolvedValue(mockCaseWithUser);
      
      const result = await service.findOne('1');
      
      expect(prismaService.case.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { user: true },
      });
      expect(result).toEqual(mockCaseWithUser);
    });

    it('should throw NotFoundException if case is not found', async () => {
      jest.spyOn(prismaService.case, 'findUnique').mockResolvedValue(null);
      
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      
      expect(prismaService.case.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
        include: { user: true },
      });
    });
  });

  describe('create', () => {
    it('should create a new case', async () => {
      const createCaseDto = {
        title: 'New Case',
        description: 'New case description',
        userId: '1',
      };
      
      jest.spyOn(prismaService.case, 'create').mockResolvedValue(mockCaseWithUser);
      
      const result = await service.create(createCaseDto);
      
      expect(prismaService.case.create).toHaveBeenCalledWith({
        data: createCaseDto,
        include: { user: true },
      });
      expect(result).toEqual(mockCaseWithUser);
    });
  });

  describe('update', () => {
    it('should update an existing case', async () => {
      const updateCaseDto = {
        title: 'Updated Case',
      };
      
      jest.spyOn(prismaService.case, 'findUnique').mockResolvedValue(mockCase);
      jest.spyOn(prismaService.case, 'update').mockResolvedValue({
        ...mockCaseWithUser,
        title: 'Updated Case',
      });
      
      const result = await service.update('1', updateCaseDto);
      
      expect(prismaService.case.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.case.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateCaseDto,
        include: { user: true },
      });
      expect(result).toEqual({
        ...mockCaseWithUser,
        title: 'Updated Case',
      });
    });

    it('should throw NotFoundException if case to update is not found', async () => {
      jest.spyOn(prismaService.case, 'findUnique').mockResolvedValue(null);
      
      await expect(service.update('999', { title: 'Updated' })).rejects.toThrow(NotFoundException);
      
      expect(prismaService.case.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
      });
    });
  });

  describe('remove', () => {
    it('should delete a case', async () => {
      jest.spyOn(prismaService.case, 'findUnique').mockResolvedValue(mockCase);
      jest.spyOn(prismaService.case, 'delete').mockResolvedValue(mockCase);
      
      await service.remove('1');
      
      expect(prismaService.case.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prismaService.case.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if case to delete is not found', async () => {
      jest.spyOn(prismaService.case, 'findUnique').mockResolvedValue(null);
      
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      
      expect(prismaService.case.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
      });
    });
  });
}); 