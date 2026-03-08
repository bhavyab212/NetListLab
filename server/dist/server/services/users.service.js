"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUsername = getUserByUsername;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.getUserProjects = getUserProjects;
exports.getUserStarred = getUserStarred;
const prisma_1 = __importDefault(require("../db/prisma"));
async function getUserByUsername(username) {
    return prisma_1.default.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            full_name: true,
            avatar_url: true,
            bio: true,
            location: true,
            website_url: true,
            github_url: true,
            linkedin_url: true,
            twitter_url: true,
            field_of_work: true,
            skill_tags: true,
            current_role: true,
            institution: true,
            created_at: true,
            _count: {
                select: {
                    projects: { where: { status: 'PUBLISHED' } },
                    followers: true,
                    following: true,
                },
            },
        },
    });
}
async function getUserById(id) {
    return prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            full_name: true,
            email: true,
            avatar_url: true,
            bio: true,
            location: true,
            website_url: true,
            github_url: true,
            linkedin_url: true,
            twitter_url: true,
            field_of_work: true,
            skill_tags: true,
            current_role: true,
            institution: true,
            created_at: true,
            updated_at: true,
            _count: {
                select: {
                    projects: { where: { status: 'PUBLISHED' } },
                    followers: true,
                    following: true,
                },
            },
        },
    });
}
async function updateUser(id, data) {
    return prisma_1.default.user.update({
        where: { id },
        data: { ...data, updated_at: new Date() },
    });
}
async function getUserProjects(username, viewerId) {
    const user = await prisma_1.default.user.findUnique({ where: { username }, select: { id: true } });
    if (!user)
        return null;
    const isOwner = viewerId === user.id;
    return prisma_1.default.project.findMany({
        where: {
            author_id: user.id,
            ...(isOwner ? {} : { status: 'PUBLISHED' }),
        },
        orderBy: { created_at: 'desc' },
        include: {
            author: { select: { username: true, full_name: true, avatar_url: true } },
            _count: { select: { stars: true, comments: true } },
        },
    });
}
async function getUserStarred(username) {
    const user = await prisma_1.default.user.findUnique({ where: { username }, select: { id: true } });
    if (!user)
        return null;
    const stars = await prisma_1.default.star.findMany({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' },
        include: {
            project: {
                include: {
                    author: { select: { username: true, full_name: true, avatar_url: true } },
                    _count: { select: { stars: true, comments: true } },
                },
            },
        },
    });
    return stars.map((s) => s.project);
}
//# sourceMappingURL=users.service.js.map