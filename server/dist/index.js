"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
// Health routes (no auth, no prefix)
app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'NetListLab API is running',
        version: '1.0.0'
    });
});
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
// API Routes
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const sections_1 = __importDefault(require("./routes/sections"));
const bom_1 = __importDefault(require("./routes/bom"));
const stars_1 = __importDefault(require("./routes/stars"));
const follows_1 = __importDefault(require("./routes/follows"));
const comments_1 = __importDefault(require("./routes/comments"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const forks_1 = __importDefault(require("./routes/forks"));
const upload_1 = __importDefault(require("./routes/upload"));
app.use('/api/users', users_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/sections', sections_1.default);
app.use('/api/bom', bom_1.default);
app.use('/api/stars', stars_1.default);
app.use('/api/follows', follows_1.default);
app.use('/api/comments', comments_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/forks', forks_1.default);
app.use('/api/upload', upload_1.default);
// 404 handler — MUST be last
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Global error handler — MUST be after 404
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});
app.listen(PORT, () => {
    console.log(`NetListLab API running on port ${PORT}`);
});
exports.default = app;
