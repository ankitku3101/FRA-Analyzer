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
