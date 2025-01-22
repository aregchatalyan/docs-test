import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'The username of the user. Must be a string between 3 and 20 characters.',
    example: 'john_doe',
    minLength: 3,
    maxLength: 20
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  username: string;

  @ApiProperty({
    description: 'The email address of the user. Must be a valid email format.',
    example: 'john.doe@example.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the account. Must be at least 8 characters long, containing at least one uppercase letter, one lowercase letter, one number, and one special character.',
    example: 'P@ssw0rd!',
    minLength: 8
  })
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  })
  password: string;
}
