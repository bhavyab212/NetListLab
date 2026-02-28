export interface Project {
    id: number;
    title: string;
    author: string;
    authorAvatar: string;
    description: string;
    image: string;
    category: 'Electronics' | 'Software' | 'Hardware' | 'Robotics' | 'AI/ML';
    categoryStyles: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    tags: string[];
    stars: string;
    views: string;
    comments: string;
}

export const PROJECTS: Project[] = [
    {
        id: 1,
        title: "ESP32 Radar Intrusion",
        author: "@tech_wizard",
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzkYHfcPjgeACqyOLWbJS9MhC5QMgy1uh15Tsax-EIf546egOOO7XtQHP9G0bJcDKZoek0uOiquV-qOyjkImVA-JRufc9xORL6WtEb-roA1GZ_PqEg17mk67qqL2s6etGEWsb2KQPpg7UHcvX-Ml8U9udV0w_e_AoVCUDmizEdfBs98Uu4tBZDp8NulErDhEql2U5uDkTq5pOlvtkUF9tExuqKP-6G-A6Wm7N7RbQ46Xm0XstM44xugNZ8rKyyued4JkuTcXzc2C8",
        description: "A compact, low-power intrusion detection system using ESP32 and millimeter-wave radar sensors for precise motion tracking.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_5pNvx2FK3aW-ULYnuDYuk-caOdCm8NrUFbIMPqIVCvfBqijgLBZQwRp1Rtu-TFBf1gHlx1goKjOx9dptyOPPh82a9jU5o3CN3bRX0pQbWUUvk2qgoGSGNFqI280b3B6mCyCp4baBQH0Wq2f9nQVCWNN_7c2ig5ENgup2RoR--iCjV0rTCa5Upx7x76dWVm7xqAQTEX_J3E-iYifqT4cRYAScg04hm8_7kiYTFHBHuaNtu0uIOmDfXAaM-dXLStAiHV_SfiylR-U",
        category: "Electronics",
        categoryStyles: "bg-emerald-50 text-emerald-700 border-emerald-100/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
        level: "Advanced",
        tags: ["ESP32", "C++", "IoT"],
        stars: "1.2k",
        views: "4.5k",
        comments: "32"
    },
    {
        id: 2,
        title: "VLSI Cache Controller",
        author: "@sarah_circuits",
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzzWoxWAP0kmLiysmjVRC8hDu-ZQgNzsJubFAbjSzr-JAVjIP44OxU05ZcA0Owla1E0PuJa9Pl7VTbz2mOZ-TU4GusxN4NpEsZYeb1U2TIF7qFk946cGGcdYBHKNWJph67fgRLy3_NdDW0z_MN5LA8pkbCPKSBJg4VgfdSpkBkpvcTSGogbKDrTthPU5Q_H8MKNkJ8Mi040NoDz-0TNKlKcdD7nOaBFViuYTNIuBLohCa7fk14pLqMcxlfgkeqU93SS45yH8hIiqI",
        description: "High-performance L2 cache controller design implemented in Verilog with optimized replacement policies.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhrE-XSrbIWi0YyE1w6h72ArUmnegLxq4et2LoO7LuTH5iAU7ebnMFIr0Jr96SeLWTtaJu5d98jLxjD2kQ4UahGgAu5PFreWZ7eiwUXhqxNa6-V6PoMfgJ3g-CxUBioIHdd6QJ66jGIy1GpQvN1sYN3G1jGQQq5V7Gh7P-qxVAwMr0cnGFBz4wsTLHAY2PJBkQyG3aY97k2S5cZ8CQmPLHBYc244LT4Eakpof58Al_JbkUQp-G3V5zldtaaGPwuMAWVx1Ml-j26cA",
        category: "Hardware",
        categoryStyles: "bg-blue-50 text-blue-700 border-blue-100/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30",
        level: "Expert",
        tags: ["Verilog", "FPGA"],
        stars: "892",
        views: "2.1k",
        comments: "14"
    },
    {
        id: 3,
        title: "Autonomous Nav Stack",
        author: "@drone_guy",
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4GeXSBsaDsraoFAWu9m-yFhTWIe-J_pwSVkVnV5Crf9YNBmtFQD0tAf-QpdzsdObDcme-M8zjWgUebAulHlSfZ7H1QQNV8vLCZztZadbL-Kqc0tRYW60AeK1gI1junYonEHvLAKZ1GkghINQQwJMRwMzaQ2abxcWyZ-dk7Gsan3esxRBkX4RswIe-y1slVexTLFKCkgs3w1JKydlKajMCpYCLXIn7EJwehqELd-GcyqVRLLa8wNkvlSfa0HXOr1GKsMmNzt2gfGE",
        description: "Complete navigation stack for quadcopters featuring SLAM, obstacle avoidance, and path planning using ROS2.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuMll4CqvUrVlLD2DWwC77DjGaFLzfo5EnJBMNbxtrPnW3_UDZO7AOQn-rAyVBDB4cqzDIzTcg3lzn9bVkdYGpF2tMaxDMuDNeouYD9jZIQ-SDi4jH9XkVi4-CStR3ToYl1YLsMGEAZQxQ1edZWXqm0bUtcVN9uTBE__iUfCgt1_3BfF5XqPgulMP-V3L_4PdOKnEIhpWfG5cjpFhtVQjKKYgzh35wlokeeF5d6ULeFLN8x2doxrqfbYy6I5988BUIwKvC3FwnSmE",
        category: "Robotics",
        categoryStyles: "bg-orange-50 text-orange-700 border-orange-100/50 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30",
        level: "Intermediate",
        tags: ["ROS2", "Python"],
        stars: "543",
        views: "1.8k",
        comments: "21"
    },
    {
        id: 4,
        title: "Neural Network Accelerator",
        author: "@ai_researcher",
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhrE-XSrbIWi0YyE1w6h72ArUmnegLxq4et2LoO7LuTH5iAU7ebnMFIr0Jr96SeLWTtaJu5d98jLxjD2kQ4UahGgAu5PFreWZ7eiwUXhqxNa6-V6PoMfgJ3g-CxUBioIHdd6QJ66jGIy1GpQvN1sYN3G1jGQQq5V7Gh7P-qxVAwMr0cnGFBz4wsTLHAY2PJBkQyG3aY97k2S5cZ8CQmPLHBYc244LT4Eakpof58Al_JbkUQp-G3V5zldtaaGPwuMAWVx1Ml-j26cA",
        description: "FPGA-based accelerator for deep learning inference with quantized models and real-time performance metrics.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_5pNvx2FK3aW-ULYnuDYuk-caOdCm8NrUFbIMPqIVCvfBqijgLBZQwRp1Rtu-TFBf1gHlx1goKjOx9dptyOPPh82a9jU5o3CN3bRX0pQbWUUvk2qgoGSGNFqI280b3B6mCyCp4baBQH0Wq2f9nQVCWNN_7c2ig5ENgup2RoR--iCjV0rTCa5Upx7x76dWVm7xqAQTEX_J3E-iYifqT4cRYAScg04hm8_7kiYTFHBHuaNtu0uIOmDfXAaM-dXLStAiHV_SfiylR-U",
        category: "AI/ML",
        categoryStyles: "bg-purple-50 text-purple-700 border-purple-100/50 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/30",
        level: "Advanced",
        tags: ["FPGA", "TensorFlow", "HLS"],
        stars: "2.1k",
        views: "5.2k",
        comments: "48"
    },
    {
        id: 5,
        title: "Power Supply Design",
        author: "@power_guru",
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzkYHfcPjgeACqyOLWbJS9MhC5QMgy1uh15Tsax-EIf546egOOO7XtQHP9G0bJcDKZoek0uOiquV-qOyjkImVA-JRufc9xORL6WtEb-roA1GZ_PqEg17mk67qqL2s6etGEWsb2KQPpg7UHcvX-Ml8U9udV0w_e_AoVCUDmizEdfBs98Uu4tBZDp8NulErDhEql2U5uDkTq5pOlvtkUF9tExuqKP-6G-A6Wm7N7RbQ46Xm0XstM44xugNZ8rKyyued4JkuTcXzc2C8",
        description: "Multi-rail DC-DC converter board with isolated outputs for mixed-signal systems, featuring integrated power management.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuMll4CqvUrVlLD2DWwC77DjGaFLzfo5EnJBMNbxtrPnW3_UDZO7AOQn-rAyVBDB4cqzDIzTcg3lzn9bVkdYGpF2tMaxDMuDNeouYD9jZIQ-SDi4jH9XkVi4-CStR3ToYl1YLsMGEAZQxQ1edZWXqm0bUtcVN9uTBE__iUfCgt1_3BfF5XqPgulMP-V3L_4PdOKnEIhpWfG5cjpFhtVQjKKYgzh35wlokeeF5d6ULeFLN8x2doxrqfbYy6I5988BUIwKvC3FwnSmE",
        category: "Electronics",
        categoryStyles: "bg-emerald-50 text-emerald-700 border-emerald-100/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
        level: "Expert",
        tags: ["PCB Design", "Power Electronics"],
        stars: "756",
        views: "1.9k",
        comments: "19"
    },
    {
        id: 6,
        title: "WebAssembly Compiler",
        author: "@compiler_dev",
        authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzzWoxWAP0kmLiysmjVRC8hDu-ZQgNzsJubFAbjSzr-JAVjIP44OxU05ZcA0Owla1E0PuJa9Pl7VTbz2mOZ-TU4GusxN4NpEsZYeb1U2TIF7qFk946cGGcdYBHKNWJph67fgRLy3_NdDW0z_MN5LA8pkbCPKSBJg4VgfdSpkBkpvcTSGogbKDrTthPU5Q_H8MKNkJ8Mi040NoDz-0TNKlKcdD7nOaBFViuYTNIuBLohCa7fk14pLqMcxlfgkeqU93SS45yH8hIiqI",
        description: "Optimized compiler targeting WebAssembly with support for SIMD operations and tail call optimization.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4GeXSBsaDsraoFAWu9m-yFhTWIe-J_pwSVkVnV5Crf9YNBmtFQD0tAf-QpdzsdObDcme-M8zjWgUebAulHlSfZ7H1QQNV8vLCZztZadbL-Kqc0tRYW60AeK1gI1junYonEHvLAKZ1GkghINQQwJMRwMzaQ2abxcWyZ-dk7Gsan3esxRBkX4RswIe-y1slVexTLFKCkgs3w1JKydlKajMCpYCLXIn7EJwehqELd-GcyqVRLLa8wNkvlSfa0HXOr1GKsMmNzt2gfGE",
        category: "Software",
        categoryStyles: "bg-sky-50 text-sky-700 border-sky-100/50 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/30",
        level: "Expert",
        tags: ["Rust", "Compilers"],
        stars: "1.8k",
        views: "3.4k",
        comments: "27"
    }
];
