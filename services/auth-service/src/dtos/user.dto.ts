import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, ValidateIf } from "class-validator";

export class RegisterUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  role!: string;
}

export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @IsString()
  @IsNotEmpty()
  newPassword!: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.newPassword === o.confirmNewPassword)
  confirmNewPassword!: string;
}
