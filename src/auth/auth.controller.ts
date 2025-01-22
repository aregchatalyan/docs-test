import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, JwtPayload } from './auth.guard';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @Post('sign-in')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: JwtPayload) {
    return this.authService.me(req.user);
  }
}
