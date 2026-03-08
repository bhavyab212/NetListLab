"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const projectsService = __importStar(require("../services/projects.service"));
const router = (0, express_1.Router)();
const createProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    tagline: zod_1.z.string().max(200).optional(),
    project_type: zod_1.z.enum(['ELECTRONICS', 'SOFTWARE', 'MECHANICAL', 'ROBOTICS', 'IOT', 'AI_ML', 'DESIGN', 'RESEARCH', 'OTHER']),
    difficulty: zod_1.z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
    tags: zod_1.z.array(zod_1.z.string()).max(10).optional(),
    github_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    cover_image_url: zod_1.z.string().url().optional(),
});
const updateProjectSchema = createProjectSchema.partial().extend({
    demo_video_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
});
// GET /api/projects
router.get('/', async (req, res) => {
    try {
        const { type, difficulty, tags, sort, search, page = '1', limit = '20' } = req.query;
        const result = await projectsService.listProjects({
            type, difficulty,
            tags: tags ? tags.split(',') : undefined,
            sort: sort,
            search,
            page: parseInt(page),
            limit: Math.min(parseInt(limit), 50),
        });
        res.json({ data: result });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/projects/:id
router.get('/:id', async (req, res) => {
    try {
        const project = await projectsService.getProjectById(req.params['id']);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json({ data: project });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/projects
router.post('/', auth_1.requireAuth, (0, validate_1.validate)(createProjectSchema), async (req, res) => {
    try {
        const project = await projectsService.createProject(req.user.id, req.body);
        res.status(201).json({ data: project, message: 'Project created' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// PATCH /api/projects/:id
router.patch('/:id', auth_1.requireAuth, (0, validate_1.validate)(updateProjectSchema), async (req, res) => {
    try {
        const id = req.params['id'];
        const project = await projectsService.getProjectById(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        if (project.author_id !== req.user.id) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const updated = await projectsService.updateProject(id, req.body);
        res.json({ data: updated, message: 'Project updated' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// DELETE /api/projects/:id
router.delete('/:id', auth_1.requireAuth, async (req, res) => {
    try {
        const id = req.params['id'];
        const project = await projectsService.getProjectById(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        if (project.author_id !== req.user.id) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        await projectsService.deleteProject(id);
        res.json({ message: 'Project deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/projects/:id/publish
router.post('/:id/publish', auth_1.requireAuth, async (req, res) => {
    try {
        const id = req.params['id'];
        const project = await projectsService.getProjectById(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        if (project.author_id !== req.user.id) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const published = await projectsService.publishProject(id);
        res.json({ data: published, message: 'Project published' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/projects/:id/views
router.get('/:id/views', async (req, res) => {
    try {
        await projectsService.incrementViewCount(req.params['id']);
        res.json({ message: 'View counted' });
    }
    catch {
        res.status(200).json({ message: 'View count skipped' });
    }
});
exports.default = router;
