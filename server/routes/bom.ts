import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as bomService from '../services/bom.service';
import * as projectsService from '../services/projects.service';

const router = Router();

const addBOMSchema = z.object({
    component_name: z.string().min(1).max(200),
    quantity: z.number().int().min(1),
    description: z.string().max(500).optional(),
    part_number: z.string().max(100).optional(),
    buy_link: z.string().url().optional().or(z.literal('')),
    estimated_price: z.number().positive().optional(),
    currency: z.enum(['INR', 'USD', 'EUR', 'GBP']).optional(),
});

// GET /api/projects/:id/bom
router.get('/:id/bom', async (req: Request, res: Response) => {
    try {
        const items = await bomService.getBOMItems(req.params['id'] as string);
        res.json({ data: items });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// GET /api/projects/:id/bom/csv
router.get('/:id/bom/csv', async (req: Request, res: Response) => {
    try {
        const items = await bomService.getBOMItems(req.params['id'] as string);
        const csv = bomService.generateCSV(items);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="bom-${req.params['id']}.csv"`);
        res.send(csv);
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// POST /api/projects/:id/bom
router.post('/:id/bom', requireAuth, validate(addBOMSchema), async (req: Request, res: Response) => {
    try {
        const id = req.params['id'] as string;
        const project = await projectsService.getProjectById(id);
        if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
        if (project.author_id !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }
        const item = await bomService.addBOMItem(id, req.body);
        res.status(201).json({ data: item, message: 'BOM item added' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// PATCH /api/bom/:itemId
router.patch('/bom/:itemId', requireAuth, validate(addBOMSchema.partial()), async (req: Request, res: Response) => {
    try {
        const itemId = req.params['itemId'] as string;
        const item = await bomService.getBOMItemById(itemId);
        if (!item) { res.status(404).json({ error: 'BOM item not found' }); return; }
        if (item.project.author_id !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }
        const updated = await bomService.updateBOMItem(itemId, req.body);
        res.json({ data: updated, message: 'BOM item updated' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// DELETE /api/bom/:itemId
router.delete('/bom/:itemId', requireAuth, async (req: Request, res: Response) => {
    try {
        const itemId = req.params['itemId'] as string;
        const item = await bomService.getBOMItemById(itemId);
        if (!item) { res.status(404).json({ error: 'BOM item not found' }); return; }
        if (item.project.author_id !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }
        await bomService.deleteBOMItem(itemId);
        res.json({ message: 'BOM item deleted' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
