import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  S3ServiceException
} from '@aws-sdk/client-s3';
import { toHash } from '../utils/hash';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentService {
  private s3: S3Client;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {
    this.s3 = new S3Client({
      endpoint: this.config.get<string>('S3_ATTACHMENTS_ENDPOINT'),
      region: this.config.get<string>('S3_ATTACHMENTS_REGION'),
      credentials: {
        accessKeyId: this.config.get<string>('S3_ATTACHMENTS_KEY_ID')!,
        secretAccessKey: this.config.get<string>('S3_ATTACHMENTS_SECRET')!
      }
    });
  }

  async uploadDocument(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required!');
    if (file.size > 10 * 1024 * 1024) throw new BadRequestException('File size exceeds limit');

    const hash = toHash(file.buffer);
    const key = `${ hash }-${ file.originalname }`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.config.get<string>('S3_ATTACHMENTS_BUCKET')!,
        Key: key,
        Body: file.buffer
      });
      await this.s3.send(command);

      return this.prisma.document.create({
        data: { key, hash, name: file.originalname }
      });
    } catch (e) {
      if (e instanceof S3ServiceException) throw new BadRequestException(e.message);
      throw new BadRequestException('An error occurred while upload the document');
    }
  }

  async getDocument(id: number) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) throw new NotFoundException('Document not found');

    try {
      const command = new GetObjectCommand({
        Bucket: this.config.get<string>('S3_ATTACHMENTS_BUCKET')!,
        Key: document.key
      });
      const s3Object = await this.s3.send(command);
      if (!s3Object || !s3Object.Body) throw new BadRequestException('Document integrity compromised');

      const body = await this.streamToBuffer(s3Object.Body as Readable);
      const hash = toHash(body);
      if (hash !== document.hash) throw new BadRequestException('Document integrity compromised');

      return body;
    } catch (e) {
      if (e instanceof S3ServiceException) throw new BadRequestException(e.message);
      throw new BadRequestException('An error occurred while request the document');
    }
  }

  async deleteDocument(id: number) {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) throw new NotFoundException('Document not found');

    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_ATTACHMENTS_BUCKET,
        Key: document.key
      });
      await this.s3.send(command);

      await this.prisma.document.delete({ where: { id } });

      return { message: 'Document deleted successfully' }
    } catch (e) {
      if (e instanceof S3ServiceException) throw new BadRequestException(e.message);
      throw new BadRequestException('An error occurred while deleting the document');
    }
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', (err) => reject(err));
    });
  }
}
