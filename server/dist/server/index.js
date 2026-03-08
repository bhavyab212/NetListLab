"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load env vars first
dotenv_1.default.config();
// Route imports (will be filled in as each route file is created)
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const projects_1 = __importDefault(require("./routes/projects"));
const sections_1 = __importDefault(require("./routes/sections"));
const bom_1 = __importDefault(require("./routes/bom"));
const stars_1 = __importDefault(require("./routes/stars"));
const follows_1 = __importDefault(require("./routes/follows"));
const comments_1 = __importDefault(require("./routes/comments"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const forks_1 = __importDefault(require("./routes/forks"));
const upload_1 = __importDefault(require("./routes/upload"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// ─── Middleware Stack (order is important) ───────────────────────────────────
// 1. Security headers (must be first)
app.use((0, helmet_1.default)());
// 2. CORS — allow only our frontend origin
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// 3. Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// 4. Rate limiting — 100 requests per minute per IP
app.use((0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
}));
// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/sections', sections_1.default);
app.use('/api/projects', bom_1.default); // /api/projects/:id/bom
app.use('/api/bom', bom_1.default); // /api/bom/:itemId
app.use('/api/projects', stars_1.default); // /api/projects/:id/star
app.use('/api/users', follows_1.default); // /api/users/:username/follow
app.use('/api/projects', comments_1.default); // /api/projects/:id/comments
app.use('/api/comments', comments_1.default); // /api/comments/:commentId
app.use('/api/notifications', notifications_1.default);
app.use('/api/projects', forks_1.default); // /api/projects/:id/fork
app.use('/api/upload', upload_1.default);
// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// ─── Global Error Handler ────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err, _req, res, _next) => {
    console.error('[Error]', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
    });
});
// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🔌 NetListLab API running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health\n`);
});
exports.default = app;
//# sourceMappingURL=index.js.map