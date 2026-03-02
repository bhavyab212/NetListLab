export interface CommentReply {
    id: string;
    authorId: string;
    author: string;
    avatar: string;
    body: string;
    upvotes: number;
    createdAt: string;
}

export interface Comment {
    id: string;
    projectId: number;
    authorId: string;
    author: string;
    avatar: string;
    body: string;
    upvotes: number;
    createdAt: string;
    replies: CommentReply[];
}

export const mockComments: Comment[] = [
    {
        id: "c1",
        projectId: 1,
        authorId: "user-3",
        author: "sarah_circuits",
        avatar: "https://i.pravatar.cc/100?u=user3",
        body: "The decoupling cap placement near the radar module is excellent. I ran into EMI issues with a similar design — your grounding strategy fixes exactly that. Do you have the KiCad files available?",
        upvotes: 24,
        createdAt: "2026-02-01T10:30:00Z",
        replies: [
            {
                id: "r1-1",
                authorId: "user-2",
                author: "tech_wizard",
                avatar: "https://i.pravatar.cc/100?u=user2",
                body: "Yes! KiCad files are in the GitHub repo under /hardware. I'll also add a note in the schematics tab linking to the ground plane pour settings.",
                upvotes: 8,
                createdAt: "2026-02-01T11:15:00Z",
            },
        ],
    },
    {
        id: "c2",
        projectId: 1,
        authorId: "user-4",
        author: "drone_guy",
        avatar: "https://i.pravatar.cc/100?u=user4",
        body: "What's the detection range at sensitivity 0.75? I'm considering integrating this as a proximity sensor for my quadcopter landing system.",
        upvotes: 11,
        createdAt: "2026-02-03T14:00:00Z",
        replies: [],
    },
    {
        id: "c3",
        projectId: 1,
        authorId: "user-5",
        author: "ai_alex",
        avatar: "https://i.pravatar.cc/100?u=user5",
        body: "Really clever use of FreeRTOS task priorities here. I've seen similar setups crash under interrupt flood — how did you handle the task notification vs queue tradeoff?",
        upvotes: 17,
        createdAt: "2026-02-05T09:20:00Z",
        replies: [
            {
                id: "r3-1",
                authorId: "user-2",
                author: "tech_wizard",
                avatar: "https://i.pravatar.cc/100?u=user2",
                body: "Task notifications over queues for single-producer scenarios. Queues only where multiple ISRs feed the same consumer. The overhead difference was measurable on a logic analyzer.",
                upvotes: 13,
                createdAt: "2026-02-05T10:00:00Z",
            },
        ],
    },
    {
        id: "c4",
        projectId: 4,
        authorId: "user-1",
        author: "bhavya_dev",
        avatar: "https://i.pravatar.cc/100?u=user1",
        body: "Outstanding work. How does the model handle cold-start problem for new nodes in the graph? I couldn't find that in the writeup.",
        upvotes: 19,
        createdAt: "2026-02-08T08:00:00Z",
        replies: [
            {
                id: "r4-1",
                authorId: "user-5",
                author: "ai_alex",
                avatar: "https://i.pravatar.cc/100?u=user5",
                body: "Content-based fallback during cold start — I embed the node's metadata (category, description TF-IDF) and use that until the node accumulates enough graph edges for GCN propagation to kick in.",
                upvotes: 22,
                createdAt: "2026-02-08T09:30:00Z",
            },
        ],
    },
    {
        id: "c5",
        projectId: 4,
        authorId: "user-2",
        author: "tech_wizard",
        avatar: "https://i.pravatar.cc/100?u=user2",
        body: "Do you have benchmarks on inference latency? Wondering if this can run real-time for a collaborative filtering feed at 10k req/s.",
        upvotes: 8,
        createdAt: "2026-02-09T16:00:00Z",
        replies: [],
    },
    {
        id: "c6",
        projectId: 9,
        authorId: "user-1",
        author: "bhavya_dev",
        avatar: "https://i.pravatar.cc/100?u=user1",
        body: "This is the cleanest DDPM implementation I've come across. Your explanation of the noise schedule is what finally made it click for me. Bookmarking this forever.",
        upvotes: 43,
        createdAt: "2026-02-16T12:00:00Z",
        replies: [],
    },
    {
        id: "c7",
        projectId: 9,
        authorId: "user-3",
        author: "sarah_circuits",
        avatar: "https://i.pravatar.cc/100?u=user3",
        body: "I trained this on landscape images (256x256) — converged beautifully. Did you try any CFG-guided generation?",
        upvotes: 14,
        createdAt: "2026-02-17T10:00:00Z",
        replies: [
            {
                id: "r7-1",
                authorId: "user-5",
                author: "ai_alex",
                avatar: "https://i.pravatar.cc/100?u=user5",
                body: "CFG branch is on my road-map — I'll push it as v1.1 next week. For now you can hack it in by duplicating the batch with null class conditioning and blending the score estimates.",
                upvotes: 18,
                createdAt: "2026-02-17T11:45:00Z",
            },
        ],
    },
    {
        id: "c8",
        projectId: 10,
        authorId: "user-2",
        author: "tech_wizard",
        avatar: "https://i.pravatar.cc/100?u=user2",
        body: "I built the v0.9 hardware and it works. 10MSPS is accurate at 100kHz with <0.5% THD. The FFT view is especially impressive for a $60 bill of materials.",
        upvotes: 31,
        createdAt: "2026-02-22T09:00:00Z",
        replies: [
            {
                id: "r8-1",
                authorId: "user-1",
                author: "bhavya_dev",
                avatar: "https://i.pravatar.cc/100?u=user1",
                body: "Awesome to hear! Send me a photo — I'd love to add community builds to the project gallery.",
                upvotes: 12,
                createdAt: "2026-02-22T10:00:00Z",
            },
        ],
    },
    {
        id: "c9",
        projectId: 10,
        authorId: "user-4",
        author: "drone_guy",
        avatar: "https://i.pravatar.cc/100?u=user4",
        body: "Would you consider adding a trigger mode? That would make this a really complete tool for embedded debugging.",
        upvotes: 27,
        createdAt: "2026-02-23T15:00:00Z",
        replies: [],
    },
    {
        id: "c10",
        projectId: 7,
        authorId: "user-2",
        author: "tech_wizard",
        avatar: "https://i.pravatar.cc/100?u=user2",
        body: "Mutex vs semaphore choices are well-motivated in your docs. Did you measure the context switch latency on M4 with your preemptive scheduler?",
        upvotes: 9,
        createdAt: "2026-02-12T13:00:00Z",
        replies: [],
    },
    {
        id: "c11",
        projectId: 2,
        authorId: "user-1",
        author: "bhavya_dev",
        avatar: "https://i.pravatar.cc/100?u=user1",
        body: "The LPLRU implementation is an original piece of work — I haven't seen it documented this clearly anywhere else. Linking this in our lab's VLSI course resources.",
        upvotes: 22,
        createdAt: "2026-02-10T14:00:00Z",
        replies: [],
    },
    {
        id: "c12",
        projectId: 3,
        authorId: "user-5",
        author: "ai_alex",
        avatar: "https://i.pravatar.cc/100?u=user5",
        body: "Very clean ROS2 architecture. I'd suggest decoupling the planner from the controller via a proper action interface instead of a direct topic. Reduces coupling significantly for testing.",
        upvotes: 16,
        createdAt: "2026-02-14T17:00:00Z",
        replies: [
            {
                id: "r12-1",
                authorId: "user-4",
                author: "drone_guy",
                avatar: "https://i.pravatar.cc/100?u=user4",
                body: "Good point. I've been meaning to refactor to Nav2's BT Navigator action for exactly this reason. Will do it in the next revision.",
                upvotes: 7,
                createdAt: "2026-02-14T18:00:00Z",
            },
        ],
    },
    {
        id: "c13",
        projectId: 6,
        authorId: "user-4",
        author: "drone_guy",
        avatar: "https://i.pravatar.cc/100?u=user4",
        body: "30km range is impressive. What antenna gain are you using? And is that in clear line-of-sight or through vegetation?",
        upvotes: 12,
        createdAt: "2026-02-20T11:00:00Z",
        replies: [],
    },
    {
        id: "c14",
        projectId: 5,
        authorId: "user-5",
        author: "ai_alex",
        avatar: "https://i.pravatar.cc/100?u=user5",
        body: "Systolic array for attention is brilliant. How does the on-chip SRAM bandwidth compare to HBM-less PCIe GPUs for the attention compute-bound regime?",
        upvotes: 19,
        createdAt: "2026-02-18T10:00:00Z",
        replies: [],
    },
    {
        id: "c15",
        projectId: 8,
        authorId: "user-3",
        author: "sarah_circuits",
        avatar: "https://i.pravatar.cc/100?u=user3",
        body: "The mold STL files are a lifesaver. I printed these in Shore 30A Smooth-On Dragon Skin — excellent conformance. Great beginner-friendly writeup.",
        upvotes: 8,
        createdAt: "2026-02-25T09:00:00Z",
        replies: [],
    },
];

export function getCommentsByProjectId(projectId: number): Comment[] {
    return mockComments.filter((c) => c.projectId === projectId);
}
