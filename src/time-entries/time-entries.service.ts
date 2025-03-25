import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  TimeEntry,
  TimeEntryQueryParams,
  CreateTimeEntryDto,
  UpdateTimeEntryDto,
} from '../interfaces/time-entry.interface';

@Injectable()
export class TimeEntriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: TimeEntryQueryParams): Promise<{
    data: TimeEntry[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      userId,
      caseId,
      billable,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'startTime',
      order = 'desc',
    } = params;

    const skip = (page - 1) * limit;

    // Build where condition
    const where: any = {};
    if (userId) where.userId = userId;
    if (caseId) where.caseId = caseId;
    if (billable !== undefined) where.billable = billable;

    // Filter by date range if provided
    let timeEntries = await this.prisma.timeEntry.findMany({ where });

    if (startDate) {
      const startDateTime = new Date(startDate);
      timeEntries = timeEntries.filter(
        (entry) => new Date(entry.startTime) >= startDateTime,
      );
    }

    if (endDate) {
      const endDateTime = new Date(endDate);
      timeEntries = timeEntries.filter(
        (entry) => new Date(entry.startTime) <= endDateTime,
      );
    }

    // Get total count for pagination
    const total = timeEntries.length;

    // Manually sort results (since we're using in-memory)
    timeEntries.sort((a, b) => {
      if (order === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });

    // Apply pagination
    const paginatedEntries = timeEntries.slice(skip, skip + limit);

    return {
      data: paginatedEntries,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<TimeEntry> {
    const timeEntry = await this.prisma.timeEntry.findUnique({
      where: { id },
      include: {
        user: true,
        case: true,
      },
    });

    if (!timeEntry) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }

    return timeEntry;
  }

  async create(createTimeEntryDto: CreateTimeEntryDto): Promise<TimeEntry> {
    return this.prisma.timeEntry.create({
      data: createTimeEntryDto,
      include: {
        user: true,
        case: true,
      },
    });
  }

  async update(
    id: string,
    updateTimeEntryDto: UpdateTimeEntryDto,
  ): Promise<TimeEntry> {
    const existing = await this.prisma.timeEntry.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }

    return this.prisma.timeEntry.update({
      where: { id },
      data: updateTimeEntryDto,
      include: {
        user: true,
        case: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const existing = await this.prisma.timeEntry.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }

    await this.prisma.timeEntry.delete({
      where: { id },
    });
  }
}
