import { plainToClass } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ParameterException } from "../exceptions/parameter.exception";

export function validateBody(schema: { new (): any }) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const target = plainToClass(schema, req.body);
    try {
      await validateOrReject(target);
      next();
    } catch (error: any) {
      const errorMsgs: Array<string> = [];
      if (Array.isArray(error)) {
        error.forEach((err) => {
          if (err instanceof ValidationError) {
            if (err.constraints) {
              Object.keys(err.constraints).forEach((value) => {
                errorMsgs.push(err.constraints[value]);
              });
            } else {
              errorMsgs.push(err.toString());
            }
          } else {
            errorMsgs.push(err.toString());
          }
        });
      } else {
        errorMsgs.push(error.toString());
      }

      next(new ParameterException(errorMsgs));
    }
  };
}

export function validateQuery(name: string, required?: boolean) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const data = req.query[name];
    if (data === "") {
      req.query[name] = undefined;
    }

    if (required && !data) {
      next(new ParameterException([`${name} is Required`]));
    }
    next();
  };
}

export function validateParam(name: string, required?: boolean) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const data = req.params[name];
    if (required && !data) {
      next(new ParameterException([`${name} is Required`]));
    }
    next();
  };
}
