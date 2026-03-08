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
const notificationsService = __importStar(require("../services/notifications.service"));
const router = (0, express_1.Router)();
// GET /api/notifications
router.get('/', auth_1.requireAuth, async (req, res) => {
    try {
        const notifications = await notificationsService.getNotifications(req.user.id);
        res.json({ data: notifications });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// PATCH /api/notifications/read
router.patch('/read', auth_1.requireAuth, async (req, res) => {
    try {
        await notificationsService.markAllRead(req.user.id);
        res.json({ message: 'All notifications marked as read' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// PATCH /api/notifications/:id/read
router.patch('/:id/read', auth_1.requireAuth, async (req, res) => {
    try {
        await notificationsService.markOneRead(req.params['id'], req.user.id);
        res.json({ message: 'Notification marked as read' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
