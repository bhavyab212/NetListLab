import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as authService from '../services/auth.service';

const router = Router();

const registerSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, 'Lowercase letters, numbers, underscores only'),
    full_name: z.string().min(1).max(100),
    avatar_url: z.string().url().optional(),
});

const syncSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
});

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
    try {
        const user = await authService.createUser(req.body);
        res.status(201).json({ data: user, message: 'User registered successfully' });
    } catch (error: unknown) {
        const e = error as { code?: string; message?: string };
        if (e.code === 'P2002') {
            res.status(409).json({ error: 'Username or email already exists' });
        } else {
            res.status(500).json({ error: e.message || 'Registration failed' });
        }
    }
});

// POST /api/auth/sync
router.post('/sync', requireAuth, validate(syncSchema), async (req: Request, res: Response) => {
    try {
        const user = await authService.syncUser(req.body.id, req.body.email);
        res.json({ data: user });
    } catch (error: unknown) {
        const e = error as { message?: string };
        res.status(500).json({ error: e.message || 'Sync failed' });
    }
});

export default router;
