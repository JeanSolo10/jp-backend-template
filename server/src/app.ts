import express, { Request, Response, Express, NextFunction } from 'express';
import cors from 'cors';
import registerRoutes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from './graphql/index.js';
import { resolvers } from './graphql/index.js';
import { expressMiddleware } from '@apollo/server/express4';
import logger from './logger/logger.js';
import expressWinston from 'express-winston';
import { apolloWinstonPlugin } from './graphql/plugins/apolloWinstonPlugin.js';
import helmet from 'helmet';
import { dbService } from './config/dependencies.js';
import { errorHandler } from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// dotenv config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

const app: Express = express();
// security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        // configuration needed to allow for apollo-server playground
        imgSrc: [
          `'self'`,
          'data:',
          'apollo-server-landing-page.cdn.apollographql.com',
        ],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        manifestSrc: [
          `'self'`,
          'apollo-server-landing-page.cdn.apollographql.com',
        ],
        frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
      },
    },
  }),
);

// apply logger
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    msg: '[{{res.statusCode}}] HTTP {{req.method}} | {{req.url}} | {{res.responseTime}}ms',
    expressFormat: false,
    colorize: process.env.NODE_ENV !== 'production',
  }),
);

// apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// https://expressjs.com/en/guide/behind-proxies.html - access to ip address
app.enable('trust proxy');

// start apollo server instance
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [apolloWinstonPlugin],
  introspection: process.env.NODE_ENV != 'production',
});
await apolloServer.start();
app.use('/graphql', expressMiddleware(apolloServer));

// --- Health Check Endpoint ---
app.get(
  '/health-check',
  async (req: Request, res: Response, next: NextFunction) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
      dbStatus: 'disconnected',
    };

    try {
      const isDbConnected = await dbService.pingDb();

      if (isDbConnected) {
        healthcheck.message = 'OK';
        healthcheck.dbStatus = 'connected';
        res.status(200).json(healthcheck);
        return;
      } else {
        healthcheck.message =
          'Service Unavailable - Database connection failed';
        healthcheck.dbStatus = 'disconnected';
        res.status(503).json(healthcheck);
      }
    } catch (error: unknown) {
      healthcheck.message = 'Health check failed with an error';
      logger.error('Health check endpoint error:', {
        error: error instanceof Error ? error.message : 'unknown error',
      });
      res.status(500).json(healthcheck);
      next(error);
    }
  },
);

// routes
registerRoutes(app);

// catch errors passed via next(error) or thrown in routes
app.use(
  expressWinston.errorLogger({
    winstonInstance: logger,
    msg: '[{{res.statusCode}}] HTTP {{req.method}} | {{req.url}} | {{res.responseTime}}ms',
  }),
);

app.use(errorHandler);

export default app;
