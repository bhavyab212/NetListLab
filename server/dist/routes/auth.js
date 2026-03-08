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
const authService = __importStar(require("../services/auth.service"));
const router = (0, express_1.Router)();
const registerSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
    username: zod_1.z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, 'Lowercase letters, numbers, underscores only'),
    full_name: zod_1.z.string().min(1).max(100),
    avatar_url: zod_1.z.string().url().optional(),
});
const syncSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    email: zod_1.z.string().email(),
});
// POST /api/auth/register
router.post('/register', (0, validate_1.validate)(registerSchema), async (req, res) => {
    try {
        const user = await authService.createUser(req.body);
        res.status(201).json({ data: user, message: 'User registered successfully' });
    }
    catch (error) {
        const e = error;
        if (e.code === 'P2002') {
            res.status(409).json({ error: 'Username or email already exists' });
        }
        else {
            res.status(500).json({ error: e.message || 'Registration failed' });
        }
    }
});
// POST /api/auth/sync
router.post('/sync', auth_1.requireAuth, (0, validate_1.validate)(syncSchema), async (req, res) => {
    try {
        const user = await authService.syncUser(req.body.id, req.body.email);
        res.json({ data: user });
    }
    catch (error) {
        const e = error;
        res.status(500).json({ error: e.message || 'Sync failed' });
    }
});
exports.default = router;
