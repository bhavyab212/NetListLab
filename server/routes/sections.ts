import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as sectionsService from '../services/sections.service';
import * as projectsService from '../services/projects.service';

const router = Router();

const addSectionSchema = z.object({
    section_type: z.enum(['OVERVIEW', 'BOM', 'SCHEMATIC', 'BUILD_STEPS', 'CODE', 'RESULT', 'CHALLENGES', 'DOWNLOADS', 'CUSTOM']),
    title: z.string().min(1).max(100),
    content_markdown: z.string().optional(),
    order_index: z.number().int().min(0),
});

const updateSectionSchema = addSectionSchema.partial();

const reorderSchema = z.object({
    sections: z.array(z.object({
        id: z.string().uuid(),
        order_index: z.number().int().min(0),
    })),
});

// POST /api/projects/:id/sections
router.post('/projects/:id/sections', requireAuth, validate(addSectionSchema), async (req: Request, res: Response) => {
    try {
        const id = req.params['id'] as string;
        const project = await projectsService.getProjectById(id);
        if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
        if (project.author_id !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }
        const section = await sectionsService.addSection(id, req.body);
        res.status(201).json({ data: section, message: 'Section added' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// PATCH /api/sections/:sectionId
router.patch('/sections/:sectionId', requireAuth, validate(updateSectionSchema), async (req: Request, res: Response) => {
    try {
        const sectionId = req.params['sectionId'] as string;
        const section = await sectionsService.getSectionById(sectionId);
        if (!section) { res.status(404).json({ error: 'Section not found' }); return; }
        if (section.project.author_id !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }
        const updated = await sectionsService.updateSection(sectionId, req.body);
        res.json({ data: updated, message: 'Section updated' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// DELETE /api/sections/:sectionId
router.delete('/sections/:sectionId', requireAuth, async (req: Request, res: Response) => {
    try {
        const sectionId = req.params['sectionId'] as string;
        const section = await sectionsService.getSectionById(sectionId);
        if (!section) { res.status(404).json({ error: 'Section not found' }); return; }
        if (section.project.author_id !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }
        await sectionsService.deleteSection(sectionId);
        res.json({ message: 'Section deleted' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// PATCH /api/projects/:id/sections/reorder
router.patch('/projects/:id/sections/reorder', requireAuth, validate(reorderSchema), async (req: Request, res: Response) => {
    try {
        const id = req.params['id'] as string;
        const project = await projectsService.getProjectById(id);
        if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
        if (project.author_id !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }
        const updated = await sectionsService.reorderSections(id, req.body.sections);
        res.json({ data: updated, message: 'Sections reordered' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
