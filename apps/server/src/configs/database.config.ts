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
