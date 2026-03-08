"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBOMItems = getBOMItems;
exports.addBOMItem = addBOMItem;
exports.updateBOMItem = updateBOMItem;
exports.deleteBOMItem = deleteBOMItem;
exports.getBOMItemById = getBOMItemById;
exports.generateCSV = generateCSV;
const prisma_1 = __importDefault(require("../db/prisma"));
async function getBOMItems(projectId) {
    return prisma_1.default.bOMItem.findMany({
        where: { project_id: projectId },
        orderBy: { component_name: 'asc' },
    });
}
async function addBOMItem(projectId, data) {
    return prisma_1.default.bOMItem.create({
        data: {
            project_id: projectId,
            component_name: data.component_name,
            quantity: data.quantity,
            description: data.description,
            part_number: data.part_number,
            buy_link: data.buy_link,
            estimated_price: data.estimated_price,
            currency: data.currency ?? 'INR',
        },
    });
}
async function updateBOMItem(itemId, data) {
    return prisma_1.default.bOMItem.update({ where: { id: itemId }, data });
}
async function deleteBOMItem(itemId) {
    return prisma_1.default.bOMItem.delete({ where: { id: itemId } });
}
async function getBOMItemById(itemId) {
    return prisma_1.default.bOMItem.findUnique({
        where: { id: itemId },
        include: { project: { select: { author_id: true } } },
    });
}
/** Generate CSV string from BOM items */
function generateCSV(items) {
    const header = 'Component Name,Quantity,Description,Part Number,Estimated Price,Currency,Buy Link';
    const rows = items.map((item) => [
        `"${item.component_name}"`,
        item.quantity,
        `"${item.description ?? ''}"`,
        `"${item.part_number ?? ''}"`,
        item.estimated_price ?? '',
        item.currency,
        `"${item.buy_link ?? ''}"`,
    ].join(','));
    return [header, ...rows].join('\n');
}
