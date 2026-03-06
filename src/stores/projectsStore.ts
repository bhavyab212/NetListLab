import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { projects as initialProjects, type Project } from '../mockData/projects';
import { useNotificationStore } from './notificationStore';

interface ProjectsState {
    projects: Project[];
    starredIds: Set<number>;
    bookmarkedIds: Set<number>;
    forkedProjectIds: Set<number>;

    // Actions
    toggleStar: (id: number) => void;
    toggleBookmark: (id: number) => void;
    forkProject: (id: number, authorId: string, authorName: string, authorAvatar: string) => number | null;

    // Selectors (for use inside components or as store logic)
    getMyProjects: (authorId: string) => Project[];
    getStarredProjects: () => Project[];
    getBookmarkedProjects: () => Project[];
    getForkedProjects: () => Project[];

    // CRUD
    addProject: (project: Project) => void;
    updateProject: (id: number, updates: Partial<Project>) => void;
    deleteProject: (id: number) => void;
}

export const useProjectsStore = create<ProjectsState>()(
    persist(
        (set, get) => ({
            projects: [...initialProjects], // Seed with mock data
            starredIds: new Set(),
            bookmarkedIds: new Set(),
            forkedProjectIds: new Set(),

            toggleStar: (id) => set((state) => {
                const newStarred = new Set(state.starredIds);
                let isStarred = false;

                if (newStarred.has(id)) {
                    newStarred.delete(id);
                } else {
                    newStarred.add(id);
                    isStarred = true;
                }

                // Update the project's star count optimisticly
                const newProjects = state.projects.map(p => {
                    if (p.id === id) {
                        return { ...p, stars: isStarred ? p.stars + 1 : Math.max(0, p.stars - 1) };
                    }
                    return p;
                });

                return { starredIds: newStarred, projects: newProjects };
            }),

            toggleBookmark: (id) => set((state) => {
                const newBookmarks = new Set(state.bookmarkedIds);
                if (newBookmarks.has(id)) {
                    newBookmarks.delete(id);
                } else {
                    newBookmarks.add(id);
                }
                return { bookmarkedIds: newBookmarks };
            }),

            forkProject: (id, authorId, authorName, authorAvatar) => {
                let newId = null;
                set((state) => {
                    const original = state.projects.find(p => p.id === id);
                    if (!original) return state;

                    newId = Date.now();
                    const newProject: Project = {
                        ...original,
                        id: newId,
                        title: `${original.title} (Fork)`,
                        slug: `${original.slug}-fork-${newId}`,
                        authorId: authorId,
                        author: authorName,
                        authorAvatar: authorAvatar,
                        stars: 0,
                        views: 0,
                        comments: 0,
                        forks: 0,
                        createdAt: new Date().toISOString(),
                    };

                    const newProjects = state.projects.map(p => {
                        if (p.id === id) {
                            return { ...p, forks: p.forks + 1 };
                        }
                        return p;
                    });

                    const newForkedProjectIds = new Set(state.forkedProjectIds);
                    newForkedProjectIds.add(newId);

                    return { projects: [newProject, ...newProjects], forkedProjectIds: newForkedProjectIds };
                });

                // Dispatch notification
                useNotificationStore.getState().addNotification({
                    id: `notif-fork-${newId}`,
                    type: "fork",
                    actorId: authorId,
                    actor: authorName.replace('@', ''),
                    actorAvatar: authorAvatar,
                    message: "forked your artifact",
                    projectTitle: get().projects.find(p => p.id === id)?.title,
                    projectId: id,
                    read: false,
                    createdAt: new Date().toISOString()
                });

                return newId;
            },

            getMyProjects: (authorId) => {
                const { projects } = get();
                return projects.filter(p => p.authorId === authorId);
            },

            getStarredProjects: () => {
                const { projects, starredIds } = get();
                return projects.filter(p => starredIds.has(p.id));
            },

            getBookmarkedProjects: () => {
                const { projects, bookmarkedIds } = get();
                return projects.filter(p => bookmarkedIds.has(p.id));
            },

            getForkedProjects: () => {
                const { projects, forkedProjectIds } = get();
                return projects.filter(p => forkedProjectIds.has(p.id));
            },

            addProject: (project) => set((state) => ({
                projects: [project, ...state.projects]
            })),

            updateProject: (id, updates) => set((state) => ({
                projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
            })),

            deleteProject: (id) => set((state) => {
                const newStarred = new Set(state.starredIds);
                newStarred.delete(id);
                const newBookmarks = new Set(state.bookmarkedIds);
                newBookmarks.delete(id);
                const newForked = new Set(state.forkedProjectIds);
                newForked.delete(id);

                return {
                    projects: state.projects.filter(p => p.id !== id),
                    starredIds: newStarred,
                    bookmarkedIds: newBookmarks,
                    forkedProjectIds: newForked
                };
            }),
        }),
        {
            name: 'netlistlab-projects',
            // Set serialization is needed because JSON.stringify doesn't handle Maps/Sets
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;
                    const parsed = JSON.parse(str);
                    return {
                        ...parsed,
                        state: {
                            ...parsed.state,
                            starredIds: new Set(parsed.state.starredIds),
                            bookmarkedIds: new Set(parsed.state.bookmarkedIds),
                            forkedProjectIds: new Set(parsed.state.forkedProjectIds || []),
                        },
                    };
                },
                setItem: (name, value) => {
                    const stringified = JSON.stringify({
                        ...value,
                        state: {
                            ...value.state,
                            starredIds: Array.from(value.state.starredIds),
                            bookmarkedIds: Array.from(value.state.bookmarkedIds),
                            forkedProjectIds: Array.from(value.state.forkedProjectIds || []),
                        },
                    });
                    localStorage.setItem(name, stringified);
                },
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
);
