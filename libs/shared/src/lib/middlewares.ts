import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

type ValidatorSchemas<
  TParams extends ParamsDictionary = ParamsDictionary,
  TQuery extends ParsedQs = ParsedQs,
  TBody = unknown
> = {
  body?: ZodSchema<TBody>;
  query?: ZodSchema<TQuery>;
  params?: ZodSchema<TParams>;
};

export function validateRequest<
  TParams extends ParamsDictionary = ParamsDictionary,
  TQuery extends ParsedQs = ParsedQs,
  TBody = unknown
>(
  schemas: ValidatorSchemas<TParams, TQuery, TBody>
): RequestHandler<TParams, unknown, TBody, TQuery> {
  return async (
    req: Request<TParams, unknown, TBody, TQuery>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          errors: error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
