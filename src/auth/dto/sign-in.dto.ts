import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @ApiPropertyOptional({
    description: 'The username of the user. This field is optional and can be used instead of email.',
    example: 'john_doe'
  })
  @IsOptional()
  @IsString()
  username: string;

  @ApiPropertyOptional({
    description: 'The email address of the user. This field is optional and can be used instead of username.',
    example: 'john.doe@example.com'
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the account. This field is required.',
    example: 'P@ssw0rd!'
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
