import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ PrismaModule ],
  controllers: [ AuthController ],
  providers: [ AuthService, JwtService ]
})
export class AuthModule {}
