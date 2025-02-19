export type Assignment = {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  subjectId: string;
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  filePath: string;
  feedbackPath?: string;
  grade?: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Subject = {
  id: string;
  name: string;
  teacherIds: string[];
};

export type EnrichedAssignment = Assignment & {
  subject?: Subject;
};

export type EnrichedSubmission = Submission & {
  assignment?: Assignment;
  downloadUrl?: string;
};
