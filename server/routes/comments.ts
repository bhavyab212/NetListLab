import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as commentsService from '../services/comments.service';

const router = Router();

const addCommentSchema = z.object({
    content: z.string().min(1).max(1000),
    section_id: z.string().uuid().optional(),
    parent_comment_id: z.string().uuid().optional(),
});

// GET /api/projects/:id/comments
router.get('/:id/comments', async (req: Request, res: Response) => {
    try {
        const comments = await commentsService.getProjectComments(req.params['id'] as string);
        res.json({ data: comments });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// GET /api/projects/:id/comments/steps
router.get('/:id/comments/steps', async (req: Request, res: Response) => {
    try {
        const comments = await commentsService.getStepComments(req.params['id'] as string);
        res.json({ data: comments });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// POST /api/projects/:id/comments
router.post('/:id/comments', requireAuth, validate(addCommentSchema), async (req: Request, res: Response) => {
    try {
        const comment = await commentsService.addComment(req.user!.id, req.params['id'] as string, req.body);
        res.status(201).json({ data: comment, message: 'Comment added' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// DELETE /api/comments/:commentId
router.delete('/comments/:commentId', requireAuth, async (req: Request, res: Response) => {
    try {
        await commentsService.deleteComment(req.params['commentId'] as string, req.user!.id);
        res.json({ message: 'Comment deleted' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// POST /api/comments/:commentId/upvote
router.post('/comments/:commentId/upvote', requireAuth, async (req: Request, res: Response) => {
    try {
        const comment = await commentsService.toggleUpvote(req.params['commentId'] as string);
        res.json({ data: comment });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
