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
const auth_1 = require("../middleware/auth");
const followsService = __importStar(require("../services/follows.service"));
const router = (0, express_1.Router)();
// POST /api/users/:username/follow
router.post('/:username/follow', auth_1.requireAuth, async (req, res) => {
    try {
        const result = await followsService.toggleFollow(req.user.id, req.params['username']);
        if (result === null) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ data: result, message: result.following ? 'Now following' : 'Unfollowed' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// GET /api/users/:username/followers
router.get('/:username/followers', async (req, res) => {
    try {
        const followers = await followsService.getFollowers(req.params['username']);
        if (followers === null) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ data: followers });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/users/:username/following
router.get('/:username/following', async (req, res) => {
    try {
        const following = await followsService.getFollowing(req.params['username']);
        if (following === null) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json({ data: following });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=follows.js.map