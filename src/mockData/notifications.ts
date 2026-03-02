export type NotificationType = "star" | "fork" | "comment" | "follow" | "reply";

export interface Notification {
    id: string;
    type: NotificationType;
    actorId: string;
    actor: string;
    actorAvatar: string;
    message: string;
    projectId?: number;
    projectTitle?: string;
    read: boolean;
    createdAt: string;
}

export const mockNotifications: Notification[] = [
    {
        id: "n1",
        type: "star",
        actorId: "user-5",
        actor: "ai_alex",
        actorAvatar: "https://i.pravatar.cc/100?u=user5",
        message: "starred your project",
        projectId: 10,
        projectTitle: "Open-Source Oscilloscope",
        read: false,
        createdAt: "2026-02-28T15:45:00Z",
    },
    {
        id: "n2",
        type: "follow",
        actorId: "user-3",
        actor: "sarah_circuits",
        actorAvatar: "https://i.pravatar.cc/100?u=user3",
        message: "followed you",
        read: false,
        createdAt: "2026-02-28T14:20:00Z",
    },
    {
        id: "n3",
        type: "comment",
        actorId: "user-2",
        actor: "tech_wizard",
        actorAvatar: "https://i.pravatar.cc/100?u=user2",
        message: "commented on your project",
        projectId: 10,
        projectTitle: "Open-Source Oscilloscope",
        read: false,
        createdAt: "2026-02-28T13:00:00Z",
    },
    {
        id: "n4",
        type: "fork",
        actorId: "user-4",
        actor: "drone_guy",
        actorAvatar: "https://i.pravatar.cc/100?u=user4",
        message: "forked your project",
        projectId: 7,
        projectTitle: "Real-Time OS Kernel for ARM",
        read: false,
        createdAt: "2026-02-27T18:30:00Z",
    },
    {
        id: "n5",
        type: "reply",
        actorId: "user-2",
        actor: "tech_wizard",
        actorAvatar: "https://i.pravatar.cc/100?u=user2",
        message: "replied to your comment on",
        projectId: 10,
        projectTitle: "Open-Source Oscilloscope",
        read: false,
        createdAt: "2026-02-27T10:00:00Z",
    },
    {
        id: "n6",
        type: "star",
        actorId: "user-4",
        actor: "drone_guy",
        actorAvatar: "https://i.pravatar.cc/100?u=user4",
        message: "starred your project",
        projectId: 7,
        projectTitle: "Real-Time OS Kernel for ARM",
        read: true,
        createdAt: "2026-02-26T09:15:00Z",
    },
    {
        id: "n7",
        type: "follow",
        actorId: "user-4",
        actor: "drone_guy",
        actorAvatar: "https://i.pravatar.cc/100?u=user4",
        message: "followed you",
        read: true,
        createdAt: "2026-02-25T16:00:00Z",
    },
    {
        id: "n8",
        type: "comment",
        actorId: "user-4",
        actor: "drone_guy",
        actorAvatar: "https://i.pravatar.cc/100?u=user4",
        message: "commented on your project",
        projectId: 10,
        projectTitle: "Open-Source Oscilloscope",
        read: true,
        createdAt: "2026-02-23T15:00:00Z",
    },
    {
        id: "n9",
        type: "star",
        actorId: "user-3",
        actor: "sarah_circuits",
        actorAvatar: "https://i.pravatar.cc/100?u=user3",
        message: "starred your project",
        projectId: 10,
        projectTitle: "Open-Source Oscilloscope",
        read: true,
        createdAt: "2026-02-22T11:00:00Z",
    },
    {
        id: "n10",
        type: "fork",
        actorId: "user-5",
        actor: "ai_alex",
        actorAvatar: "https://i.pravatar.cc/100?u=user5",
        message: "forked your project",
        projectId: 10,
        projectTitle: "Open-Source Oscilloscope",
        read: true,
        createdAt: "2026-02-21T08:00:00Z",
    },
];
