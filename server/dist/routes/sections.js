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
const sectionsService = __importStar(require("../services/sections.service"));
const projectsService = __importStar(require("../services/projects.service"));
const router = (0, express_1.Router)();
const addSectionSchema = zod_1.z.object({
    section_type: zod_1.z.enum(['OVERVIEW', 'BOM', 'SCHEMATIC', 'BUILD_STEPS', 'CODE', 'RESULT', 'CHALLENGES', 'DOWNLOADS', 'CUSTOM']),
    title: zod_1.z.string().min(1).max(100),
    content_markdown: zod_1.z.string().optional(),
    order_index: zod_1.z.number().int().min(0),
});
const updateSectionSchema = addSectionSchema.partial();
const reorderSchema = zod_1.z.object({
    sections: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string().uuid(),
        order_index: zod_1.z.number().int().min(0),
    })),
});
// POST /api/projects/:id/sections
router.post('/projects/:id/sections', auth_1.requireAuth, (0, validate_1.validate)(addSectionSchema), async (req, res) => {
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
        const section = await sectionsService.addSection(id, req.body);
        res.status(201).json({ data: section, message: 'Section added' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// PATCH /api/sections/:sectionId
router.patch('/sections/:sectionId', auth_1.requireAuth, (0, validate_1.validate)(updateSectionSchema), async (req, res) => {
    try {
        const sectionId = req.params['sectionId'];
        const section = await sectionsService.getSectionById(sectionId);
        if (!section) {
            res.status(404).json({ error: 'Section not found' });
            return;
        }
        if (section.project.author_id !== req.user.id) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const updated = await sectionsService.updateSection(sectionId, req.body);
        res.json({ data: updated, message: 'Section updated' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// DELETE /api/sections/:sectionId
router.delete('/sections/:sectionId', auth_1.requireAuth, async (req, res) => {
    try {
        const sectionId = req.params['sectionId'];
        const section = await sectionsService.getSectionById(sectionId);
        if (!section) {
            res.status(404).json({ error: 'Section not found' });
            return;
        }
        if (section.project.author_id !== req.user.id) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        await sectionsService.deleteSection(sectionId);
        res.json({ message: 'Section deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// PATCH /api/projects/:id/sections/reorder
router.patch('/projects/:id/sections/reorder', auth_1.requireAuth, (0, validate_1.validate)(reorderSchema), async (req, res) => {
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
        const updated = await sectionsService.reorderSections(id, req.body.sections);
        res.json({ data: updated, message: 'Sections reordered' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
