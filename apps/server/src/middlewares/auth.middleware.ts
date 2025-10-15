import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import { asyncHandler } from '../utils/AsyncHandler';
import { User } from '../models/user.model';

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user to request object
 *
 * @example
 * router.get('/profile', authenticate, (req, res) => {
 *   res.json({ user: req.user });
 * });
 */
export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
        userId: string;
      };

      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        throw new AppError('User not found', 401);
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }
);

/**
 * Role-based Authorization Middleware
 * Checks if user has required role(s)
 *
 * @example
 * router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  };
};
