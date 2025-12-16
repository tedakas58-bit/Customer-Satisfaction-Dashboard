import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return res.status(400).json({
      error: true,
      message: 'Validation Error',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    return res.status(400).json({
      error: true,
      message: 'Duplicate field value entered',
      timestamp: new Date().toISOString()
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: true,
      message: 'Invalid token',
      timestamp: new Date().toISOString()
    });
  }

  // Default error
  return res.status(error.statusCode || 500).json({
    error: true,
    message: error.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
};