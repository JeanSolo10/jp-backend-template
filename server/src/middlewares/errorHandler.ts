import { NextFunction, Request, Response } from 'express';
import { getErrorMessage } from '../errors/helper.js';
import { CustomError } from '../errors/customError.js';

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof CustomError) {
    res.status(error.status).json({
      error: {
        message: error.message,
        code: error.errorCode,
      },
    });
    return;
  }
  res.status(500).json({
    error: {
      message: getErrorMessage(error),
    },
  });
};
