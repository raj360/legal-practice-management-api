import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Document,
  DocumentQueryParams,
  CreateDocumentDto,
  UpdateDocumentDto,
} from '../interfaces/document.interface';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    params: DocumentQueryParams,
  ): Promise<{ data: Document[]; total: number; page: number; limit: number }> {
    const {
      caseId,
      fileType,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    // Build where condition
    const where: any = {};
    if (caseId) where.caseId = caseId;
    if (fileType) where.fileType = fileType;

    // Get total count for pagination
    const total = (await this.prisma.document.findMany({ where })).length;

    // Get paginated results
    const documents = await this.prisma.document.findMany({
      where,
      skip,
      take: limit,
    });

    // Manually sort results (since we're using in-memory)
    documents.sort((a, b) => {
      if (order === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });

    return {
      data: documents,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { case: true },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.prisma.document.create({
      data: createDocumentDto,
      include: { case: true },
    });
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const existing = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
      include: { case: true },
    });
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    await this.prisma.document.delete({
      where: { id },
    });
  }
}
