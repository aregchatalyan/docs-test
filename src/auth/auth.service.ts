import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './auth.guard';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async signup(signUpDto: SignUpDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: signUpDto.email },
          { username: signUpDto.username }
        ]
      }
    });
    if (user) throw new BadRequestException('User already exists');

    const salt = await bcrypt.genSalt(10);
    signUpDto.password = await bcrypt.hash(signUpDto.password, salt);

    await this.prisma.user.create({ data: signUpDto });
  }

  async signin(signInDto: SignInDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: signInDto.email },
          { username: signInDto.username }
        ]
      }
    });
    if (!user) throw new NotFoundException('User not found');

    const isCorrectPassword = await bcrypt.compare(signInDto.password, user.password);
    if (!isCorrectPassword) throw new UnauthorizedException('Invalid email or password');

    const accessToken = this.jwtService.sign({
      userId: user.id,
      email: user.email
    });

    return { accessToken };
  }

  async me(payload: JwtPayload['user']) {
    if (!payload) throw new UnauthorizedException();

    return this.prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        username: true,
        email: true
      }
    });
  }
}
