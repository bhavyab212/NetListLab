import prisma from '../db/prisma';

export async function getUserByUsername(username: string) {
    return prisma.user.findUnique({
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

export async function getUserById(id: string) {
    return prisma.user.findUnique({
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

export async function updateUser(
    id: string,
    data: {
        username?: string;
        full_name?: string;
        avatar_url?: string;
        bio?: string;
        location?: string;
        website_url?: string;
        github_url?: string;
        linkedin_url?: string;
        twitter_url?: string;
        field_of_work?: string[];
        skill_tags?: string[];
        current_role?: string;
        institution?: string;
    }
) {
    return prisma.user.update({
        where: { id },
        data: { ...data, updated_at: new Date() },
    });
}

export async function getUserProjects(username: string, viewerId?: string) {
    const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (!user) return null;

    const isOwner = viewerId === user.id;

    return prisma.project.findMany({
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

export async function getUserStarred(username: string) {
    const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    if (!user) return null;

    const stars = await prisma.star.findMany({
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

    return stars.map((s: { project: unknown }) => s.project);
}
