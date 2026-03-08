import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockUsers, User } from '../mockData/users';
import { mockComments, Comment, CommentReply } from '../mockData/comments';

interface SocialState {
    users: User[];
    comments: Comment[];
    following: Set<string>; // Set of user IDs the current user follows
    
    // User Actions
    toggleFollow: (currentUserId: string, targetUserId: string) => void;
    isFollowing: (userId: string) => boolean;
    getUser: (userId: string) => User | undefined;
    
    // Comment Actions
    addComment: (projectId: number, authorId: string, author: string, avatar: string, body: string) => void;
    addReply: (commentId: string, authorId: string, author: string, avatar: string, body: string) => void;
    toggleCommentUpvote: (commentId: string, userId: string) => void;
    toggleReplyUpvote: (commentId: string, replyId: string, userId: string) => void;
    getProjectComments: (projectId: number) => Comment[];
}

export const useSocialStore = create<SocialState>()(
    persist(
        (set, get) => ({
            users: mockUsers,
            comments: mockComments,
            following: new Set<string>(),

            toggleFollow: (currentUserId, targetUserId) => {
                set((state) => {
                    const newFollowing = new Set(state.following);
                    const isNowFollowing = !newFollowing.has(targetUserId);
                    
                    if (isNowFollowing) {
                        newFollowing.add(targetUserId);
                    } else {
                        newFollowing.delete(targetUserId);
                    }

                    // Update mock users follower/following counts
                    const updatedUsers = state.users.map(u => {
                        if (u.id === targetUserId) {
                            return { ...u, followers: u.followers + (isNowFollowing ? 1 : -1) };
                        }
                        if (u.id === currentUserId) {
                            return { ...u, following: u.following + (isNowFollowing ? 1 : -1) };
                        }
                        return u;
                    });

                    return { following: newFollowing, users: updatedUsers };
                });
            },

            isFollowing: (userId) => {
                return get().following.has(userId);
            },

            getUser: (userId) => {
                return get().users.find(u => u.id === userId);
            },

            addComment: (projectId, authorId, author, avatar, body) => {
                set((state) => ({
                    comments: [
                        {
                            id: `c-new-${Date.now()}`,
                            projectId,
                            authorId,
                            author,
                            avatar,
                            body,
                            upvotes: 0,
                            createdAt: new Date().toISOString(),
                            replies: []
                        },
                        ...state.comments
                    ]
                }));
            },

            addReply: (commentId, authorId, author, avatar, body) => {
                set((state) => ({
                    comments: state.comments.map(c => {
                        if (c.id === commentId) {
                            return {
                                ...c,
                                replies: [
                                    ...c.replies,
                                    {
                                        id: `r-new-${Date.now()}`,
                                        authorId,
                                        author,
                                        avatar,
                                        body,
                                        upvotes: 0,
                                        createdAt: new Date().toISOString()
                                    }
                                ]
                            };
                        }
                        return c;
                    })
                }));
            },

            toggleCommentUpvote: (commentId, userId) => {
                // Simplified toggle: in a real app you'd track WHICH user upvoted.
                // For UI purposes, we just toggle +1 / -1
                set((state) => ({
                    comments: state.comments.map(c => 
                        c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
                    )
                }));
            },

            toggleReplyUpvote: (commentId, replyId, userId) => {
                set((state) => ({
                    comments: state.comments.map(c => {
                        if (c.id === commentId) {
                            return {
                                ...c,
                                replies: c.replies.map(r => 
                                    r.id === replyId ? { ...r, upvotes: r.upvotes + 1 } : r
                                )
                            };
                        }
                        return c;
                    })
                }));
            },

            getProjectComments: (projectId) => {
                return get().comments.filter(c => c.projectId === projectId);
            }
        }),
        {
            name: 'netlistlab-social',
            // Need to handle Sets in JSON serialization
            partialize: (state) => ({
                ...state,
                following: Array.from(state.following)
            }),
            merge: (persistedState: any, currentState) => ({
                ...currentState,
                ...persistedState,
                following: new Set(persistedState?.following || [])
            })
        }
    )
);
