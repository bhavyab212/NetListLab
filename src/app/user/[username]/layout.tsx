import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
    const { username } = await params;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        const user = json.data;

        return {
            title: `${user.full_name || user.username} | NetListLab`,
            description: user.bio || `View ${user.username}'s engineering portfolio on NetListLab.`,
            openGraph: {
                title: user.full_name || user.username,
                description: user.bio || '',
                images: user.avatar_url ? [user.avatar_url] : [],
            },
            twitter: {
                card: "summary",
                title: user.full_name || user.username,
                description: user.bio || '',
                images: user.avatar_url ? [user.avatar_url] : [],
            }
        }
    } catch {
        return { title: 'User Not Found | NetListLab' }
    }
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
