import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly allowedMimeTypes: string[], private readonly maxSize: number) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed types: ${ this.allowedMimeTypes.join(', ') }`);
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException(`File size exceeds the limit of ${ this.maxSize / (1024 * 1024) } MB.`);
    }

    return file;
  }
}
