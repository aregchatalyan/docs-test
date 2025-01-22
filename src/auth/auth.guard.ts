import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface JWTPayload {
  userId: number;
  email: string;
}

export interface JwtPayload extends Request {
  user?: JWTPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      request['user'] = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET')
      });

      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [ type, token ] = request.headers['authorization']?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
