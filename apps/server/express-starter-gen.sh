#!/bin/bash

# Express TypeScript Starter Generator
# Usage: ./express-starter-gen.sh <project-name>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if project name is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide a project name${NC}"
    echo "Usage: ./express-starter-gen.sh <project-name>"
    exit 1
fi

PROJECT_NAME=$1

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Express TypeScript Starter Generator  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Create project directory
echo -e "${YELLOW}📁 Creating project directory: ${PROJECT_NAME}${NC}"
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

# Initialize npm project
echo -e "${YELLOW}📦 Initializing npm project...${NC}"
npm init -y

# Update package.json
echo -e "${YELLOW}⚙️  Configuring package.json...${NC}"
cat > package.json << 'EOF'
{
  "name": "express-typescript-starter",
  "version": "1.0.0",
  "description": "Production-ready Express TypeScript starter application",
  "main": "dist/main.js",
  "scripts": {
    "dev": "nodemon src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "keywords": ["express", "typescript", "api", "rest"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "compression": "^1.8.1",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^5.1.0",
    "express-rate-limit": "^8.1.0",
    "express-validator": "^7.2.1",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.19.1",
    "morgan": "^1.10.1",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/compression": "^1.8.1",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.3",
    "@types/express-rate-limit": "^5.1.3",
    "@types/jest": "^30.0.0",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/morgan": "^1.9.10",
    "@types/node": "^22.18.10",
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.8",
    "@typescript-eslint/eslint-plugin": "^8.46.1",
    "@typescript-eslint/parser": "^8.46.1",
    "eslint": "^9.37.0",
    "jest": "^30.2.0",
    "nodemon": "^3.1.10",
    "prettier": "^3.6.2",
    "ts-jest": "^29.4.5",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.2"
  }
}
EOF

# Install dependencies
echo -e "${YELLOW}📥 Installing all dependencies...${NC}"
npm install

# Create tsconfig.json
echo -e "${YELLOW}⚙️  Creating TypeScript configuration...${NC}"
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF

# Create nodemon.json
cat > nodemon.json << 'EOF'
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.test.ts"],
  "exec": "ts-node src/main.ts"
}
EOF

# Create .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": ["@typescript-eslint"],
  "env": {
    "node": true,
    "es6": true
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off"
  }
}
EOF

# Create .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
EOF

# Create jest.config.js
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
EOF

# Create .env.example
cat > .env.example << 'EOF'
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Create .env
cp .env.example .env

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Misc
*.pid
*.seed
*.pid.lock
EOF

# Create directory structure
echo -e "${YELLOW}📂 Creating directory structure...${NC}"
mkdir -p src/{configs,controllers,middlewares,models,routes,utils,types}

# Create configs/database.config.ts
cat > src/configs/database.config.ts << 'EOF'
import mongoose from 'mongoose';

/**
 * Database Configuration
 * Manages MongoDB connection with retry logic and error handling
 */
