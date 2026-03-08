"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
exports.getNotifications = getNotifications;
exports.markAllRead = markAllRead;
exports.markOneRead = markOneRead;
const prisma_1 = __importDefault(require("../db/prisma"));
async function createNotification(data) {
    return prisma_1.default.notification.create({ data });
}
async function getNotifications(userId) {
    return prisma_1.default.notification.findMany({
        where: { recipient_id: userId },
        orderBy: { created_at: 'desc' },
        take: 50,
        include: {
            actor: { select: { username: true, full_name: true, avatar_url: true } },
            project: { select: { id: true, title: true } },
        },
    });
}
async function markAllRead(userId) {
    return prisma_1.default.notification.updateMany({
        where: { recipient_id: userId, is_read: false },
        data: { is_read: true },
    });
}
async function markOneRead(notificationId, userId) {
    return prisma_1.default.notification.updateMany({
        where: { id: notificationId, recipient_id: userId },
        data: { is_read: true },
    });
}
