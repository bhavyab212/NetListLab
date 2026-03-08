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
const commentsService = __importStar(require("../services/comments.service"));
const router = (0, express_1.Router)();
const addCommentSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(1000),
    section_id: zod_1.z.string().uuid().optional(),
    parent_comment_id: zod_1.z.string().uuid().optional(),
});
// GET /api/projects/:id/comments
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await commentsService.getProjectComments(req.params['id']);
        res.json({ data: comments });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/projects/:id/comments/steps
router.get('/:id/comments/steps', async (req, res) => {
    try {
        const comments = await commentsService.getStepComments(req.params['id']);
        res.json({ data: comments });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/projects/:id/comments
router.post('/:id/comments', auth_1.requireAuth, (0, validate_1.validate)(addCommentSchema), async (req, res) => {
    try {
        const comment = await commentsService.addComment(req.user.id, req.params['id'], req.body);
        res.status(201).json({ data: comment, message: 'Comment added' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// DELETE /api/comments/:commentId
router.delete('/comments/:commentId', auth_1.requireAuth, async (req, res) => {
    try {
        await commentsService.deleteComment(req.params['commentId'], req.user.id);
        res.json({ message: 'Comment deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/comments/:commentId/upvote
router.post('/comments/:commentId/upvote', auth_1.requireAuth, async (req, res) => {
    try {
        const comment = await commentsService.toggleUpvote(req.params['commentId']);
        res.json({ data: comment });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=comments.js.map