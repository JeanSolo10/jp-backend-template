import { jest } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';

type ReturnMessage = {
  message: string;
};

// --- Default Mock Implementations ---
// These are exported primarily if a test ever needs to reference or clear a default mock directly.
// However, the main pattern will be for tests to provide their own instances via overrides.

// For Functions
const mockFunctionGenericHandler = jest
  .fn<() => void>()
  .mockImplementation(() => {});

// For GraphQl Services
const mockServiceGenericHandler = jest
  .fn<() => Promise<ReturnMessage>>()
  .mockResolvedValue({
    message: 'Mocked GraphQlService handler: Not Implemented',
  });

// --- Mock Factory ---
export const mockDependenciesObject = {
  dbService: {
    pingDb: mockFunctionGenericHandler,
    connect: mockFunctionGenericHandler,
    disconnect: mockFunctionGenericHandler,
    useModel: mockFunctionGenericHandler,
  },
  services: {
    userService: {
      getUser: mockServiceGenericHandler,
      getUsers: mockServiceGenericHandler,
      createUser: mockServiceGenericHandler,
      updateUser: mockServiceGenericHandler,
      deleteUser: mockServiceGenericHandler,
    },
  },
};

// This function returns the object that will be used as the mock for './config/dependencies.js'
export const fullDependenciesMockFactory = (objOverrides: object) => {
  if (Object.keys(objOverrides).length > 0) {
    return { ...mockDependenciesObject, ...objOverrides };
  }
  return mockDependenciesObject;
};

// This functions returns the object that will be used as the mock for winston logger in './app.ts'
export const winstonLoggerMockFactory = () => ({
  logger: jest.fn().mockImplementation(() => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (next) {
        next();
      }
    };
  }),
  errorLogger: jest.fn().mockImplementation(() => {
    return (err: unknown, req: Request, res: Response, next: NextFunction) => {
      if (next) {
        next(err);
      }
    };
  }),
});
