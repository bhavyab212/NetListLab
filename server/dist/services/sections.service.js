"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSection = addSection;
exports.updateSection = updateSection;
exports.deleteSection = deleteSection;
exports.reorderSections = reorderSections;
exports.getSectionById = getSectionById;
const prisma_1 = __importDefault(require("../db/prisma"));
async function addSection(projectId, data) {
    return prisma_1.default.projectSection.create({
        data: {
            project_id: projectId,
            section_type: data.section_type,
            title: data.title,
            content_markdown: data.content_markdown,
            order_index: data.order_index,
        },
    });
}
async function updateSection(sectionId, data) {
    return prisma_1.default.projectSection.update({
        where: { id: sectionId },
        data,
    });
}
async function deleteSection(sectionId) {
    return prisma_1.default.projectSection.delete({ where: { id: sectionId } });
}
async function reorderSections(projectId, orderedIds) {
    const updates = orderedIds.map(({ id, order_index }) => prisma_1.default.projectSection.update({
        where: { id, project_id: projectId },
        data: { order_index },
    }));
    return Promise.all(updates);
}
async function getSectionById(sectionId) {
    return prisma_1.default.projectSection.findUnique({
        where: { id: sectionId },
        include: { project: { select: { author_id: true } } },
    });
}