export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  /**
   * Connect to MongoDB with retry logic
   * @param maxRetries - Maximum number of connection attempts
   * @param retryDelay - Delay between retries in milliseconds
   */
  public async connect(maxRetries = 5, retryDelay = 5000): Promise<void> {
    if (this.isConnected) {
      console.log('📦 Already connected to MongoDB');
      return;
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/express-starter';
    let retries = 0;

    while (retries < maxRetries) {
      try {
        await mongoose.connect(mongoUri);
        this.isConnected = true;
        console.log('✅ Connected to MongoDB successfully');
        
        mongoose.connection.on('error', (error) => {
          console.error('❌ MongoDB connection error:', error);
          this.isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
          console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
          this.isConnected = false;
        });

        return;
      } catch (error) {
        retries++;
        console.error(`❌ MongoDB connection attempt ${retries}/${maxRetries} failed:`, error);
        
        if (retries < maxRetries) {
          console.log(`⏳ Retrying in ${retryDelay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          throw new Error('Failed to connect to MongoDB after multiple attempts');
        }
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await mongoose.disconnect();
    this.isConnected = false;
    console.log('🔌 Disconnected from MongoDB');
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
EOF

# Create configs/swagger.config.ts
cat > src/configs/swagger.config.ts << 'EOF'
import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express TypeScript API',
    version: '1.0.0',
    description: 'A production-ready Express TypeScript API with best practices',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}/api/${process.env.API_VERSION || 'v1'}`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);

export const swaggerUiOptions: SwaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Documentation',
};
EOF

# Create types/express.d.ts
cat > src/types/express.d.ts << 'EOF'
import { UserDocument } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
EOF

# Create utils/ApiResponse.ts
cat > src/utils/ApiResponse.ts << 'EOF'
/**
 * Standardized API Response Structure
 * Provides consistent response format across all endpoints
 */
export class ApiResponse<T = any> {
  public success: boolean;
  public message: string;
  public data?: T;
  public errors?: any[];
  public timestamp: string;

  constructor(success: boolean, message: string, data?: T, errors?: any[]) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Create a successful response
   * @example
   * return res.json(ApiResponse.success('User created', user));
   */
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse(true, message, data);
  }

  /**
   * Create an error response
   * @example
   * return res.status(400).json(ApiResponse.error('Invalid input', errors));
   */
  static error(message: string, errors?: any[]): ApiResponse {
    return new ApiResponse(false, message, undefined, errors);
  }
}
EOF

# Create utils/AsyncHandler.ts
cat > src/utils/AsyncHandler.ts << 'EOF'
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
EOF

# Create utils/logger.ts
cat > src/utils/logger.ts << 'EOF'
/**
 * Simple Logger Utility
 * Can be extended with Winston or other logging libraries
 */
export class Logger {
  static info(message: string, meta?: any): void {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || '');
  }

  static error(message: string, error?: any): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  }

  static warn(message: string, meta?: any): void {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || '');
  }

  static debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta || '');
    }
  }
}
EOF

# Create middlewares/error.middleware.ts
cat > src/middlewares/error.middleware.ts << 'EOF'
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
  res.status(500).json(
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
  res.status(404).json(
    ApiResponse.error(`Route ${req.originalUrl} not found`)
  );
};
EOF

# Create middlewares/auth.middleware.ts
cat > src/middlewares/auth.middleware.ts << 'EOF'
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
EOF

# Create middlewares/validate.middleware.ts
cat > src/middlewares/validate.middleware.ts << 'EOF'
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

    res.status(400).json(
      ApiResponse.error('Validation failed', formattedErrors)
    );
    return;
  }

  next();
};
EOF

# Create models/user.model.ts
cat > src/models/user.model.ts << 'EOF'
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Interface
 * Defines the structure of a User document
 */
export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User Schema
 * MongoDB schema definition with validation and middleware
 * 
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         isActive:
 *           type: boolean
 */
const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<UserDocument>('User', userSchema);
EOF

# Create controllers/auth.controller.ts
cat > src/controllers/auth.controller.ts << 'EOF'
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
    
    const token = jwt.sign(
      { userId: (user as any)._id },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );

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
    
    const token = jwt.sign(
      { userId: (user as any)._id },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );

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
EOF

# Create controllers/user.controller.ts
cat > src/controllers/user.controller.ts << 'EOF'
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
EOF

# Create routes/auth.routes.ts
cat > src/routes/auth.routes.ts << 'EOF'
import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  AuthController.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  AuthController.login
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
router.get('/me', authenticate, AuthController.getMe);

export default router;
EOF

