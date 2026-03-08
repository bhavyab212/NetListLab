import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import * as forksService from '../services/forks.service';

const router = Router();

// POST /api/projects/:id/fork
router.post('/:id/fork', requireAuth, async (req: Request, res: Response) => {
    try {
        const forked = await forksService.forkProject(req.user!.id, req.params['id'] as string);
        res.status(201).json({ data: forked, message: 'Project forked to your drafts' });
    } catch (error: unknown) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default router;
