export interface Project {
  id: number;
  title: string;
  slug: string;
  authorId: string;
  author: string;
  authorAvatar: string;
  description: string;
  image: string;
  category: string;
  categoryStyles?: string;
  level?: string;
  difficulty?: string;
  tags: string[];
  bom?: { name: string; category: string; qty: number; price: string; supplier: string; link: string; }[];
  buildSteps?: { title: string; body: string; time: string; imageUrl: string; }[];
  codeFiles?: { id: string; name: string; language: string; content: string; }[];
  stars: number;
  views: number;
  comments: number;
  forks: number;
  createdAt: string;
  status: 'published' | 'draft';

  // Fork metadata
  forkedFrom?: { projectId: number; projectTitle: string; authorId: string; author: string; };
  forkedAt?: string;
  lastSyncedAt?: string;
  changesSinceSync?: number;

  // Overview metadata
  prerequisites?: string[];
  tools?: string[];
  designDecisions?: { q: string; a: string }[];
  objectives?: string[];
  githubUrl?: string;
  docsUrl?: string;
  version?: string;
  license?: string;
  safetyNotice?: string;

  // Schematics
  schematics?: { name: string; tag: string; tool: string; layers: string; nets?: string; erc?: string; rev?: string; size?: string; desc: string; img: string; }[];
  pcbLayers?: { num: string; color: string; type: string; weight: string; }[];
  pcbBoardSpecs?: { material?: string; thickness?: string; finish?: string; silkscreen?: string; soldermask?: string; minTrace?: string; };
  designRules?: { rule: string; value: string; status: string; }[];
  signalNotes?: string[];

  // Code sub-panels
  dependencies?: { name: string; ver: string; license: string; desc: string; }[];
  buildInstructions?: { step: string; cmd: string; note: string; }[];
  envSetup?: { title: string; items: string[]; }[];
  testSuite?: { name: string; file: string; status: string; ms: string; desc: string; }[];

