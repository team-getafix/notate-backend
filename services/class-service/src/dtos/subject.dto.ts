import { IsNotEmpty, IsOptional, IsString, IsArray } from "class-validator";

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  teacherIds?: string[];
}

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  teacherIds?: string[];
}
