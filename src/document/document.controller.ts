import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileValidationPipe } from '../utils/pipes/file-validation.pipe';

@ApiTags('Documents')
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('upload')
  @ApiOperation({
    summary: 'Upload a document',
    description: 'Allows authenticated users to upload a document.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Supported formats: JPEG, PNG, PDF. Max size: 10MB.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Document uploaded successfully.',
    schema: {
      example: {
        key: 'string',
        hash: 'string',
        name: 'string',
        createdAt: 'string',
        updatedAt: 'string',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file format or file size exceeds the limit.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated.',
  })
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(
    new FileValidationPipe(
      ['image/jpeg', 'image/png', 'application/pdf'],
      10 * 1024 * 1024
    )
  )
  uploadDocument(@UploadedFile() file: Express.Multer.File) {
    return this.documentService.uploadDocument(file);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({
    summary: 'Get a document',
    description: 'Retrieve a document by its ID.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique identifier of the document.',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Document retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Document not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated.',
  })
  getDocument(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.getDocument(id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a document',
    description: 'Delete a document by its ID.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique identifier of the document.',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Document deleted successfully.',
    schema: {
      example: {
        message: 'Document deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Document not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated.',
  })
  deleteDocument(@Param('id', ParseIntPipe) id: number) {
    return this.documentService.deleteDocument(id);
  }
}
