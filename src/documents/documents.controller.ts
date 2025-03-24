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
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { 
  Document, 
  DocumentQueryParams, 
  CreateDocumentDto, 
  UpdateDocumentDto 
} from '../interfaces/document.interface';
import { Role } from '../interfaces/user.interface';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async findAll(@Query() query: DocumentQueryParams) {
    return this.documentsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.ATTORNEY)
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.ATTORNEY)
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    await this.documentsService.remove(id);
    return { success: true, message: 'Document deleted successfully' };
  }
} 