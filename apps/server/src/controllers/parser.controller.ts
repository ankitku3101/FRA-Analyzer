import { AppError } from '../middlewares/error.middleware';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/AsyncHandler';
import { Request, Response } from 'express';

export const processFile = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.files || typeof req.files !== 'object' || Array.isArray(req.files)) {
      throw new AppError('Files not found', 400);
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files.content || files.content.length === 0) {
      throw new AppError('No content files uploaded', 400);
    }

    // Get all file paths
    const filePaths = files.content.map((file) => file.path);

    // Process each file
    const processedFiles = files.content.map((file) => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path, // This is what you need - the full file path
      size: file.size,
      mimetype: file.mimetype,
    }));

    console.log('File paths:', filePaths);

    res.json(
      new ApiResponse(true, 'File uploaded successfully', {
        success: true,
        message: 'Files uploaded successfully',
        data: {
          filesCount: files.content.length,
          files: processedFiles,
        },
      })
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Something went wrong while processing files';
    throw new AppError(errorMessage);
  }
});
