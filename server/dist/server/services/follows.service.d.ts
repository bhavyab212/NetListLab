export declare function toggleFollow(followerId: string, followingUsername: string): Promise<{
    following: boolean;
} | null>;
export declare function getFollowers(username: string): Promise<{
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    current_role: string | null;
}[] | null>;
export declare function getFollowing(username: string): Promise<{
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    current_role: string | null;
}[] | null>;
//# sourceMappingURL=follows.service.d.ts.map