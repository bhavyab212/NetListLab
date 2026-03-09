import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://netlistlab.vercel.app',
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://netlistlab.vercel.app/explore',
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: 'https://netlistlab.vercel.app/feed',
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.8,
        },
    ]
}
