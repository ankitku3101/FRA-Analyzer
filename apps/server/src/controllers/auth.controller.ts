import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/AsyncHandler';
import { AppError } from '../middlewares/error.middleware';

/**
 * Authentication Controller
 * Handles user registration, login, and authentication logic
 */
export class AuthController {
  /**
   * Register a new user
   * @route POST /api/v1/auth/register
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign({ userId: (user as any)._id }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    } as jwt.SignOptions);

    res.status(201).json(
      ApiResponse.success('User registered successfully', {
        user: {
          id: (user as any)._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      })
    );
  });

  /**
   * Login user
   * @route POST /api/v1/auth/login
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign({ userId: (user as any)._id }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    } as jwt.SignOptions);

    res.json(
      ApiResponse.success('Login successful', {
        user: {
          id: (user as any)._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      })
    );
  });

  /**
   * Get current user profile
   * @route GET /api/v1/auth/me
   */
  static getMe = asyncHandler(async (req: Request, res: Response) => {
    res.json(
      ApiResponse.success('Profile retrieved', {
        user: req.user,
      })
    );
  });
}
