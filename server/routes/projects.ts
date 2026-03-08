import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as projectsService from '../services/projects.service';

const router = Router();

const createProjectSchema = z.object({
    title: z.string().min(1).max(100),
    tagline: z.string().max(200).optional(),
    project_type: z.enum(['ELECTRONICS', 'SOFTWARE', 'MECHANICAL', 'ROBOTICS', 'IOT', 'AI_ML', 'DESIGN', 'RESEARCH', 'OTHER']),
    difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
    tags: z.array(z.string()).max(10).optional(),
    github_url: z.string().url().optional().or(z.literal('')),
    cover_image_url: z.string().url().optional(),
});

const updateProjectSchema = createProjectSchema.partial().extend({
    demo_video_url: z.string().url().optional().or(z.literal('')),
});

// GET /api/projects
router.get('/', async (req: Request, res: Response) => {
    try {
        const { type, difficulty, tags, sort, search, page = '1', limit = '20' } = req.query as Record<string, string>;
        const result = await projectsService.listProjects({
            type, difficulty,
            tags: tags ? tags.split(',') : undefined,
            sort: sort as 'latest' | 'trending' | 'starred' | 'viewed',
            search,
            page: parseInt(page),
            limit: Math.min(parseInt(limit), 50),
        });
        res.json({ data: result });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// GET /api/projects/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const project = await projectsService.getProjectById(req.params['id'] as string);
        if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
        res.json({ data: project });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// POST /api/projects
router.post('/', requireAuth, validate(createProjectSchema), async (req: Request, res: Response) => {
    try {
        const project = await projectsService.createProject(req.user!.id, req.body);
        res.status(201).json({ data: project, message: 'Project created' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// PATCH /api/projects/:id
router.patch('/:id', requireAuth, validate(updateProjectSchema), async (req: Request, res: Response) => {
    try {
        const id = req.params['id'] as string;
        const project = await projectsService.getProjectById(id);
        if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
        if (project.author_id !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }
        const updated = await projectsService.updateProject(id, req.body);
        res.json({ data: updated, message: 'Project updated' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// DELETE /api/projects/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const id = req.params['id'] as string;
        const project = await projectsService.getProjectById(id);
        if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
        if (project.author_id !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }
        await projectsService.deleteProject(id);
        res.json({ message: 'Project deleted' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// POST /api/projects/:id/publish
router.post('/:id/publish', requireAuth, async (req: Request, res: Response) => {
    try {
        const id = req.params['id'] as string;
        const project = await projectsService.getProjectById(id);
        if (!project) { res.status(404).json({ error: 'Project not found' }); return; }
        if (project.author_id !== req.user!.id) { res.status(403).json({ error: 'Forbidden' }); return; }
        const published = await projectsService.publishProject(id);
        res.json({ data: published, message: 'Project published' });
    } catch (error: unknown) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// GET /api/projects/:id/views
router.get('/:id/views', async (req: Request, res: Response) => {
    try {
        await projectsService.incrementViewCount(req.params['id'] as string);
        res.json({ message: 'View counted' });
    } catch {
        res.status(200).json({ message: 'View count skipped' });
    }
});

export default router;
