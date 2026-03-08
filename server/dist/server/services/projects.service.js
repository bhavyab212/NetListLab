"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProjects = listProjects;
exports.getProjectById = getProjectById;
exports.createProject = createProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
exports.publishProject = publishProject;
exports.incrementViewCount = incrementViewCount;
const prisma_1 = __importDefault(require("../db/prisma"));
async function listProjects(filters) {
    const { type, difficulty, tags, sort = 'latest', search, page = 1, limit = 20, } = filters;
    const skip = (page - 1) * limit;
    const where = {
        status: 'PUBLISHED',
        ...(type && { project_type: type }),
        ...(difficulty && { difficulty }),
        ...(tags && tags.length > 0 && { tags: { hasSome: tags } }),
        ...(search && {
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { tagline: { contains: search, mode: 'insensitive' } },
                { tags: { hasSome: [search] } },
            ],
        }),
    };
    const orderBy = sort === 'starred'
        ? { star_count: 'desc' }
        : sort === 'viewed'
            ? { view_count: 'desc' }
            : sort === 'trending'
                ? { star_count: 'desc' }
                : { created_at: 'desc' };
    const [projects, total] = await Promise.all([
        prisma_1.default.project.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: {
                author: { select: { username: true, full_name: true, avatar_url: true } },
                _count: { select: { stars: true, comments: true } },
            },
        }),
        prisma_1.default.project.count({ where }),
    ]);
    return { projects, total, page, limit, totalPages: Math.ceil(total / limit) };
}
async function getProjectById(id) {
    return prisma_1.default.project.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    full_name: true,
                    avatar_url: true,
                    bio: true,
                    field_of_work: true,
                },
            },
            sections: {
                orderBy: { order_index: 'asc' },
                include: {
                    media: { orderBy: { order_index: 'asc' } },
                },
            },
            media: { orderBy: { order_index: 'asc' } },
            bom_items: true,
            _count: { select: { stars: true, comments: true, sections: true } },
        },
    });
}
async function createProject(authorId, data) {
    return prisma_1.default.project.create({
        data: {
            author_id: authorId,
            title: data.title,
            tagline: data.tagline,
            project_type: data.project_type,
            difficulty: data.difficulty,
            tags: data.tags ?? [],
            github_url: data.github_url,
            cover_image_url: data.cover_image_url,
            status: 'DRAFT',
        },
        include: {
            author: { select: { username: true, full_name: true, avatar_url: true } },
        },
    });
}
async function updateProject(id, data) {
    return prisma_1.default.project.update({
        where: { id },
        data: { ...data, updated_at: new Date() },
    });
}
async function deleteProject(id) {
    return prisma_1.default.project.delete({ where: { id } });
}
async function publishProject(id) {
    return prisma_1.default.project.update({
        where: { id },
        data: {
            status: 'PUBLISHED',
            published_at: new Date(),
            updated_at: new Date(),
        },
    });
}
async function incrementViewCount(id) {
    return prisma_1.default.project.update({
        where: { id },
        data: { view_count: { increment: 1 } },
    });
}
//# sourceMappingURL=projects.service.js.map