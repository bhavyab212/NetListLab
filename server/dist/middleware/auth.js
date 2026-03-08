"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const supabase_1 = require("../db/supabase");
async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const { data, error } = await supabase_1.supabaseAdmin.auth.getUser(token);
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
    }
    catch {
        res.status(401).json({ error: 'Unauthorized: Token validation failed' });
    }
}
