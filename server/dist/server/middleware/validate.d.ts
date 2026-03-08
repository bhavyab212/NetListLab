import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
/**
 * Zod validation middleware factory.
 * Usage: router.post('/route', validate(myZodSchema), handler)
 *
 * On failure → 400 with field-level error details
 * On success → calls next() and body is replaced with parsed (coerced) data
 */
export declare function validate(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map