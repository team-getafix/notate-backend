import { IsNotEmpty, IsOptional, IsString, IsArray } from "class-validator";

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjectIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  studentIds?: string[];
}

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjectIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  studentIds?: string[];
}

export class AddSubjectToClassDto {
  @IsString()
  @IsNotEmpty()
  subjectId!: string;
}

export class AddStudentToClassDto {
  @IsString()
  @IsNotEmpty()
  studentId!: string;
}
