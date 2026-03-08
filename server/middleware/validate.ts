import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Zod validation middleware factory.
 * Usage: router.post('/route', validate(myZodSchema), handler)
 *
 * On failure → 400 with field-level error details
 * On success → calls next() and body is replaced with parsed (coerced) data
 */
export function validate(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error as ZodError;
            const details: Record<string, string> = {};

            errors.errors.forEach((err) => {
                const field = err.path.join('.');
                details[field] = err.message;
            });

            res.status(400).json({
                error: 'Validation failed',
                details,
            });
            return;
        }

        // Replace body with Zod-parsed (and type-coerced) data
        req.body = result.data;
        next();
    };
}
