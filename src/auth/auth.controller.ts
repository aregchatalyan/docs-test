import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard, JwtPayload } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign Up' })
  @HttpCode(HttpStatus.OK)
  @Post('sign-up')
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User already exists.',
  })
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @ApiOperation({ summary: 'Sign In' })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authentication successful, returns an access token.',
    schema: {
      example: { accessToken: 'your-jwt-token' },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid email or password.',
  })
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @ApiOperation({ summary: 'Get authenticated user' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the authenticated user’s details.',
    schema: {
      example: { id: 1, username: 'john_doe', email: 'john.doe@example.com' },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated.',
  })
  me(@Req() req: JwtPayload) {
    return this.authService.me(req.user);
  }
}
