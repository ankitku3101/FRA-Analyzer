import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../utils/ApiResponse';

/**
 * Validation Middleware
 * Handles express-validator validation results
 *
 * @example
 * router.post('/users',
 *   [body('email').isEmail(), body('password').isLength({ min: 6 })],
 *   validate,
 *   createUser
 * );
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
    }));

    res.status(400).json(ApiResponse.error('Validation failed', formattedErrors));
    return;
  }

  next();
};
