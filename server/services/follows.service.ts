import prisma from '../db/prisma';
import { createNotification } from './notifications.service';

export async function toggleFollow(followerId: string, followingUsername: string) {
    const targetUser = await prisma.user.findUnique({
        where: { username: followingUsername },
        select: { id: true },
    });
    if (!targetUser) return null;

    const followingId = targetUser.id;

    // Can't follow yourself
    if (followerId === followingId) {
        throw new Error('Cannot follow yourself');
    }

    const existing = await prisma.follow.findUnique({
        where: {
            follower_id_following_id: { follower_id: followerId, following_id: followingId },
        },
    });

    if (existing) {
        await prisma.follow.delete({ where: { id: existing.id } });
        return { following: false };
    } else {
        await prisma.follow.create({
            data: { follower_id: followerId, following_id: followingId },
        });

        await createNotification({
            recipient_id: followingId,
            actor_id: followerId,
            type: 'FOLLOW',
        });

        return { following: true };
    }
}

export async function getFollowers(username: string) {
    const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (!user) return null;

    const follows = await prisma.follow.findMany({
        where: { following_id: user.id },
        include: {
            follower: {
                select: { id: true, username: true, full_name: true, avatar_url: true, current_role: true },
            },
        },
        orderBy: { created_at: 'desc' },
    });
    return follows.map((f: { follower: { id: string; username: string; full_name: string; avatar_url: string | null; current_role: string | null } }) => f.follower);
}

export async function getFollowing(username: string) {
    const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (!user) return null;

    const follows = await prisma.follow.findMany({
        where: { follower_id: user.id },
        include: {
            following: {
                select: { id: true, username: true, full_name: true, avatar_url: true, current_role: true },
            },
        },
        orderBy: { created_at: 'desc' },
    });
    return follows.map((f: { following: { id: string; username: string; full_name: string; avatar_url: string | null; current_role: string | null } }) => f.following);
}
