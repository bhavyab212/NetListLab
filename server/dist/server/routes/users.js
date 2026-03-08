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
const usersService = __importStar(require("../services/users.service"));
const router = (0, express_1.Router)();
const updateProfileSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(30).regex(/^[a-z0-9_]+$/).optional(),
    full_name: zod_1.z.string().min(1).max(100).optional(),
    bio: zod_1.z.string().max(300).optional(),
    avatar_url: zod_1.z.string().url().optional(),
    location: zod_1.z.string().max(100).optional(),
    website_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    github_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    linkedin_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    twitter_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    field_of_work: zod_1.z.array(zod_1.z.string()).optional(),
    skill_tags: zod_1.z.array(zod_1.z.string()).optional(),
    current_role: zod_1.z.string().optional(),
    institution: zod_1.z.string().optional(),
});
// GET /api/users/me
router.get('/me', auth_1.requireAuth, async (req, res) => {
    try {
        const user = await usersService.getUserById(req.user.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ data: user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// PATCH /api/users/me
router.patch('/me', auth_1.requireAuth, (0, validate_1.validate)(updateProfileSchema), async (req, res) => {
    try {
        const user = await usersService.updateUser(req.user.id, req.body);
        res.json({ data: user, message: 'Profile updated' });
    }
    catch (error) {
        const e = error;
        if (e.code === 'P2002') {
            res.status(409).json({ error: 'Username already taken' });
        }
        else {
            res.status(500).json({ error: e.message });
        }
    }
});
// GET /api/users/:username
router.get('/:username', async (req, res) => {
    try {
        const user = await usersService.getUserByUsername(req.params['username']);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ data: user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/users/:username/projects
router.get('/:username/projects', async (req, res) => {
    try {
        const projects = await usersService.getUserProjects(req.params['username'], req.user?.id);
        if (projects === null) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ data: projects });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/users/:username/starred
router.get('/:username/starred', async (req, res) => {
    try {
        const projects = await usersService.getUserStarred(req.params['username']);
        if (projects === null) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ data: projects });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map