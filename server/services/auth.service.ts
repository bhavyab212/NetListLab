import prisma from '../db/prisma';

export async function createUser(data: {
    id: string;
    email: string;
    username: string;
    full_name: string;
    avatar_url?: string;
}) {
    return prisma.user.create({
        data: {
            id: data.id,           // Use Supabase UUID as our PK
            email: data.email,
            username: data.username,
            full_name: data.full_name,
            avatar_url: data.avatar_url,
        },
    });
}

export async function syncUser(supabaseId: string, email: string) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { id: supabaseId } });
    if (existing) return existing;

    // Create with placeholder username (user will update in onboarding)
    const base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
    let username = base;
    let attempt = 0;

    while (await prisma.user.findUnique({ where: { username } })) {
        attempt++;
        username = `${base}_${attempt}`;
    }

    return prisma.user.create({
        data: {
            id: supabaseId,
            email,
            username,
            full_name: username,
        },
    });
}
