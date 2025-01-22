import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(@UploadedFile() file: Express.Multer.File) {
    return this.documentService.uploadDocument(file);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getDocument(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.getDocument(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteDocument(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.deleteDocument(id);
  }
}
