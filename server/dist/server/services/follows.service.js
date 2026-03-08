"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFollow = toggleFollow;
exports.getFollowers = getFollowers;
exports.getFollowing = getFollowing;
const prisma_1 = __importDefault(require("../db/prisma"));
const notifications_service_1 = require("./notifications.service");
async function toggleFollow(followerId, followingUsername) {
    const targetUser = await prisma_1.default.user.findUnique({
        where: { username: followingUsername },
        select: { id: true },
    });
    if (!targetUser)
        return null;
    const followingId = targetUser.id;
    // Can't follow yourself
    if (followerId === followingId) {
        throw new Error('Cannot follow yourself');
    }
    const existing = await prisma_1.default.follow.findUnique({
        where: {
            follower_id_following_id: { follower_id: followerId, following_id: followingId },
        },
    });
    if (existing) {
        await prisma_1.default.follow.delete({ where: { id: existing.id } });
        return { following: false };
    }
    else {
        await prisma_1.default.follow.create({
            data: { follower_id: followerId, following_id: followingId },
        });
        await (0, notifications_service_1.createNotification)({
            recipient_id: followingId,
            actor_id: followerId,
            type: 'FOLLOW',
        });
        return { following: true };
    }
}
async function getFollowers(username) {
    const user = await prisma_1.default.user.findUnique({ where: { username }, select: { id: true } });
    if (!user)
        return null;
    const follows = await prisma_1.default.follow.findMany({
        where: { following_id: user.id },
        include: {
            follower: {
                select: { id: true, username: true, full_name: true, avatar_url: true, current_role: true },
            },
        },
        orderBy: { created_at: 'desc' },
    });
    return follows.map((f) => f.follower);
}
async function getFollowing(username) {
    const user = await prisma_1.default.user.findUnique({ where: { username }, select: { id: true } });
    if (!user)
        return null;
    const follows = await prisma_1.default.follow.findMany({
        where: { follower_id: user.id },
        include: {
            following: {
                select: { id: true, username: true, full_name: true, avatar_url: true, current_role: true },
            },
        },
        orderBy: { created_at: 'desc' },
    });
    return follows.map((f) => f.following);
}
//# sourceMappingURL=follows.service.js.map