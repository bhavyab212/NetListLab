import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as usersService from '../services/users.service';

const router = Router();

const updateProfileSchema = z.object({
    username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/).optional(),
    full_name: z.string().min(1).max(100).optional(),
    bio: z.string().max(300).optional(),
    avatar_url: z.string().url().optional(),
    location: z.string().max(100).optional(),
    website_url: z.string().url().optional().or(z.literal('')),
    github_url: z.string().url().optional().or(z.literal('')),
    linkedin_url: z.string().url().optional().or(z.literal('')),
    twitter_url: z.string().url().optional().or(z.literal('')),
    field_of_work: z.array(z.string()).optional(),
    skill_tags: z.array(z.string()).optional(),
    current_role: z.string().optional(),
    institution: z.string().optional(),
});

// GET /api/users/me
router.get('/me', requireAuth, async (req: Request, res: Response) => {
    try {
        const user = await usersService.getUserById(req.user!.id);
        if (!user) { res.status(404).json({ error: 'User not found' }); return; }
        res.json({ data: user });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// PATCH /api/users/me
router.patch('/me', requireAuth, validate(updateProfileSchema), async (req: Request, res: Response) => {
    try {
        const user = await usersService.updateUser(req.user!.id, req.body);
        res.json({ data: user, message: 'Profile updated' });
    } catch (error: unknown) {
        const e = error as { code?: string; message?: string };
        if (e.code === 'P2002') {
            res.status(409).json({ error: 'Username already taken' });
        } else {
            res.status(500).json({ error: e.message });
        }
    }
});

// GET /api/users/:username
router.get('/:username', async (req: Request, res: Response) => {
    try {
        const user = await usersService.getUserByUsername(req.params['username'] as string);
        if (!user) { res.status(404).json({ error: 'User not found' }); return; }
        res.json({ data: user });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// GET /api/users/:username/projects
router.get('/:username/projects', async (req: Request, res: Response) => {
    try {
        const projects = await usersService.getUserProjects(req.params['username'] as string, req.user?.id);
        if (projects === null) { res.status(404).json({ error: 'User not found' }); return; }
        res.json({ data: projects });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// GET /api/users/:username/starred
router.get('/:username/starred', async (req: Request, res: Response) => {
    try {
        const projects = await usersService.getUserStarred(req.params['username'] as string);
        if (projects === null) { res.status(404).json({ error: 'User not found' }); return; }
        res.json({ data: projects });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
