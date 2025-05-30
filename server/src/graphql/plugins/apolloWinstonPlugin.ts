import { ApolloServerPlugin } from '@apollo/server';
import logger from '../../logger/logger.js';
import { GraphQLFormattedError } from 'graphql';

export const apolloWinstonPlugin: ApolloServerPlugin = {
  async requestDidStart(context) {
    const startTime = Date.now();
    const operationName = context.request.operationName ?? 'Unnamed Operation';
    const requestInfo = {
      operationName: operationName,
      query:
        process.env.NODE_ENV !== 'production'
          ? context.request.query
          : undefined, // Log query only in dev
      variables:
        process.env.NODE_ENV !== 'production'
          ? JSON.stringify(context.request.variables)
          : undefined, // Log vars only in dev (stringify for structure)
    };
    logger.info(`GraphQL Request Started: ${operationName}`, {
      graphql: requestInfo,
    });

    return {
      async didEncounterErrors(ctx) {
        const durationMs = Date.now() - startTime;
        ctx.errors.forEach((error: GraphQLFormattedError) => {
          logger.error(`GraphQL Error: ${error.message}`, {
            graphql: {
              operationName: ctx.request.operationName,
              durationMs: durationMs,
              // log variables in dev, be careful in prod!
              variables:
                process.env.NODE_ENV !== 'production'
                  ? JSON.stringify(ctx.request.variables)
                  : undefined,
            },
            error: {
              message: error.message,
              extensions: error.extensions,
              path: error.path,
            },
          });
        });
      },
      async willSendResponse(ctx) {
        const durationMs = Date.now() - startTime;
        logger.info(`GraphQL Request Completed: ${operationName}`, {
          graphql: {
            operationName: ctx.request.operationName,
            durationMs: durationMs,
            success: !(ctx.errors && ctx.errors.length > 0),
          },
        });
      },
    };
  },
};
