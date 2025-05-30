import { CustomError } from './customError.js';

export function getErrorMessage(error: unknown) {
  if (error instanceof CustomError || error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'An unknown error has occurred';
}
