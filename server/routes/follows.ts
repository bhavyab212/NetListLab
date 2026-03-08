import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import * as followsService from '../services/follows.service';

const router = Router();

// POST /api/users/:username/follow
router.post('/:username/follow', requireAuth, async (req: Request, res: Response) => {
    try {
        const result = await followsService.toggleFollow(req.user!.id, req.params['username'] as string);
        if (result === null) { res.status(404).json({ error: 'User not found' }); return; }
        res.json({ data: result, message: result.following ? 'Now following' : 'Unfollowed' });
    } catch (error: unknown) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// GET /api/users/:username/followers
router.get('/:username/followers', async (req: Request, res: Response) => {
    try {
        const followers = await followsService.getFollowers(req.params['username'] as string);
        if (followers === null) { res.status(404).json({ error: 'User not found' }); return; }
        res.json({ data: followers });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// GET /api/users/:username/following
router.get('/:username/following', async (req: Request, res: Response) => {
    try {
        const following = await followsService.getFollowing(req.params['username'] as string);
        if (following === null) { res.status(404).json({ error: 'User not found' }); return; }
        res.json({ data: following });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
