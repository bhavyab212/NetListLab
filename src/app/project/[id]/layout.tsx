import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        const p = json.data;

        return {
            title: `${p.title} | NetListLab`,
            description: p.tagline || p.description || `View ${p.title} on NetListLab`,
            openGraph: {
                title: p.title,
                description: p.tagline || p.description || '',
                images: p.cover_image_url ? [p.cover_image_url] : [],
            },
            twitter: {
                card: "summary_large_image",
                title: p.title,
                description: p.tagline || p.description || '',
                images: p.cover_image_url ? [p.cover_image_url] : [],
            }
        }
    } catch {
        return { title: 'Project Not Found | NetListLab' }
    }
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
