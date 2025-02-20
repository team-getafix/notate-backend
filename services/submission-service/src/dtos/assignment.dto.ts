import { IsDateString, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";

export class CreateAssignmentDto {
  @IsString()
  title: string;

  @IsDateString()
  dueDate: string;

  @IsUUID()
  subjectId: string;
}

export class UpdateAssignmentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsUUID()
  @IsOptional()
  @ValidateIf((o) => o.role === "admin")
  subjectId?: string;
}
