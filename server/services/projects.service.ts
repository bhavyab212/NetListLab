import prisma from '../db/prisma';

interface ProjectFilters {
    type?: string;
    difficulty?: string;
    tags?: string[];
    sort?: 'latest' | 'trending' | 'starred' | 'viewed';
    search?: string;
    page?: number;
    limit?: number;
}

export async function listProjects(filters: ProjectFilters) {
    const {
        type,
        difficulty,
        tags,
        sort = 'latest',
        search,
        page = 1,
        limit = 20,
    } = filters;

    const skip = (page - 1) * limit;

    const where = {
        status: 'PUBLISHED',
        ...(type && { project_type: type }),
        ...(difficulty && { difficulty }),
        ...(tags && tags.length > 0 && { tags: { hasSome: tags } }),
        ...(search && {
            OR: [
                { title: { contains: search, mode: 'insensitive' as const } },
                { tagline: { contains: search, mode: 'insensitive' as const } },
                { tags: { hasSome: [search] } },
            ],
        }),
    };

    const orderBy =
        sort === 'starred'
            ? { star_count: 'desc' as const }
            : sort === 'viewed'
                ? { view_count: 'desc' as const }
                : sort === 'trending'
                    ? { star_count: 'desc' as const }
                    : { created_at: 'desc' as const };

    const [projects, total] = await Promise.all([
        prisma.project.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: {
                author: { select: { username: true, full_name: true, avatar_url: true } },
                _count: { select: { stars: true, comments: true } },
            },
        }),
        prisma.project.count({ where }),
    ]);

    return { projects, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getProjectById(id: string) {
    return prisma.project.findUnique({
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

export async function createProject(
    authorId: string,
    data: {
        title: string;
        tagline?: string;
        project_type: string;
        difficulty: string;
        tags?: string[];
        github_url?: string;
        cover_image_url?: string;
    }
) {
    return prisma.project.create({
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

export async function updateProject(
    id: string,
    data: {
        title?: string;
        tagline?: string;
        project_type?: string;
        difficulty?: string;
        tags?: string[];
        github_url?: string;
        cover_image_url?: string;
        demo_video_url?: string;
    }
) {
    return prisma.project.update({
        where: { id },
        data: { ...data, updated_at: new Date() },
    });
}

export async function deleteProject(id: string) {
    return prisma.project.delete({ where: { id } });
}

export async function publishProject(id: string) {
    return prisma.project.update({
        where: { id },
        data: {
            status: 'PUBLISHED',
            published_at: new Date(),
            updated_at: new Date(),
        },
    });
}

export async function incrementViewCount(id: string) {
    return prisma.project.update({
        where: { id },
        data: { view_count: { increment: 1 } },
    });
}
