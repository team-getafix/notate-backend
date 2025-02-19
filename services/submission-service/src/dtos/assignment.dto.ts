import { IsDateString, IsString, IsUUID } from "class-validator";

export class CreateAssignmentDto {
  @IsString()
  title: string;

  @IsDateString()
  dueDate: string;

  @IsUUID()
  subjectId: string;
}
