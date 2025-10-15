import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { Logger } from '../utils/logger';

/**
 * Custom Error Class
 * Extends the built-in Error class with additional properties
 *
 * @example
 * throw new AppError('User not found', 404);
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Global Error Handler Middleware
 * Catches all errors and sends standardized error responses
 *
 * Usage: Add as the last middleware in app.ts
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  Logger.error('Error occurred:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json(
      ApiResponse.error(err.message, [
        {
          field: 'general',
          message: err.message,
        },
      ])
    );
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json(
      ApiResponse.error('Validation error', [
        {
          field: 'validation',
          message: err.message,
        },
      ])
    );
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json(ApiResponse.error('Invalid token'));
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json(ApiResponse.error('Token expired'));
    return;
  }

  // Default error
  res
    .status(500)
    .json(
      ApiResponse.error(
        process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
      )
    );
};

/**
 * 404 Not Found Handler
 * Handles requests to non-existent routes
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json(ApiResponse.error(`Route ${req.originalUrl} not found`));
};
