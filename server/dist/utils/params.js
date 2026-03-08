"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.param = param;
/**
 * Extract a string param from Express req.params.
 * req.params values are typed as string | string[] in strict mode.
 */
function param(value) {
    return Array.isArray(value) ? value[0] : value;
}
