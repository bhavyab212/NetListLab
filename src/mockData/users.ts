export interface User {
    id: string;
    username: string;
    fullName: string;
    email: string;
    avatar: string;
    bio: string;
    role: string;
    institution: string;
    location: string;
    joinedAt: string;
    website?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    skills: string[];
    followers: number;
    following: number;
    projectCount: number;
    totalStars: number;
    isVerified: boolean;
    domains: string[];
}

// user-1 is the current logged-in user (currentUser)
export const mockUsers: User[] = [
    {
        id: "user-1",
        username: "bhavya_dev",
        fullName: "Bhavya Sharma",
        email: "bhavya@netlistlab.io",
        avatar: "https://i.pravatar.cc/150?u=user1",
        bio: "Full-stack engineer obsessed with embedded systems, hardware hacking, and building in public. I document everything I make.",
        role: "Systems Engineer",
        institution: "IIT Bombay",
        location: "Mumbai, India",
        joinedAt: "2026-01-01T00:00:00Z",
        website: "https://bhavya.dev",
        github: "bhavya_dev",
        twitter: "bhavya_dev",
        linkedin: "bhavya-sharma",
        skills: ["C++", "Python", "STM32", "FPGA", "Next.js", "Embedded Linux"],
        followers: 342,
        following: 89,
        projectCount: 2,
        totalStars: 2422,
        isVerified: true,
        domains: ["Electronics", "Software"],
    },
    {
        id: "user-2",
        username: "tech_wizard",
        fullName: "Arjun Mehta",
        email: "arjun@netlistlab.io",
        avatar: "https://i.pravatar.cc/150?u=user2",
        bio: "Hardware hacker. ASIC designer by day. Building silicon that thinks.",
        role: "VLSI Design Engineer",
        institution: "IISc Bangalore",
        location: "Bangalore, India",
        joinedAt: "2026-01-05T00:00:00Z",
        github: "tech_wizard",
        twitter: "tech_wizard_arj",
        skills: ["Verilog", "SystemVerilog", "Python", "C++", "SPICE", "KiCad"],
        followers: 891,
        following: 134,
        projectCount: 2,
        totalStars: 2764,
        isVerified: true,
        domains: ["Electronics", "Hardware"],
    },
    {
        id: "user-3",
        username: "sarah_circuits",
        fullName: "Sarah Chen",
        email: "sarah@netlistlab.io",
        avatar: "https://i.pravatar.cc/150?u=user3",
        bio: "RF engineer and analog circuits enthusiast. Testing the limits of wireless communication.",
        role: "RF Systems Engineer",
        institution: "MIT",
        location: "Cambridge, USA",
        joinedAt: "2026-01-10T00:00:00Z",
        github: "sarah_circuits",
        linkedin: "sarah-chen-rf",
        skills: ["RF Design", "LoRa", "Verilog", "ADS", "MATLAB", "C"],
        followers: 512,
        following: 67,
        projectCount: 2,
        totalStars: 1612,
        isVerified: false,
        domains: ["Electronics", "Hardware"],
    },
    {
        id: "user-4",
        username: "drone_guy",
        fullName: "Marcus Rivera",
        email: "marcus@netlistlab.io",
        avatar: "https://i.pravatar.cc/150?u=user4",
        bio: "Robotics PhD student. Building machines that see, fly, and grip.",
        role: "Robotics Engineer",
        institution: "Carnegie Mellon",
        location: "Pittsburgh, USA",
        joinedAt: "2026-01-18T00:00:00Z",
        github: "drone_guy",
        twitter: "droneguy_rmx",
        skills: ["ROS2", "Python", "OpenCV", "C++", "Gazebo", "PX4"],
        followers: 437,
        following: 201,
        projectCount: 2,
        totalStars: 932,
        isVerified: false,
        domains: ["Robotics"],
    },
    {
        id: "user-5",
        username: "ai_alex",
        fullName: "Alex Nakamura",
        email: "alex@netlistlab.io",
        avatar: "https://i.pravatar.cc/150?u=user5",
        bio: "ML researcher. I train models, break them, and document what I learn.",
        role: "ML Research Engineer",
        institution: "Stanford AI Lab",
        location: "San Francisco, USA",
        joinedAt: "2026-01-22T00:00:00Z",
        github: "ai_alex",
        twitter: "ai_alex_n",
        linkedin: "alex-nakamura",
        skills: ["PyTorch", "Python", "CUDA", "JAX", "Triton", "NumPy"],
        followers: 2140,
        following: 312,
        projectCount: 2,
        totalStars: 5518,
        isVerified: true,
        domains: ["AI/ML"],
    },
];

// Helper: get the currentUser (user-1 = bhavya_dev)
export const currentUser = mockUsers[0];
