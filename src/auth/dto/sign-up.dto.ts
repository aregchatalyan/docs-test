import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

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
