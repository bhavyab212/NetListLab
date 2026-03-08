/**
 * NetListLab API Route Verification Script
 * Calls every endpoint with sample data and logs pass/fail.
 *
 * Run: npx tsx utils/test-routes.ts
 * Make sure the server is running first: npm run dev
 */
declare const BASE_URL: string;
declare const GREEN = "\u001B[32m";
declare const RED = "\u001B[31m";
declare const YELLOW = "\u001B[33m";
declare const RESET = "\u001B[0m";
declare const BOLD = "\u001B[1m";
declare let passed: number;
declare let failed: number;
declare function test(label: string, method: string, path: string, options?: {
    body?: unknown;
    expectedStatus?: number;
    authToken?: string;
}): Promise<void>;
declare function runTests(): Promise<void>;
//# sourceMappingURL=test-routes.d.ts.map