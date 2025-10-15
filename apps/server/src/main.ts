import app from './app';
import { DatabaseConfig } from './configs/database.config';
import { Logger } from './utils/logger';

/**
 * Server Entry Point
 * Initializes database connection and starts the HTTP server
 */
class Server {
  private readonly port: number;
  private readonly nodeEnv: string;

  constructor() {
    this.port = parseInt(process.env.PORT || '5000', 10);
    this.nodeEnv = process.env.NODE_ENV || 'development';
  }

  /**
   * Initialize and start the server
   */
  public async start(): Promise<void> {
    try {
      // Initialize database connection
      await this.initializeDatabase();

      // Start HTTP server
      const server = app.listen(this.port, () => {
        Logger.info(`🚀 Server running in ${this.nodeEnv} mode on port ${this.port}`);
        Logger.info(`📚 API Documentation: http://localhost:${this.port}/api-docs`);
        Logger.info(`🏥 Health Check: http://localhost:${this.port}/health`);

        if (this.nodeEnv === 'development') {
          Logger.info(
            `🔧 API Base URL: http://localhost:${this.port}/api/${process.env.API_VERSION || 'v1'}`
          );
        }
      });

      // Graceful shutdown handling
      this.setupGracefulShutdown(server);
    } catch (error) {
      Logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Initialize database connection with retry logic
   */
  private async initializeDatabase(): Promise<void> {
    try {
      const dbConfig = DatabaseConfig.getInstance();
      await dbConfig.connect();
      Logger.info('💾 Database initialized successfully');
    } catch (error) {
      Logger.error('❌ Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Setup graceful shutdown handlers
   */
  private setupGracefulShutdown(server: any): void {
    const gracefulShutdown = async (signal: string) => {
      Logger.info(`📤 ${signal} received. Starting graceful shutdown...`);

      // Stop accepting new connections
      server.close(async () => {
        Logger.info('🔌 HTTP server closed');

        try {
          // Close database connection
          const dbConfig = DatabaseConfig.getInstance();
          await dbConfig.disconnect();
          Logger.info('🗄️  Database connection closed');

          Logger.info('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          Logger.error('❌ Error during graceful shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after timeout
      setTimeout(() => {
        Logger.error('⏰ Graceful shutdown timeout. Forcing exit...');
        process.exit(1);
      }, 10000); // 10 seconds timeout
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

// Create and start server instance
const server = new Server();
server.start().catch((error) => {
  Logger.error('🚨 Server startup failed:', error);
  process.exit(1);
});
