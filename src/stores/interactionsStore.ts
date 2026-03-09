import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface InteractionsState {
    starredProjects: Record<string, boolean>;
    followedUsers: Record<string, boolean>; // key is username
    bookmarkedProjects: Record<string, boolean>; // locally maintained

    toggleStar: (projectId: string) => Promise<void>;
    toggleFollow: (username: string) => Promise<void>;
    toggleBookmark: (projectId: string) => Promise<void>;

    isStarred: (projectId: string) => boolean;
    isFollowing: (username: string) => boolean;
    isBookmarked: (projectId: string) => boolean;
}

export const useInteractionsStore = create<InteractionsState>()(
    persist(
        (set, get) => ({
            starredProjects: {},
            followedUsers: {},
            bookmarkedProjects: {},

            toggleBookmark: async (projectId: string) => {
                const currentState = get().bookmarkedProjects[projectId] || false;
                set(state => ({
                    bookmarkedProjects: { ...state.bookmarkedProjects, [projectId]: !currentState }
                }));
            },

            toggleStar: async (projectId: string) => {
                const currentState = get().starredProjects[projectId] || false;
                const newState = !currentState;

                // Optimistic UI Update
                set(state => ({
                    starredProjects: { ...state.starredProjects, [projectId]: newState }
                }));

                try {
                    const res = await api.toggleStar(projectId);
                    // Sync with actual backend result
                    set(state => ({
                        starredProjects: { ...state.starredProjects, [projectId]: res.starred }
                    }));
                } catch (e) {
                    // Rollback on failure
                    set(state => ({
                        starredProjects: { ...state.starredProjects, [projectId]: currentState }
                    }));
                    throw e;
                }
            },

            toggleFollow: async (username: string) => {
                const currentState = get().followedUsers[username] || false;
                const newState = !currentState;

                // Optimistic UI Update
                set(state => ({
                    followedUsers: { ...state.followedUsers, [username]: newState }
                }));

                try {
                    const res = await api.toggleFollow(username);
                    // Sync with actual backend result
                    set(state => ({
                        followedUsers: { ...state.followedUsers, [username]: res.following }
                    }));
                } catch (e) {
                    // Rollback on failure
                    set(state => ({
                        followedUsers: { ...state.followedUsers, [username]: currentState }
                    }));
                    throw e;
                }
            },

            isStarred: (projectId: string) => {
                return get().starredProjects[projectId] || false;
            },

            isFollowing: (username: string) => {
                return get().followedUsers[username] || false;
            },

            isBookmarked: (projectId: string) => {
                return get().bookmarkedProjects[projectId] || false;
            }
        }),
        {
            name: 'netlistlab-interactions',
        }
    )
);
