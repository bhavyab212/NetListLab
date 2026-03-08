import { supabaseAdmin } from '../db/supabase';
import path from 'path';

const ALLOWED_TYPES = new Set([
    'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp',
    'video/mp4',
    'application/pdf',
    'application/zip',
    'application/octet-stream', // .sch, .kicad, .step, .stl
]);

const ALLOWED_EXTENSIONS = new Set([
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp',
    '.mp4',
    '.pdf',
    '.zip',
    '.sch', '.kicad', '.step', '.stl',
]);

export function isAllowedFile(originalname: string, mimetype: string): boolean {
    const ext = path.extname(originalname).toLowerCase();
    return ALLOWED_EXTENSIONS.has(ext) || ALLOWED_TYPES.has(mimetype);
}

export async function uploadToStorage(
    buffer: Buffer,
    originalname: string,
    mimetype: string,
    bucket: 'project-media' | 'avatars' | 'files'
): Promise<string> {
    const ext = path.extname(originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = `uploads/${filename}`;

    const { error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, buffer, {
            contentType: mimetype,
            upsert: false,
        });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
}
