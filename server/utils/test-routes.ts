/**
 * NetListLab API Route Verification Script
 * Calls every endpoint with sample data and logs pass/fail.
 *
 * Run: npx tsx utils/test-routes.ts
 * Make sure the server is running first: npm run dev
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3001';

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let passed = 0;
let failed = 0;

async function testRoute(
    label: string,
    method: string,
    path: string,
    options: { body?: unknown; expectedStatus?: number; authToken?: string } = {}
) {
    const { body, expectedStatus = 200, authToken } = options;
    const url = `${BASE_URL}${path}`;

    try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const statusOk = res.status === expectedStatus;

        if (statusOk) {
            console.log(`${GREEN}✅ PASS${RESET} ${label} [${res.status}]`);
            passed++;
        } else {
            let errBody = '';
            try {
                const j = await res.json();
                errBody = JSON.stringify(j).slice(0, 120);
            } catch { }
            console.log(`${RED}❌ FAIL${RESET} ${label} [expected ${expectedStatus}, got ${res.status}] ${errBody}`);
            failed++;
        }
    } catch (err: unknown) {
        const e = err as { message?: string };
        console.log(`${RED}❌ ERROR${RESET} ${label} — ${e.message}`);
        failed++;
    }
}

async function runTests() {
    console.log(`\n${BOLD}🔌 NetListLab API Route Tests${RESET}`);
    console.log(`   Base URL: ${BASE_URL}\n`);

    // ── Health Check ───────────────────────────────────────────────────────────
    console.log(`${YELLOW}── Health ──${RESET}`);
    await testRoute('GET /health', 'GET', '/health', { expectedStatus: 200 });

    // ── Public Project Routes ──────────────────────────────────────────────────
    console.log(`\n${YELLOW}── Projects (Public) ──${RESET}`);
    await testRoute('GET /api/projects', 'GET', '/api/projects', { expectedStatus: 200 });
    await testRoute('GET /api/projects?sort=starred', 'GET', '/api/projects?sort=starred', { expectedStatus: 200 });
    await testRoute('GET /api/projects?search=robot', 'GET', '/api/projects?search=robot', { expectedStatus: 200 });
    await testRoute('GET /api/projects?type=ELECTRONICS', 'GET', '/api/projects?type=ELECTRONICS', { expectedStatus: 200 });
    await testRoute('GET /api/projects/:id (seed)', 'GET', '/api/projects/seed-proj-001', { expectedStatus: 200 });
    await testRoute('GET /api/projects/:id (not found)', 'GET', '/api/projects/nonexistent-id', { expectedStatus: 404 });
    await testRoute('GET /api/projects/:id/views', 'GET', '/api/projects/seed-proj-001/views', { expectedStatus: 200 });

    // ── BOM ───────────────────────────────────────────────────────────────────
    console.log(`\n${YELLOW}── BOM (Public) ──${RESET}`);
    await testRoute('GET /api/projects/:id/bom', 'GET', '/api/projects/seed-proj-001/bom', { expectedStatus: 200 });
    await testRoute('GET /api/projects/:id/bom/csv', 'GET', '/api/projects/seed-proj-001/bom/csv', { expectedStatus: 200 });

    // ── Comments (Public) ─────────────────────────────────────────────────────
    console.log(`\n${YELLOW}── Comments (Public) ──${RESET}`);
    await testRoute('GET /api/projects/:id/comments', 'GET', '/api/projects/seed-proj-001/comments', { expectedStatus: 200 });
    await testRoute('GET /api/projects/:id/comments/steps', 'GET', '/api/projects/seed-proj-001/comments/steps', { expectedStatus: 200 });

    // ── Users (Public) ────────────────────────────────────────────────────────
    console.log(`\n${YELLOW}── Users (Public) ──${RESET}`);
    await testRoute('GET /api/users/:username', 'GET', '/api/users/arjun_builds', { expectedStatus: 200 });
    await testRoute('GET /api/users/:username (not found)', 'GET', '/api/users/this_user_does_not_exist_xyz', { expectedStatus: 404 });
    await testRoute('GET /api/users/:username/projects', 'GET', '/api/users/arjun_builds/projects', { expectedStatus: 200 });
    await testRoute('GET /api/users/:username/starred', 'GET', '/api/users/arjun_builds/starred', { expectedStatus: 200 });
    await testRoute('GET /api/users/:username/followers', 'GET', '/api/users/arjun_builds/followers', { expectedStatus: 200 });
    await testRoute('GET /api/users/:username/following', 'GET', '/api/users/arjun_builds/following', { expectedStatus: 200 });

    // ── Auth Required (no token = 401) ────────────────────────────────────────
    console.log(`\n${YELLOW}── Auth Guards (should return 401) ──${RESET}`);
    await testRoute('GET /api/users/me (no auth)', 'GET', '/api/users/me', { expectedStatus: 401 });
    await testRoute('POST /api/projects (no auth)', 'POST', '/api/projects', { body: { title: 'test' }, expectedStatus: 401 });
    await testRoute('POST /api/projects/:id/star (no auth)', 'POST', '/api/projects/seed-proj-001/star', { expectedStatus: 401 });
    await testRoute('POST /api/projects/:id/fork (no auth)', 'POST', '/api/projects/seed-proj-001/fork', { expectedStatus: 401 });
    await testRoute('GET /api/notifications (no auth)', 'GET', '/api/notifications', { expectedStatus: 401 });
    await testRoute('POST /api/projects/:id/comments (no auth)', 'POST', '/api/projects/seed-proj-001/comments', { body: { content: 'test' }, expectedStatus: 401 });
    await testRoute('POST /api/upload/image (no auth)', 'POST', '/api/upload/image', { expectedStatus: 401 });

    // ── Validation Errors (400) ───────────────────────────────────────────────
    console.log(`\n${YELLOW}── Validation (should return 400/401) ──${RESET}`);
    await testRoute('POST /api/auth/register (missing fields)', 'POST', '/api/auth/register', {
        body: { email: 'bad-email' },
        expectedStatus: 400,
    });

    // ── 404 ───────────────────────────────────────────────────────────────────
    console.log(`\n${YELLOW}── 404 ──${RESET}`);
    await testRoute('GET /api/nonexistent', 'GET', '/api/nonexistent-route-xyz', { expectedStatus: 404 });

    // ── Summary ───────────────────────────────────────────────────────────────
    const total = passed + failed;
    const pct = Math.round((passed / total) * 100);
    console.log(`\n${BOLD}── Results ──${RESET}`);
    console.log(`   Total:  ${total}`);
    console.log(`   ${GREEN}Passed: ${passed}${RESET}`);
    console.log(`   ${failed > 0 ? RED : GREEN}Failed: ${failed}${RESET}`);
    console.log(`   Score:  ${pct >= 80 ? GREEN : RED}${pct}%${RESET}\n`);

    if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
    console.error('Test runner error:', e.message);
    process.exit(1);
});
