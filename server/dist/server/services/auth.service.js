"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.syncUser = syncUser;
const prisma_1 = __importDefault(require("../db/prisma"));
async function createUser(data) {
    return prisma_1.default.user.create({
        data: {
            id: data.id, // Use Supabase UUID as our PK
            email: data.email,
            username: data.username,
            full_name: data.full_name,
            avatar_url: data.avatar_url,
        },
    });
}
async function syncUser(supabaseId, email) {
    // Check if user already exists
    const existing = await prisma_1.default.user.findUnique({ where: { id: supabaseId } });
    if (existing)
        return existing;
    // Create with placeholder username (user will update in onboarding)
    const base = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
    let username = base;
    let attempt = 0;
    while (await prisma_1.default.user.findUnique({ where: { username } })) {
        attempt++;
        username = `${base}_${attempt}`;
    }
    return prisma_1.default.user.create({
        data: {
            id: supabaseId,
            email,
            username,
            full_name: username,
        },
    });
}
//# sourceMappingURL=auth.service.js.map