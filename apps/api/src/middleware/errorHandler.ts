import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log the error for debugging
  console.error('Global error handler:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Prisma-specific errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          error: 'A record with this value already exists',
          code: 'DUPLICATE_ENTRY'
        });
      case 'P2025':
        return res.status(404).json({
          success: false,
          error: 'Record not found',
          code: 'NOT_FOUND'
        });
      case 'P2003':
        return res.status(400).json({
          success: false,
          error: 'Foreign key constraint failed',
          code: 'INVALID_REFERENCE'
        });
      default:
        return res.status(500).json({
          success: false,
          error: 'Database error occurred',
          code: 'DATABASE_ERROR'
        });
    }
  }

  // Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      error: 'Invalid data provided',
      code: 'VALIDATION_ERROR'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(403).json({
      success: false,
      error: 'Invalid authentication token',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(403).json({
      success: false,
      error: 'Authentication token expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR'
  });
}
