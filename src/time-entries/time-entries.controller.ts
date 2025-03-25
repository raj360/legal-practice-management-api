import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { TimeEntriesService } from './time-entries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import {
  TimeEntryQueryParams,
  CreateTimeEntryDto,
  UpdateTimeEntryDto,
} from '../interfaces/time-entry.interface';
import { Role } from '../interfaces/user.interface';

@Controller('time-entries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Get()
  async findAll(@Query() query: TimeEntryQueryParams) {
    return this.timeEntriesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.timeEntriesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.ATTORNEY)
  async create(@Body() createTimeEntryDto: CreateTimeEntryDto) {
    return this.timeEntriesService.create(createTimeEntryDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.ATTORNEY)
  async update(
    @Param('id') id: string,
    @Body() updateTimeEntryDto: UpdateTimeEntryDto,
  ) {
    return this.timeEntriesService.update(id, updateTimeEntryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    await this.timeEntriesService.remove(id);
    return { success: true, message: 'Time entry deleted successfully' };
  }
}
