/**
 * Extract a string param from Express req.params.
 * req.params values are typed as string | string[] in strict mode.
 */
export function param(value: string | string[]): string {
    return Array.isArray(value) ? value[0] : value;
}
