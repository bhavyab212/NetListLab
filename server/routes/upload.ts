import { Router, Request, Response } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';
import * as uploadService from '../services/upload.service';

const router = Router();

// Multer stores file in memory — we then upload to Supabase Storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (_req, file, cb) => {
        if (uploadService.isAllowedFile(file.originalname, file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type not allowed: ${file.originalname}`));
        }
    },
});

// POST /api/upload/image — upload image to Supabase Storage
router.post('/image', requireAuth, upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    try {
        const url = await uploadService.uploadToStorage(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            'project-media'
        );
        res.json({ data: { url }, message: 'Image uploaded' });
    } catch (error: unknown) {
        const e = error as { message?: string };
        res.status(500).json({ error: e.message });
    }
});

// POST /api/upload/avatar — upload avatar
router.post('/avatar', requireAuth, upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    try {
        const url = await uploadService.uploadToStorage(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            'avatars'
        );
        res.json({ data: { url }, message: 'Avatar uploaded' });
    } catch (error: unknown) {
        const e = error as { message?: string };
        res.status(500).json({ error: e.message });
    }
});

// POST /api/upload/file — upload any allowed file type
router.post('/file', requireAuth, upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    try {
        const url = await uploadService.uploadToStorage(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype,
            'files'
        );
        res.json({ data: { url }, message: 'File uploaded' });
    } catch (error: unknown) {
        const e = error as { message?: string };
        res.status(500).json({ error: e.message });
    }
});

export default router;