# Create routes/user.routes.ts
cat > src/routes/user.routes.ts << 'EOF'
import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/', authenticate, authorize('admin'), UserController.getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 */
router.get('/:id', authenticate, UserController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put(
  '/:id',
  authenticate,
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail(),
  ],
  validate,
  UserController.updateUser
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/:id', authenticate, authorize('admin'), UserController.deleteUser);

export default router
EOF

# Create app.ts
cat > src/app.ts << 'EOF'
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

// Import middlewares
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// Import configurations
import { swaggerSpec, swaggerUiOptions } from './configs/swagger.config';

// Import utilities
import { Logger } from './utils/logger';

// Load environment variables
dotenv.config();

/**
 * Express Application Setup
 * Configures middleware, routes, and error handling
 */
class App {
  public app: Application;
  private readonly apiVersion: string;

  constructor() {
    this.app = express();
    this.apiVersion = process.env.API_VERSION || 'v1';
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  /**
   * Initialize application middlewares
   */
  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Compression middleware
    this.app.use(compression());

    // Request logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Rate limiting
    const limiter = rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // Limit each IP to 100 requests per windowMs
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging middleware
    this.app.use((req, _res, next) => {
      Logger.info(`${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      next();
    });
  }

  /**
   * Initialize application routes
   */
  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (_req, res) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      });
    });

    // API routes
    const apiPrefix = `/api/${this.apiVersion}`;
    this.app.use(`${apiPrefix}/auth`, authRoutes);
    this.app.use(`${apiPrefix}/users`, userRoutes);

    // API documentation route
    this.app.get(`${apiPrefix}/docs`, (_req, res) => {
      res.redirect('/api-docs');
    });
  }

  /**
   * Initialize Swagger documentation
   */
  private initializeSwagger(): void {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
    
    // Swagger JSON endpoint
    this.app.get('/api-docs.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    Logger.info('Swagger documentation available at /api-docs');
  }

  /**
   * Initialize error handling
   */
  private initializeErrorHandling(): void {
    // 404 handler for undefined routes
    this.app.all('/*', notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  /**
   * Get Express application instance
   */
  public getApp(): Application {
    return this.app;
  }
}

export default new App().getApp();
EOF

# Create main.ts
cat > src/main.ts << 'EOF'
import app from './app';
import { DatabaseConfig } from './configs/database.config';
import { Logger } from './utils/logger';

/**
 * Server Configuration and Startup
 * Handles database connection, server startup, and graceful shutdown
 */
class Server {
  private port: number;
  private db: DatabaseConfig;

  constructor() {
    this.port = parseInt(process.env.PORT || '5000');
    this.db = DatabaseConfig.getInstance();
    
    this.setupEventHandlers();
  }

  /**
   * Start the server
   */
  public async start(): Promise<void> {
    try {
      // Connect to database
      await this.db.connect();
      
      // Start HTTP server
      const server = app.listen(this.port, () => {
        Logger.info(`🚀 Server running on port ${this.port}`);
        Logger.info(`📚 API Documentation: http://localhost:${this.port}/api-docs`);
        Logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      });

      // Set server timeout
      server.timeout = 60000; // 60 seconds

      // Handle server errors
      server.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          Logger.error(`Port ${this.port} is already in use`);
          process.exit(1);
        } else {
          Logger.error('Server error:', error);
        }
      });

    } catch (error) {
      Logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Setup process event handlers for graceful shutdown
   */
  private setupEventHandlers(): void {
    // Graceful shutdown function
    const gracefulShutdown = async (signal: string) => {
      Logger.info(`🔄 ${signal} received. Starting graceful shutdown...`);
      
      try {
        await this.db.disconnect();
        Logger.info('✅ Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        Logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    // Handle termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      Logger.error('💥 Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      Logger.error('🔥 Unhandled Rejection:', { reason, promise });
      gracefulShutdown('UNHANDLED_REJECTION');
    });
  }
}

// Start the server
# Start the server
const server = new Server();
server.start();
EOF

# Create README.md
cat > README.md << 'EOF'
# Express TypeScript Starter

A production-ready Express.js application built with TypeScript, featuring authentication, database integration, and comprehensive API documentation.

## Features

- 🚀 **Express.js** with TypeScript
- 🔐 **JWT Authentication** with role-based authorization
- 🛡️ **Security** with Helmet, CORS, and rate limiting
- 📊 **MongoDB** integration with Mongoose
- 📚 **API Documentation** with Swagger
- ✅ **Input Validation** with express-validator
- 🧪 **Testing** setup with Jest
- 🎨 **Code Formatting** with Prettier and ESLint
- 📝 **Structured Logging**
- 🔄 **Auto-reload** in development with Nodemon

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/express-starter` |
| `JWT_SECRET` | JWT signing secret | `secret` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run lint` | Lint code with ESLint |
| `npm run lint:fix` | Fix linting issues automatically |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Project Structure

```
src/
├── configs/          # Configuration files
├── controllers/      # Route controllers
├── middlewares/      # Custom middleware
├── models/          # Database models
├── routes/          # Express routes
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── main.ts          # Server entry point
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user profile

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

## License

MIT
EOF

echo ""
echo -e "${GREEN}✅ Express TypeScript starter project created successfully!${NC}"
echo ""
echo -e "${BLUE}📁 Project location: ${PROJECT_NAME}${NC}"
echo -e "${BLUE}🚀 To get started:${NC}"
echo -e "   ${YELLOW}cd ${PROJECT_NAME}${NC}"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo -e "${BLUE}📚 API Documentation will be available at: http://localhost:5000/api-docs${NC}"
echo -e "${BLUE}🌐 Health check: http://localhost:5000/health${NC}"
echo ""
EOF

export default router