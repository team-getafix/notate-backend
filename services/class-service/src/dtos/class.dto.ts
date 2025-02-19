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

export class GetClassByIdDto {
  @IsString()
  @IsNotEmpty()
  classId: string;
}

export class DeleteClassByIdDto {
  @IsString()
  @IsNotEmpty()
  classId: string;
}
