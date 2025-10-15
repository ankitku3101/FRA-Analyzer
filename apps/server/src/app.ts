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
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
          },
        },
      })
    );

    // CORS configuration
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );

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
    this.app.use(notFoundHandler);

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
