import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../db/supabase';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email?: string;
            };
        }
    }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !data.user) {
            res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
            return;
        }

        // Attach Supabase user info to request
        req.user = {
            id: data.user.id,
            email: data.user.email,
        };

        next();
    } catch {
        res.status(401).json({ error: 'Unauthorized: Token validation failed' });
    }
}
