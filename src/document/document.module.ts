import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ PrismaModule ],
  controllers: [ DocumentController ],
  providers: [ DocumentService, JwtService ]
})
export class DocumentModule {}
