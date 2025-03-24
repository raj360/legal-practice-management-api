import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  UseGuards, 
  Query, 
  Put
} from '@nestjs/common';
import { CasesService } from './cases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { 
  Case, 
  CaseQueryParams, 
  CreateCaseDto, 
  UpdateCaseDto 
} from '../interfaces/case.interface';
import { Role } from '../interfaces/user.interface';

@Controller('cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  async findAll(@Query() query: CaseQueryParams) {
    return this.casesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.casesService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.ATTORNEY)
  async create(@Body() createCaseDto: CreateCaseDto) {
    return this.casesService.create(createCaseDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.ATTORNEY)
  async update(
    @Param('id') id: string,
    @Body() updateCaseDto: UpdateCaseDto,
  ) {
    return this.casesService.update(id, updateCaseDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    await this.casesService.remove(id);
    return { success: true, message: 'Case deleted successfully' };
  }
} 