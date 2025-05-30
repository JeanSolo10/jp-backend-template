import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

type RequestValidators = {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
};

export const validateRequest = (validators: RequestValidators) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.body) {
        await validators.body.parseAsync(req.body);
      }
      if (validators.params) {
        await validators.params.parseAsync(req.params);
      }
      if (validators.query) {
        await validators.query.parseAsync(req.query);
      }
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        res.status(422).json({ error: error.errors });
      }
      // pass other errors to the Express error handler
      next(error);
    }
  };
};
