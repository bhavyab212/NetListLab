import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import * as starsService from '../services/stars.service';

const router = Router();

// POST /api/projects/:id/star
router.post('/:id/star', requireAuth, async (req: Request, res: Response) => {
    try {
        const result = await starsService.toggleStar(req.user!.id, req.params['id'] as string);
        res.json({ data: result, message: result.starred ? 'Project starred' : 'Star removed' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// GET /api/projects/:id/starred
router.get('/:id/starred', requireAuth, async (req: Request, res: Response) => {
    try {
        const result = await starsService.isProjectStarred(req.user!.id, req.params['id'] as string);
        res.json({ data: result });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
