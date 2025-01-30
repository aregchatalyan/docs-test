import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileValidationPipe } from '../utils/pipes/file-validation.pipe';

@ApiTags('Documents')
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @ApiOperation({ summary: 'Upload a document' })
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
  @ApiCreatedResponse({
    description: 'Document uploaded successfully.',
    schema: {
      example: {
        uuid: 'string',
        key: 'string',
        hash: 'string',
        name: 'string',
        createdAt: 'string',
        updatedAt: 'string',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid file format or file size exceeds the limit.',
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(
    new FileValidationPipe(
      ['image/jpeg', 'image/png', 'application/pdf'],
      10 * 1024 * 1024
    )
  )
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('upload')
  uploadDocument(@UploadedFile() file: Express.Multer.File) {
    return this.documentService.uploadDocument(file);
  }

  @ApiOperation({ summary: 'Get a document' })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The unique identifier of the document.',
    example: '433e0fc5-e362-4d6b-a6da-1bbade4447e9',
  })
  @ApiOkResponse({ description: 'Document retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Document not found.' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':uuid')
  getDocument(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.documentService.getDocument(uuid);
  }

  @ApiOperation({ summary: 'Delete a document' })
  @ApiParam({
    name: 'uuid',
    type: String,
    description: 'The unique identifier of the document.',
    example: '433e0fc5-e362-4d6b-a6da-1bbade4447e9',
  })
  @ApiOkResponse({
    description: 'Document deleted successfully.',
    schema: {
      example: {
        message: 'Document deleted successfully',
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Document not found.' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':uuid')
  deleteDocument(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.documentService.deleteDocument(uuid);
  }
}
