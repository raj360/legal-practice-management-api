import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Case, CaseQueryParams, CreateCaseDto, UpdateCaseDto } from '../interfaces/case.interface';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: CaseQueryParams): Promise<{ data: Case[]; total: number; page: number; limit: number }> {
    const { 
      status, 
      userId, 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      order = 'desc' 
    } = params;
    
    const skip = (page - 1) * limit;
    
    // Build where condition
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    
    // Get total count for pagination
    const total = (await this.prisma.case.findMany({ where })).length;
    
    // Get paginated results
    const cases = await this.prisma.case.findMany({
      where,
      skip,
      take: limit,
    });
    
    // Manually sort results (since we're using in-memory)
    cases.sort((a, b) => {
      if (order === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });
    
    return {
      data: cases,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Case> {
    const case_ = await this.prisma.case.findUnique({
      where: { id },
      include: { user: true },
    });
    
    if (!case_) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }
    
    return case_;
  }

  async create(createCaseDto: CreateCaseDto): Promise<Case> {
    return this.prisma.case.create({
      data: createCaseDto,
      include: { user: true },
    });
  }

  async update(id: string, updateCaseDto: UpdateCaseDto): Promise<Case> {
    const existing = await this.prisma.case.findUnique({
      where: { id },
    });
    
    if (!existing) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }
    
    return this.prisma.case.update({
      where: { id },
      data: updateCaseDto,
      include: { user: true },
    });
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.case.findUnique({
      where: { id },
    });
    
    if (!existing) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }
    
    await this.prisma.case.delete({
      where: { id },
    });
  }
} 