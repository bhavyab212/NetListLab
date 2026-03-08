import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import * as notificationsService from '../services/notifications.service';

const router = Router();

// GET /api/notifications
router.get('/', requireAuth, async (req: Request, res: Response) => {
    try {
        const notifications = await notificationsService.getNotifications(req.user!.id);
        res.json({ data: notifications });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// PATCH /api/notifications/read
router.patch('/read', requireAuth, async (req: Request, res: Response) => {
    try {
        await notificationsService.markAllRead(req.user!.id);
        res.json({ message: 'All notifications marked as read' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', requireAuth, async (req: Request, res: Response) => {
    try {
        await notificationsService.markOneRead(req.params['id'] as string, req.user!.id);
        res.json({ message: 'Notification marked as read' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
