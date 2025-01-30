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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard, JwtPayload } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign Up' })
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({ description: 'User successfully registered.' })
  @ApiBadRequestResponse({ description: 'User already exists.' })
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @ApiOperation({ summary: 'Sign In' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({
    description: 'Authentication successful, returns an access token.',
    schema: {
      example: { accessToken: 'your-jwt-token' },
    },
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password.' })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @ApiOperation({ summary: 'Get authenticated user' })
  @ApiOkResponse({
    description: 'Returns the authenticated user’s details.',
    schema: {
      example: { id: 1, username: 'john_doe', email: 'john.doe@example.com' },
    },
  })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  me(@Req() req: JwtPayload) {
    return this.authService.me(req.user);
  }
}
