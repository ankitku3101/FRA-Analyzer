import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/AsyncHandler';
import { AppError } from '../middlewares/error.middleware';

/**
 * User Controller
 * Handles CRUD operations for users
 */
export class UserController {
  /**
   * Get all users (Admin only)
   * @route GET /api/v1/users
   */
  static getUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await User.find().select('-password');

    res.json(
      ApiResponse.success('Users retrieved successfully', {
        count: users.length,
        users,
      })
    );
  });

  /**
   * Get user by ID
   * @route GET /api/v1/users/:id
   */
  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json(ApiResponse.success('User retrieved successfully', { user }));
  });

  /**
   * Update user
   * @route PUT /api/v1/users/:id
   */
  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json(ApiResponse.success('User updated successfully', { user }));
  });

  /**
   * Delete user
   * @route DELETE /api/v1/users/:id
   */
  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json(ApiResponse.success('User deleted successfully'));
  });
}