  // Media
  galleryImages?: { url: string; caption: string; label: string; }[];
  videos?: { title: string; url: string; channel?: string; views?: string; duration?: string; desc?: string; }[];
  simulations?: { title: string; desc: string; url: string; icon: string; badge: string; }[];
  buildLogs?: { date: string; title: string; body: string; tag: string; images: string[]; }[];
  downloads?: { name: string; size: string; fmt: string; url: string; desc?: string; }[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: "ESP32 Radar Intrusion System",
    slug: "esp32-radar-intrusion",
    authorId: "user-2",
    author: "tech_wizard",
    authorAvatar: "https://i.pravatar.cc/150?u=user2",
    description: "A compact, low-power intrusion detection system using ESP32 and millimeter-wave radar sensors for precise motion tracking in industrial environments.",
    // PCB / soldering close-up
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    categoryStyles: "bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-xl shadow-lg",
    level: "Advanced",
    tags: ["ESP32", "C++", "IoT", "Radar", "FreeRTOS"],
    stars: 1243,
    views: 4512,
    comments: 32,
    forks: 128,
    createdAt: "2026-01-15T09:00:00Z",
    status: "published",
    prerequisites: ["Basic C++ knowledge", "Experience with ESP-IDF", "Soldering skills"],
    tools: ["Soldering Iron", "Multimeter", "USB-UART Bridge"],
    objectives: ["Build a low-power intrusion detector", "Process raw mmWave signals", "Publish status to MQTT"],
    designDecisions: [{ q: "Why ESP32-S3?", a: "To utilize vector instructions for fast FFT calculations on radar data." }],
    githubUrl: "https://github.com/tech_wizard/esp32-radar-intrusion",
    docsUrl: "https://docs.netlistlab.dev/esp32-radar",
    version: "v1.2.0",
    license: "MIT",
    safetyNotice: "Radar emits low-power RF. Ensure compliance with local regulations (FCC Part 15).",
    bom: [
      { name: "ESP32-S3 WROOM 1", category: "Microcontroller", qty: 1, price: "450", supplier: "Mouser", link: "https://mouser.com/esp32s3" },
      { name: "LD2410C mmWave Radar", category: "Sensor", qty: 1, price: "350", supplier: "AliExpress", link: "https://aliexpress.com/ld2410" },
      { name: "18650 Battery Cell 3000mAh", category: "Power", qty: 1, price: "250", supplier: "Robu", link: "https://robu.in/18650" }
    ],
    buildSteps: [
      { title: "PCB Assembly", time: "30m", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", body: "Solder the ESP32-S3 module using hot air. Then manually solder all 0603 passives." },
      { title: "Radar Integration", time: "15m", imageUrl: "", body: "Connect TX/RX pins of LD2410C to UART2 on the ESP32. Ensure 5V stable power supply." }
    ],
    codeFiles: [
      { id: "1", name: "main.cpp", language: "cpp", content: "#include <WiFi.h>\n#include \"RadarManager.h\"\n\nRadarManager radar(Serial2);\n\nvoid setup() {\n  Serial.begin(115200);\n  radar.begin();\n}\n\nvoid loop() {\n  if(radar.detectMotion()) {\n    Serial.println(\"Intrusion detected!\");\n  }\n  delay(100);\n}" }
    ],
    schematics: [
      { name: "Main Logic", tag: "logic", tool: "KiCad 7", layers: "2", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", desc: "ESP32 decoupling and radar interfacing schematic." }
    ],
    pcbLayers: [{ num: "F.Cu", color: "#eab308", type: "Signal", weight: "1oz" }, { num: "B.Cu", color: "#22c55e", type: "GND Plane", weight: "1oz" }],
    pcbBoardSpecs: { material: "FR4-TG130", thickness: "1.6mm", finish: "HASL", silkscreen: "White", soldermask: "Green", minTrace: "6 mil" },
    designRules: [{ rule: "Min Clearance", value: "0.2mm", status: "pass" }],
    dependencies: [{ name: "PubSubClient", ver: "2.8", license: "MIT", desc: "MQTT client library for publishing alerts." }],
    buildInstructions: [{ step: "Compile", cmd: "idf.py build", note: "Takes ~2 mins on first run." }],
    envSetup: [{ title: "Toolchain", items: ["Install ESP-IDF v5.1", "Setup Python environment"] }],
    testSuite: [{ name: "Radar UART Comm", file: "test_radar.cpp", status: "pass", ms: "45", desc: "Verifies RX/TX loopback and protocol parsing." }],
    galleryImages: [{ url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", caption: "Finished prototype assembled", label: "Final Build" }],
    simulations: [{ title: "Radar Field Sim", desc: "Antenna radiation pattern simulation", url: "https://wokwi.com", icon: "📡", badge: "HFSS" }],
    downloads: [{ name: "ESP32_Radar_Gerbers.zip", size: "1.2MB", fmt: "ZIP", url: "#" }]
  },
  {
    id: 2,
    title: "VLSI Cache Controller",
    slug: "vlsi-cache-controller",
    authorId: "user-3",
    author: "sarah_circuits",
    authorAvatar: "https://i.pravatar.cc/150?u=user3",
    description: "High-performance L2 cache controller design implemented in Verilog with LRU/LPLRU replacement policies, optimized for TSMC 28nm process.",
    // Silicon chip die close-up
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=900&q=80",
    category: "Hardware",
    categoryStyles: "bg-blue-100/90 dark:bg-blue-950/90 text-blue-800 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-xl shadow-lg",
    level: "Expert",
    tags: ["Verilog", "FPGA", "VHDL", "VLSI", "SystemVerilog"],
    stars: 892,
    views: 2134,
    comments: 14,
    forks: 45,
    createdAt: "2026-01-20T11:30:00Z",
    status: "published",
  },
  {
    id: 3,
    title: "Autonomous Quadcopter Nav Stack",
    slug: "autonomous-quadcopter",
    authorId: "user-4",
    author: "drone_guy",
    authorAvatar: "https://i.pravatar.cc/150?u=user4",
    description: "Complete navigation stack for quadcopters featuring visual-inertial SLAM, dynamic obstacle avoidance, and multi-waypoint path planning using ROS2 Humble.",
    // Drone flying shot
    image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=900&q=80",
    category: "Robotics",
    categoryStyles: "bg-orange-100/90 dark:bg-orange-950/90 text-orange-800 dark:text-orange-300 border-orange-200/50 dark:border-orange-800/50 backdrop-blur-xl shadow-lg",
    level: "Intermediate",
    tags: ["ROS2", "Python", "OpenCV", "SLAM", "PX4"],
    stars: 543,
    views: 1873,
    comments: 21,
    forks: 89,
    createdAt: "2026-01-25T14:00:00Z",
    status: "published",
  },
  {
    id: 4,
    title: "Graph Neural Network Recommender",
    slug: "gnn-recommendations",
    authorId: "user-5",
    author: "ai_alex",
    authorAvatar: "https://i.pravatar.cc/150?u=user5",
    description: "Implementation of Graph Convolutional Networks for social network recommendation systems achieving 94.3% MAP@10 with PyTorch Geometric on OGB datasets.",
    // Neural network visualization / data science
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    category: "AI/ML",
    categoryStyles: "bg-violet-100/90 dark:bg-violet-950/90 text-violet-800 dark:text-violet-300 border-violet-200/50 dark:border-violet-800/50 backdrop-blur-xl shadow-lg",
    level: "Expert",
    tags: ["PyTorch", "GNN", "ML", "Python", "CUDA"],
    stars: 2108,
    views: 8934,
    comments: 56,
    forks: 312,
    createdAt: "2026-02-01T08:00:00Z",
    status: "published",
  },
  {
    id: 5,
    title: "Neural Engine Accelerator ASIC",
    slug: "neural-engine-asic",
    authorId: "user-2",
    author: "tech_wizard",
    authorAvatar: "https://i.pravatar.cc/150?u=user2",
    description: "Custom ASIC design for accelerating transformer-based neural networks with systolic array MAC units and on-chip SRAM. Taped out on GF 12nm.",
    // Semiconductor wafer / chip fab
    image: "https://images.unsplash.com/photo-1518481612222-68bbe828ebd1?auto=format&fit=crop&w=900&q=80",
    category: "Hardware",
    categoryStyles: "bg-blue-100/90 dark:bg-blue-950/90 text-blue-800 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-xl shadow-lg",
    level: "Expert",
    tags: ["Verilog", "ASIC", "AI", "Synthesis", "DRC"],
    stars: 1521,
    views: 6201,
    comments: 42,
    forks: 156,
    createdAt: "2026-02-05T10:00:00Z",
    status: "published",
  },
  {
    id: 6,
    title: "LoRa Mesh Network",
    slug: "lora-mesh-network",
    authorId: "user-3",
    author: "sarah_circuits",
    authorAvatar: "https://i.pravatar.cc/150?u=user3",
    description: "Self-healing decentralized communication network for remote areas using LoRa SX1276 with optimized AODV routing. 30km range field-tested.",
    // Radio tower / antenna / RF waves
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    categoryStyles: "bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-xl shadow-lg",
    level: "Intermediate",
    tags: ["LoRa", "Arduino", "IoT", "Networking", "RF"],
    stars: 720,
    views: 3421,
    comments: 18,
    forks: 64,
    createdAt: "2026-02-08T12:00:00Z",
    status: "published",
  },
  {
    id: 7,
    title: "Real-Time OS Kernel for ARM",
    slug: "rtos-arm-kernel",
    authorId: "user-1",
    author: "bhavya_dev",
    authorAvatar: "https://i.pravatar.cc/150?u=user1",
    description: "A preemptive, priority-based RTOS kernel for ARM Cortex-M4 with cooperative round-robin scheduling, inter-task communication, and a custom heap allocator.",
    // ARM chip / microcontroller board
    image: "https://images.unsplash.com/photo-1501250987900-211872d97eaa?auto=format&fit=crop&w=900&q=80",
    category: "Software",
    categoryStyles: "bg-rose-100/90 dark:bg-rose-950/90 text-rose-800 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/50 backdrop-blur-xl shadow-lg",
    level: "Expert",
    tags: ["C", "ARM", "RTOS", "Embedded", "Assembly"],
    stars: 634,
    views: 2890,
    comments: 11,
    forks: 78,
    createdAt: "2026-02-10T09:00:00Z",
    status: "published",
    prerequisites: ["Strong understanding of C/Assembly", "Operating Systems concepts", "ARM Cortex-M Architecture"],
    tools: ["J-Link Debugger", "Logic Analyzer", "Oscilloscope"],
    objectives: ["Achieve deterministic context switching < 2μs", "Implement priority inheritance mutexes", "Create an O(1) memory allocator"],
    designDecisions: [{ q: "Why cooperative round-robin?", a: "To allow equal priority tasks to share CPU time fairly without starving, while strictly preempting for higher priority tasks." }],
    githubUrl: "https://github.com/bhavya_dev/rtos-arm-kernel",
    version: "v0.8.0-beta",
    license: "Apache-2.0",
    bom: [
      { name: "STM32F429I-DISC1", category: "Development Board", qty: 1, price: "2400", supplier: "STMicroelectronics", link: "#" },
      { name: "Saleae Logic Pro 8", category: "Measurement", qty: 1, price: "40000", supplier: "Saleae", link: "#" }
    ],
    codeFiles: [
      { id: "1", name: "kernel.c", language: "c", content: "#include \"kernel.h\"\n\nvoid os_kernel_start() {\n    // Setup SysTick for 1ms tick\n    SysTick_Config(SystemCoreClock / 1000);\n    os_start_first_task();\n}\n\nvoid os_yield() {\n    // Trigger PendSV for context switch\n    SCB->ICSR |= SCB_ICSR_PENDSVSET_Msk;\n}" },
      { id: "2", name: "context.s", language: "c", content: "PendSV_Handler:\n    /* Save current context */\n    MRS R0, PSP\n    STMDB R0!, {R4-R11}\n    /* Load new context */\n    ... " }
    ],
    buildSteps: [
      { title: "Environment Validation", time: "5m", imageUrl: "", body: "Ensure GCC ARM Toolchain is in your PATH. Verify Make is installed." },
      { title: "Compilation", time: "1m", imageUrl: "", body: "Run `make -j8` in the root directory. This will generate the kernel.elf and kernel.bin files." },
      { title: "Flashing", time: "2m", imageUrl: "", body: "Connect J-Link and run `make flash`." }
    ],
    buildInstructions: [
      { step: "Clean", cmd: "make clean", note: "Removes all object fields" },
      { step: "Build", cmd: "make all", note: "Builds ELF, BIN, and HEX" }
    ],
    envSetup: [
      { title: "Compiler", items: ["arm-none-eabi-gcc v10.3.1"] },
      { title: "Debugger", items: ["OpenOCD v0.11", "GDB-Multiarch"] }
    ],
    testSuite: [
      { name: "Context Switch Latency", file: "test_latency.c", status: "pass", ms: "12", desc: "Measured max 1.8μs across 10,000 switches" },
      { name: "Mutex Priority Inheritance", file: "test_mutex.c", status: "pass", ms: "45", desc: "Verifies high priority task unblocks quickly" }
    ],
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1501250987900-211872d97eaa?auto=format&fit=crop&w=600&q=80", caption: "Dev board running 15 concurrent tasks", label: "Runtime" }
    ]
  },
  {
    id: 8,
    title: "Soft Robotic Gripper",
    slug: "soft-robotic-gripper",
    authorId: "user-4",
    author: "drone_guy",
    authorAvatar: "https://i.pravatar.cc/150?u=user4",
    description: "Pneumatically actuated soft gripper based on bellows-type actuators, handling fragile objects up to 500g without damage. 3D printed molds included.",
    // Robot arm / mechanical gripper
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
    category: "Robotics",
    categoryStyles: "bg-orange-100/90 dark:bg-orange-950/90 text-orange-800 dark:text-orange-300 border-orange-200/50 dark:border-orange-800/50 backdrop-blur-xl shadow-lg",
    level: "Beginner",
    tags: ["3D Print", "Pneumatics", "ROS", "Python", "Actuator"],
    stars: 389,
    views: 1456,
    comments: 9,
    forks: 31,
    createdAt: "2026-02-12T15:00:00Z",
    status: "published",
  },
  {
    id: 9,
    title: "Diffusion Model from Scratch",
    slug: "diffusion-model-scratch",
    authorId: "user-5",
    author: "ai_alex",
    authorAvatar: "https://i.pravatar.cc/150?u=user5",
    description: "Clean, annotated implementation of DDPM and DDIM from first principles in pure PyTorch. Trains on CelebA-HQ in under 4 hours on a single A100.",
    // AI / machine learning visual
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80",
    category: "AI/ML",
    categoryStyles: "bg-violet-100/90 dark:bg-violet-950/90 text-violet-800 dark:text-violet-300 border-violet-200/50 dark:border-violet-800/50 backdrop-blur-xl shadow-lg",
    level: "Expert",
    tags: ["PyTorch", "Diffusion", "Deep Learning", "CUDA", "Python"],
    stars: 3410,
    views: 14200,
    comments: 87,
    forks: 445,
    createdAt: "2026-02-15T07:00:00Z",
    status: "published",
  },
  {
    id: 10,
    title: "Open-Source Oscilloscope",
    slug: "open-source-oscilloscope",
    authorId: "user-1",
    author: "bhavya_dev",
    authorAvatar: "https://i.pravatar.cc/150?u=user1",
    description: "2-channel, 10MSPS oscilloscope built around STM32H7 and a 4-inch TFT. Supports USB data export, FFT mode, and a Python desktop companion app.",
    // Oscilloscope / test equipment / waveforms
    image: "https://images.unsplash.com/photo-1578022761797-b8636ac1773c?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    categoryStyles: "bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-xl shadow-lg",
    level: "Advanced",
    tags: ["STM32", "C++", "DSP", "Embedded", "Python"],
    stars: 1788,
    views: 7341,
    comments: 63,
    forks: 201,
    createdAt: "2026-02-20T11:00:00Z",
    status: "published",
  },
];
