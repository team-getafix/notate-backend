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
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
  })
  newPassword!: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.newPassword === o.confirmNewPassword)
  confirmNewPassword!: string;
}
