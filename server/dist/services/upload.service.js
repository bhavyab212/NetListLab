"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedFile = isAllowedFile;
exports.uploadToStorage = uploadToStorage;
const supabase_1 = require("../db/supabase");
const path_1 = __importDefault(require("path"));
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
function isAllowedFile(originalname, mimetype) {
    const ext = path_1.default.extname(originalname).toLowerCase();
    return ALLOWED_EXTENSIONS.has(ext) || ALLOWED_TYPES.has(mimetype);
}
async function uploadToStorage(buffer, originalname, mimetype, bucket) {
    const ext = path_1.default.extname(originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const filePath = `uploads/${filename}`;
    const { error } = await supabase_1.supabaseAdmin.storage
        .from(bucket)
        .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: false,
    });
    if (error)
        throw new Error(`Upload failed: ${error.message}`);
    const { data } = supabase_1.supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
}
