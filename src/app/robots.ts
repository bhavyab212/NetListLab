import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/login', '/register', '/api/'],
        },
        sitemap: 'https://netlistlab.vercel.app/sitemap.xml',
    }
}
