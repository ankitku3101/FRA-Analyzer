import path from 'path';
import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

const ALLOWED_FORMATS = ['csv', 'txt', 'xlsx', 'xml'];

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    // Files will be saved in the 'uploads/' directory
    cb(null, 'public/');
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Create a unique filename to avoid overwrites: originalname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${path.parse(file.originalname).name}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const extension = path.extname(file.originalname).toLowerCase().substring(1);

  if (ALLOWED_FORMATS.includes(extension)) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file
    cb(new Error(`Invalid file type. Only ${ALLOWED_FORMATS.join(', ')} files are allowed.`));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // Set a file size limit (e.g., 10MB) to prevent large uploads
    fileSize: 10 * 1024 * 1024,
  },
});

export default upload;
