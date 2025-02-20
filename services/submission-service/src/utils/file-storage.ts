import fs from 'fs/promises';
import path from 'path';

const STORAGE_ROOT = process.env.STORAGE_ROOT || '/data/submissions';

export const storeFile = async (
  file: Express.Multer.File,
  options: { assignmentId: string; studentId: string }
) => {
  const ext = path.extname(file.originalname);
  const filename = `${Date.now()}-${options.studentId}${ext}`;
  const relativePath = path.join(
    options.assignmentId,
    options.studentId,
    filename
  );
  const absolutePath = path.join(STORAGE_ROOT, relativePath);

  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.rename(file.path, absolutePath);

  return relativePath;
};
