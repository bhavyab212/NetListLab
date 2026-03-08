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
    getForkNetwork: (projectId: number) => Project[];
    getUpstreamChanges: (forkId: number) => number;

    // CRUD
    addProject: (project: Project) => void;
    updateProject: (id: number, updates: Partial<Project>) => void;
    deleteProject: (id: number) => void;
    syncWithUpstream: (forkId: number) => void;
}

export const useProjectsStore = create<ProjectsState>()(
    persist(
        (set: any, get: any): ProjectsState => ({
            projects: [...initialProjects], // Seed with mock data
            starredIds: new Set<number>(),
            bookmarkedIds: new Set<number>(),
            forkedProjectIds: new Set<number>(),

            toggleStar: (id: number) => set((state: ProjectsState) => {
                const newStarred = new Set(state.starredIds);
                let isStarred = false;

                if (newStarred.has(id)) {
                    newStarred.delete(id);
                } else {
                    newStarred.add(id);
                    isStarred = true;
                }

                // Update the project's star count optimisticly
                const newProjects = state.projects.map((p: Project) => {
                    if (p.id === id) {
                        return { ...p, stars: isStarred ? p.stars + 1 : Math.max(0, p.stars - 1) };
                    }
                    return p;
                });

                return { starredIds: newStarred, projects: newProjects };
            }),

            toggleBookmark: (id: number) => set((state: ProjectsState) => {
                const newBookmarks = new Set(state.bookmarkedIds);
                if (newBookmarks.has(id)) {
                    newBookmarks.delete(id);
                } else {
                    newBookmarks.add(id);
                }
                return { bookmarkedIds: newBookmarks };
            }),

            forkProject: (id: number, authorId: string, authorName: string, authorAvatar: string) => {
                let newId: number | null = null;
                set((state: ProjectsState) => {
                    const original = state.projects.find((p: Project) => p.id === id);
                    if (!original) return state;

                    newId = Date.now();
                    const newProject: Project = JSON.parse(JSON.stringify(original)); // deep copy
                    Object.assign(newProject, {
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
                        forkedFrom: {
                            projectId: original.id,
                            projectTitle: original.title,
                            authorId: original.authorId,
                            author: original.author
                        },
                        forkedAt: new Date().toISOString(),
                        lastSyncedAt: new Date().toISOString(),
                        changesSinceSync: 0
                    });

                    const newProjects = state.projects.map((p: Project) => {
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
                    projectTitle: get().projects.find((p: Project) => p.id === id)?.title,
                    projectId: id,
                    read: false,
                    createdAt: new Date().toISOString()
                });

                return newId;
            },

            getMyProjects: (authorId: string) => {
                const { projects } = get();
                return projects.filter((p: Project) => p.authorId === authorId);
            },

            getStarredProjects: () => {
                const { projects, starredIds } = get();
                return projects.filter((p: Project) => starredIds.has(p.id));
            },

            getBookmarkedProjects: () => {
                const { projects, bookmarkedIds } = get();
                return projects.filter((p: Project) => bookmarkedIds.has(p.id));
            },

            getForkedProjects: () => {
                const { projects, forkedProjectIds } = get();
                return projects.filter((p: Project) => forkedProjectIds.has(p.id));
            },

            getForkNetwork: (projectId: number) => {
                const { projects } = get();
                return projects.filter((p: Project) => p.forkedFrom?.projectId === projectId);
            },

            getUpstreamChanges: (forkId: number) => {
                const { projects } = get();
                const fork = projects.find((p: Project) => p.id === forkId);
                if (!fork || !fork.forkedFrom) return 0;

                const upstream = projects.find((p: Project) => p.id === fork.forkedFrom!.projectId);
                if (!upstream) return 0;

                // Simple heuristic: if upstream's updated/created is newer than lastSyncedAt, it's 1 change
                // In a real app we'd compare exact arrays, but here we can just mock it or track an upstream counter.
                // For demonstration, let's say there are pseudo-changes if upstream exists.
                return fork.changesSinceSync || 0;
            },

            addProject: (project: Project) => set((state: ProjectsState) => ({
                projects: [project, ...state.projects]
            })),

            updateProject: (id: number, updates: Partial<Project>) => set((state: ProjectsState) => ({
                projects: state.projects.map((p: Project) => {
                    if (p.id === id) {
                        return { ...p, ...updates, changesSinceSync: (p.changesSinceSync || 0) + 1 };
                    }
                    return p;
                })
            })),

            syncWithUpstream: (forkId: number) => set((state: ProjectsState) => {
                const fork = state.projects.find((p: Project) => p.id === forkId);
                if (!fork || !fork.forkedFrom) return state;

                const upstream = state.projects.find((p: Project) => p.id === fork.forkedFrom!.projectId);
                if (!upstream) return state;

                // Copy all nested data from upstream, preserving fork metadata
                const syncedProject = JSON.parse(JSON.stringify(upstream));
                Object.assign(syncedProject, {
                    id: fork.id,
                    title: fork.title,
                    slug: fork.slug,
                    authorId: fork.authorId,
                    author: fork.author,
                    authorAvatar: fork.authorAvatar,
                    stars: fork.stars,
                    views: fork.views,
                    comments: fork.comments,
                    forks: fork.forks,
                    createdAt: fork.createdAt,
                    status: fork.status,
                    forkedFrom: fork.forkedFrom,
                    forkedAt: fork.forkedAt,
                    lastSyncedAt: new Date().toISOString(),
                    changesSinceSync: 0
                });

                return {
                    projects: state.projects.map((p: Project) => p.id === forkId ? syncedProject : p)
                };
            }),

            deleteProject: (id: number) => set((state: ProjectsState) => {
                const newStarred = new Set(state.starredIds);
                newStarred.delete(id);
                const newBookmarks = new Set(state.bookmarkedIds);
                newBookmarks.delete(id);
                const newForked = new Set(state.forkedProjectIds);
                newForked.delete(id);

                return {
                    projects: state.projects.filter((p: Project) => p.id !== id),
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
                getItem: (name: string) => {
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
                setItem: (name: string, value: any) => {
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
                removeItem: (name: string) => localStorage.removeItem(name),
            },
        }
    )
);
