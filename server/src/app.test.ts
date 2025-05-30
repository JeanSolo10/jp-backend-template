// app.test.ts (Conceptual using unstable_mockModule)
import request from 'supertest';
import { jest } from '@jest/globals';
import { Express } from 'express';
import {
  mockDependenciesObject,
  fullDependenciesMockFactory,
  winstonLoggerMockFactory,
} from './test/mocks/dependencies.mock.js';

describe('GET /health-check', () => {
  let app: Express;

  // declare mock for testing
  const mockDbService = {
    ...mockDependenciesObject.dbService,
    pingDb: jest.fn<() => Promise<boolean>>(),
  };

  beforeAll(async () => {
    // https://jestjs.io/docs/ecmascript-modules
    jest.unstable_mockModule('./config/dependencies.js', () =>
      fullDependenciesMockFactory({
        dbService: mockDbService,
      }),
    );
    jest.mock('express-winston', winstonLoggerMockFactory);
    const appModule = await import('./app.js');
    app = appModule.default;
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it('should return 200 status...', async () => {
    mockDbService.pingDb.mockResolvedValue(true);
    const response = await request(app).get('/health-check');
    expect(mockDbService.pingDb).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
  });

  it('should return 503 status when DB ping fails', async () => {
    mockDbService.pingDb.mockResolvedValue(false);

    const response = await request(app).get('/health-check');

    expect(mockDbService.pingDb).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(503);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Service Unavailable - Database connection failed',
        dbStatus: 'disconnected',
      }),
    );
  });
});
