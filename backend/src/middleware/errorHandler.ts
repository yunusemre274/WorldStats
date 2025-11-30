// Error Handler Middleware
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { config } from '../utils/config.js';

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    stack?: string;
  };
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(`Error handling request: ${req.method} ${req.path}`, {
    error: err.message,
    stack: err.stack,
  });

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Database operation failed',
        code: 'DATABASE_ERROR',
      },
    });
    return;
  }

  // Handle validation errors
  if (err.name === 'ZodError') {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: err,
      },
    });
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    };

    if (config.env === 'development') {
      response.error.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle unknown errors
  const response: ErrorResponse = {
    success: false,
    error: {
      message: config.env === 'production' 
        ? 'Internal server error' 
        : err.message,
      code: 'INTERNAL_ERROR',
    },
  };

  if (config.env === 'development') {
    response.error.stack = err.stack;
  }

  res.status(500).json(response);
}

// Not Found Handler
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.path}`,
      code: 'NOT_FOUND',
    },
  });
}
