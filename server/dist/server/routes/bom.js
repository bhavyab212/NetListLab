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
const bomService = __importStar(require("../services/bom.service"));
const projectsService = __importStar(require("../services/projects.service"));
const router = (0, express_1.Router)();
const addBOMSchema = zod_1.z.object({
    component_name: zod_1.z.string().min(1).max(200),
    quantity: zod_1.z.number().int().min(1),
    description: zod_1.z.string().max(500).optional(),
    part_number: zod_1.z.string().max(100).optional(),
    buy_link: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    estimated_price: zod_1.z.number().positive().optional(),
    currency: zod_1.z.enum(['INR', 'USD', 'EUR', 'GBP']).optional(),
});
// GET /api/projects/:id/bom
router.get('/:id/bom', async (req, res) => {
    try {
        const items = await bomService.getBOMItems(req.params['id']);
        res.json({ data: items });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/projects/:id/bom/csv
router.get('/:id/bom/csv', async (req, res) => {
    try {
        const items = await bomService.getBOMItems(req.params['id']);
        const csv = bomService.generateCSV(items);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="bom-${req.params['id']}.csv"`);
        res.send(csv);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/projects/:id/bom
router.post('/:id/bom', auth_1.requireAuth, (0, validate_1.validate)(addBOMSchema), async (req, res) => {
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
        const item = await bomService.addBOMItem(id, req.body);
        res.status(201).json({ data: item, message: 'BOM item added' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// PATCH /api/bom/:itemId
router.patch('/bom/:itemId', auth_1.requireAuth, (0, validate_1.validate)(addBOMSchema.partial()), async (req, res) => {
    try {
        const itemId = req.params['itemId'];
        const item = await bomService.getBOMItemById(itemId);
        if (!item) {
            res.status(404).json({ error: 'BOM item not found' });
            return;
        }
        if (item.project.author_id !== req.user.id) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        const updated = await bomService.updateBOMItem(itemId, req.body);
        res.json({ data: updated, message: 'BOM item updated' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// DELETE /api/bom/:itemId
router.delete('/bom/:itemId', auth_1.requireAuth, async (req, res) => {
    try {
        const itemId = req.params['itemId'];
        const item = await bomService.getBOMItemById(itemId);
        if (!item) {
            res.status(404).json({ error: 'BOM item not found' });
            return;
        }
        if (item.project.author_id !== req.user.id) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }
        await bomService.deleteBOMItem(itemId);
        res.json({ message: 'BOM item deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=bom.js.map