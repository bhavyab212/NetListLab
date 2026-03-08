"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
/**
 * Zod validation middleware factory.
 * Usage: router.post('/route', validate(myZodSchema), handler)
 *
 * On failure → 400 with field-level error details
 * On success → calls next() and body is replaced with parsed (coerced) data
 */
function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error;
            const details = {};
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
//# sourceMappingURL=validate.js.map