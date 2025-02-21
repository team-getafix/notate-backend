import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

function formatErrors(errors: ValidationError[]): string {
  return errors
    .map((error) => {
      if (error.constraints) {
        return Object.values(error.constraints).join(", ");
      }
      return "";
    })
    .join(", ");
}

/**
 * A middleware that validates the request body against a given DTO class.
 * @param type - The DTO class to validate against.
 * @param skipMissingProperties - Whether to skip properties that are missing.
 */
export function validationMiddleware(
  type: any,
  skipMissingProperties = false
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req, res, next): Promise<void> => {
    const dto = plainToInstance(type, req.body);
    const errors = await validate(dto, { skipMissingProperties });

    if (errors.length > 0) {
      const errorMessage = formatErrors(errors);

      res.status(400).json({ message: errorMessage })

      return;
    }

    req.body = dto;
    next();
  };
}
