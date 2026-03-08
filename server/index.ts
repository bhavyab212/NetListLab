import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load env vars first
dotenv.config();

// Route imports (will be filled in as each route file is created)
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import projectRoutes from './routes/projects';
import sectionRoutes from './routes/sections';
import bomRoutes from './routes/bom';
import starRoutes from './routes/stars';
import followRoutes from './routes/follows';
import commentRoutes from './routes/comments';
import notificationRoutes from './routes/notifications';
import forkRoutes from './routes/forks';
import uploadRoutes from './routes/upload';

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware Stack (order is important) ───────────────────────────────────

// 1. Security headers (must be first)
app.use(helmet());

// 2. CORS — allow only our frontend origin
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// 3. Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Rate limiting — 100 requests per minute per IP
app.use(
    rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many requests, please try again later.' },
    })
);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/projects', bomRoutes);       // /api/projects/:id/bom
app.use('/api/bom', bomRoutes);            // /api/bom/:itemId
app.use('/api/projects', starRoutes);      // /api/projects/:id/star
app.use('/api/users', followRoutes);       // /api/users/:username/follow
app.use('/api/projects', commentRoutes);   // /api/projects/:id/comments
app.use('/api/comments', commentRoutes);   // /api/comments/:commentId
app.use('/api/notifications', notificationRoutes);
app.use('/api/projects', forkRoutes);      // /api/projects/:id/fork
app.use('/api/upload', uploadRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
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

export default app;
