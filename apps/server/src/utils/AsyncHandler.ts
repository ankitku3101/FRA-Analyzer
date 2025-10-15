import { Request, Response, NextFunction } from 'express';

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors automatically
 *
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json(ApiResponse.success('Users retrieved', users));
 * }));
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
