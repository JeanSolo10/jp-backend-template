import { CustomError } from './customError.js';
import { HTTP_ERROR } from './errorCode.js';

export const InternalServerError = (message: string, errorCode?: number) => {
  return new CustomError(message, HTTP_ERROR.INTERNAL_SERVER_ERROR, errorCode);
};

export const NotFoundError = (message: string, errorCode?: number) => {
  return new CustomError(message, HTTP_ERROR.NOT_FOUND, errorCode ?? undefined);
};
