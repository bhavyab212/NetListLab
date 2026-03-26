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
    description: "Compact mmWave-based human presence detector using ESP32-S3 and LD2410C radar. Detects stationary occupancy via micro-Doppler breathing signatures. Publishes real-time MQTT alerts with FreeRTOS task scheduling.",
    image: "https://images.unsplash.com/photo-1601004890657-03e58aaf2570?auto=format&fit=crop&w=900&q=80",
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
    version: "v1.2.0",
    license: "MIT",
    githubUrl: "https://github.com/tech_wizard/esp32-radar-intrusion",
    safetyNotice: "LD2410C emits 24GHz RF at <20dBm. Complies with FCC Part 15 and CE RED. Keep 30cm clearance during operation.",
    prerequisites: ["ESP-IDF v5.1 or Arduino Core 2.x", "Soldering experience (SMD 0402)", "Basic MQTT/WiFi knowledge"],
    tools: ["Soldering iron + hot air station", "USB-UART bridge (CP2102)", "Multimeter"],
    objectives: ["Detect stationary human presence via micro-Doppler", "Publish presence state to MQTT broker every 500ms", "Achieve <5s cold boot to first detection"],
    designDecisions: [
      { q: "Why LD2410C over PIR?", a: "PIR only detects movement. LD2410C detects breathing at rest — critical for occupancy systems." },
      { q: "Why FreeRTOS?", a: "Separate tasks for radar polling, WiFi keepalive, and MQTT publish prevents blocking delays." }
    ],
    bom: [
      { name: "ESP32-S3 WROOM-1 N8R2", category: "Microcontroller", qty: 1, price: "₹450", supplier: "Mouser", link: "https://www.mouser.in/ProductDetail/356-ESP32-S3-WROOM-1" },
      { name: "HLK-LD2410C mmWave Radar", category: "Sensor", qty: 1, price: "₹520", supplier: "AliExpress", link: "https://www.aliexpress.com/item/1005004788728875.html" },
      { name: "AMS1117-3.3 LDO Regulator", category: "Power", qty: 2, price: "₹12", supplier: "Robu", link: "https://robu.in/product/ams1117-3-3/" },
      { name: "100µF/16V Electrolytic Cap", category: "Passive", qty: 4, price: "₹8", supplier: "Robu", link: "https://robu.in" },
      { name: "0.96\" SSD1306 OLED Display", category: "Display", qty: 1, price: "₹250", supplier: "Robu", link: "https://robu.in/product/0-96-inch-oled-i2c/" },
      { name: "18650 Battery Holder", category: "Power", qty: 1, price: "₹60", supplier: "Robu", link: "https://robu.in" }
    ],
    buildSteps: [
      { title: "PCB Fabrication", time: "2d", imageUrl: "https://images.unsplash.com/photo-1601004890657-03e58aaf2570?auto=format&fit=crop&w=600&q=80", body: "Order PCB from JLCPCB using provided Gerbers. 2-layer FR4, 1.6mm, HASL finish. Takes 3-5 days to arrive." },
      { title: "SMD Assembly", time: "1h", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", body: "Apply solder paste to pads. Place 0402 passives, AMS1117, and ESP32-S3 module. Reflow at 240°C peak." },
      { title: "Radar Module Wiring", time: "20m", imageUrl: "", body: "Connect LD2410C TX→GPIO17, RX→GPIO18. Power with 5V. Use 10kΩ pull-ups on I2C for OLED (SDA→GPIO21, SCL→GPIO22)." },
      { title: "Flash Firmware", time: "10m", imageUrl: "", body: "Clone repo. Copy config.h.example to config.h. Fill WiFi SSID, password, MQTT broker IP. Run: idf.py -p /dev/ttyUSB0 flash monitor" },
      { title: "Calibration", time: "5m", imageUrl: "", body: "Open serial monitor at 115200. Enter 'CAL' command. Stand 1m from sensor for 10s. Threshold auto-sets." }
    ],
    codeFiles: [
      {
        id: "1", name: "main.cpp", language: "cpp",
        content: "#include <WiFi.h>\n#include <PubSubClient.h>\n#include \"RadarManager.h\"\n#include \"config.h\"\n\nRadarManager radar(Serial2, GPIO_NUM_17, GPIO_NUM_18);\nWiFiClient wifiClient;\nPubSubClient mqtt(wifiClient);\n\nvoid mqttTask(void *pv) {\n    while(1) {\n        if (!mqtt.connected()) mqtt.connect(DEVICE_ID);\n        RadarState s = radar.getState();\n        String payload = String(\"{\\\"present\\\":\") + (s.present ? \"true\" : \"false\") +\n                         \",\\\"distance\\\":\" + s.distance + \"}\";\n        mqtt.publish(MQTT_TOPIC, payload.c_str());\n        vTaskDelay(pdMS_TO_TICKS(500));\n    }\n}\n\nvoid setup() {\n    Serial.begin(115200);\n    WiFi.begin(WIFI_SSID, WIFI_PASS);\n    radar.begin();\n    mqtt.setServer(MQTT_HOST, 1883);\n    xTaskCreate(mqttTask, \"MQTT\", 4096, NULL, 1, NULL);\n}\n\nvoid loop() {\n    radar.poll();\n    mqtt.loop();\n}"
      },
      {
        id: "2", name: "RadarManager.h", language: "cpp",
        content: "#pragma once\n#include <HardwareSerial.h>\n\nstruct RadarState { bool present; int distance; float energy; };\n\nclass RadarManager {\npublic:\n    RadarManager(HardwareSerial& s, int tx, int rx) : _s(s), _tx(tx), _rx(rx) {}\n    void begin() { _s.begin(256000, SERIAL_8N1, _rx, _tx); }\n    void poll();\n    RadarState getState() const { return _state; }\nprivate:\n    HardwareSerial& _s;\n    int _tx, _rx;\n    RadarState _state{};\n};"
      }
    ],
    dependencies: [{ name: "PubSubClient", ver: "2.8.0", license: "MIT", desc: "MQTT client for ESP32. Handles QoS 0 publish to broker." }],
    buildInstructions: [
      { step: "Clone", cmd: "git clone https://github.com/tech_wizard/esp32-radar-intrusion && cd esp32-radar-intrusion", note: "" },
      { step: "Configure", cmd: "cp config.h.example config.h && nano config.h", note: "Fill WIFI_SSID, WIFI_PASS, MQTT_HOST" },
      { step: "Build & Flash", cmd: "idf.py -p /dev/ttyUSB0 flash monitor", note: "Requires ESP-IDF v5.1+" }
    ],
    testSuite: [
      { name: "Radar UART Parse", file: "test/test_radar.cpp", status: "pass", ms: "12", desc: "Sends mock LD2410C frames, verifies state parsing." },
      { name: "MQTT Publish Cycle", file: "test/test_mqtt.cpp", status: "pass", ms: "340", desc: "Mocks broker, verifies JSON payload structure and 500ms interval." }
    ],
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1601004890657-03e58aaf2570?auto=format&fit=crop&w=600&q=80", caption: "ESP32-S3 board with LD2410C radar module mounted", label: "Final Assembly" },
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", caption: "PCB top layer – SMD components soldered", label: "PCB Top" }
    ],
    signalNotes: ["24GHz UART data at 256000 baud — keep trace <5cm", "Decouple radar VCC with 100µF + 100nF in parallel"],
    downloads: [
      { name: "ESP32_Radar_Gerbers_v1.2.zip", size: "1.4MB", fmt: "ZIP", url: "#", desc: "KiCad 7 Gerbers for JLCPCB 2-layer order" },
      { name: "ESP32_Radar_Firmware_v1.2.bin", size: "312KB", fmt: "BIN", url: "#", desc: "Pre-compiled binary for ESP32-S3 N8R2" },
      { name: "Enclosure_v2.stl", size: "2.1MB", fmt: "STL", url: "#", desc: "3D printable ABS enclosure, 0.2mm layer height" }
    ]
  },
  {
    id: 2,
    title: "VLSI Cache Controller",
    slug: "vlsi-cache-controller",
    authorId: "user-3",
    author: "sarah_circuits",
    authorAvatar: "https://i.pravatar.cc/150?u=user3",
    description: "Synthesizable L2 cache controller in SystemVerilog with configurable associativity (2/4/8-way), LRU/LPLRU replacement, and MESI coherence protocol. Verified on Xilinx Artix-7 FPGA at 150MHz.",
    image: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=900&q=80",
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
    version: "v2.0.1",
    license: "Apache-2.0",
    githubUrl: "https://github.com/sarah_circuits/vlsi-cache-controller",
    prerequisites: ["SystemVerilog fundamentals", "Cache architecture knowledge (direct-mapped, set-associative)", "Vivado 2023.1 or ModelSim"],
    tools: ["Xilinx Vivado 2023.1", "ModelSim-Intel 2021.2", "GTKWave"],
    objectives: ["Implement 4-way set-associative L2 cache with LRU replacement", "Achieve <5% miss rate on SPEC CPU2017 traces", "Synthesize to Artix-7 at ≥150MHz"],
    designDecisions: [
      { q: "LRU vs LPLRU?", a: "LPLRU (Low Power LRU) reduces toggle activity in aging bits by ~40% — critical for TSMC 28nm leakage budget." },
      { q: "Why MESI coherence?", a: "Required for multi-core simulation. MESI eliminates false sharing in shared-memory workloads." }
    ],
    bom: [
      { name: "Xilinx Artix-7 XC7A35T-1CPG236C", category: "FPGA", qty: 1, price: "₹2800", supplier: "Mouser", link: "https://www.mouser.in/ProductDetail/Xilinx" },
      { name: "Digilent Arty A7-35T Board", category: "Dev Board", qty: 1, price: "₹8500", supplier: "Digilent", link: "https://digilent.com/shop/arty-a7-35t/" }
    ],
    codeFiles: [
      {
        id: "1", name: "cache_controller.sv", language: "verilog",
        content: "module cache_controller #(\n    parameter WAYS    = 4,\n    parameter SETS    = 256,\n    parameter LINE_SZ = 64\n) (\n    input  logic        clk, rst_n,\n    input  logic [31:0] addr,\n    input  logic        rd_en, wr_en,\n    input  logic [31:0] wr_data,\n    output logic [31:0] rd_data,\n    output logic        hit, miss\n);\n    logic [21:0] tag_array  [SETS][WAYS];\n    logic [31:0] data_array [SETS][WAYS][LINE_SZ/4];\n    logic        valid      [SETS][WAYS];\n    logic [2:0]  lru_bits   [SETS];\n    // ... LRU replacement and MESI state machine\nendmodule"
      },
      {
        id: "2", name: "tb_cache.sv", language: "verilog",
        content: "module tb_cache;\n    logic clk = 0, rst_n = 0;\n    logic [31:0] addr, rd_data, wr_data;\n    logic rd_en, wr_en, hit, miss;\n\n    cache_controller #(.WAYS(4),.SETS(256)) dut(\n        .clk(clk), .rst_n(rst_n),\n        .addr(addr), .rd_en(rd_en), .wr_en(wr_en),\n        .wr_data(wr_data), .rd_data(rd_data),\n        .hit(hit), .miss(miss)\n    );\n\n    always #5 clk = ~clk;\n    initial begin\n        rst_n = 0; #20; rst_n = 1;\n        for (int i=0; i<256; i++) begin\n            addr = i*4; rd_en = 1; #10;\n        end\n        $finish;\n    end\nendmodule"
      }
    ],
    testSuite: [
      { name: "Cold Miss Sequence", file: "tb/tb_cache.sv", status: "pass", ms: "2", desc: "256 sequential reads — all cold misses as expected" },
      { name: "LRU Eviction", file: "tb/tb_lru.sv", status: "pass", ms: "5", desc: "Access pattern forces LRU eviction, verifies oldest way replaced" },
      { name: "MESI State Transitions", file: "tb/tb_mesi.sv", status: "pass", ms: "8", desc: "All 12 state transitions verified against MESI protocol table" }
    ],
    buildInstructions: [
      { step: "Simulate", cmd: "vsim -do run.do tb_cache", note: "Runs 10k cycle regression in ModelSim" },
      { step: "Synthesize", cmd: "vivado -mode tcl -source synth.tcl", note: "Targets Artix-7 XC7A35T" },
      { step: "Timing Report", cmd: "report_timing_summary -file timing.rpt", note: "Should show positive slack at 150MHz" }
    ],
    downloads: [
      { name: "CacheCtrl_RTL_v2.0.1.zip", size: "48KB", fmt: "ZIP", url: "#", desc: "Full SystemVerilog RTL + testbench" },
      { name: "Synthesis_Report_Artix7.pdf", size: "220KB", fmt: "PDF", url: "#", desc: "Vivado synthesis and timing report" }
    ]
  },
  {
    id: 3,
    title: "Autonomous Quadcopter Nav Stack",
    slug: "autonomous-quadcopter",
    authorId: "user-4",
    author: "drone_guy",
    authorAvatar: "https://i.pravatar.cc/150?u=user4",
    description: "Full ROS2 Humble navigation stack for quadcopters. Features ORB-SLAM3 visual-inertial odometry, EGO-Planner trajectory optimization, and PX4-based flight controller integration. Tested on DJI F450 frame.",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=80",
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
    version: "v1.0.3",
    license: "GPL-3.0",
    githubUrl: "https://github.com/drone_guy/autonomous-quadcopter",
    prerequisites: ["ROS2 Humble on Ubuntu 22.04", "PX4 Autopilot v1.13+", "Python 3.10+", "OpenCV 4.8"],
    tools: ["QGroundControl", "RViz2", "Gazebo Garden (simulation)"],
    objectives: ["Achieve GPS-denied indoor navigation using VIO", "Avoid dynamic obstacles in real-time at 30Hz", "Navigate 5-waypoint mission autonomously"],
    designDecisions: [
      { q: "ORB-SLAM3 vs VINS-Mono?", a: "ORB-SLAM3 supports multi-session mapping and IMU initialization recovery — essential for real-world re-localisation after signal loss." },
      { q: "EGO-Planner for trajectory?", a: "EGO-Planner generates dynamically feasible jerk-minimized trajectories in <2ms on Jetson Nano, outperforming CHOMP and TEB planners." }
    ],
    bom: [
      { name: "DJI F450 Frame Kit", category: "Frame", qty: 1, price: "₹2200", supplier: "RoboticsBD", link: "#" },
      { name: "Pixhawk 6C Flight Controller", category: "Flight Controller", qty: 1, price: "₹18000", supplier: "Holybro", link: "https://holybro.com/products/pixhawk-6c" },
      { name: "Intel RealSense D435i", category: "Camera+IMU", qty: 1, price: "₹22000", supplier: "Intel", link: "https://www.intelrealsense.com/depth-camera-d435i/" },
      { name: "NVIDIA Jetson Nano 4GB", category: "Companion Computer", qty: 1, price: "₹9500", supplier: "Arrow", link: "#" },
      { name: "T-Motor MN3110 KV780", category: "Motor", qty: 4, price: "₹1800", supplier: "T-Motor", link: "#" }
    ],
    codeFiles: [
      {
        id: "1", name: "vio_node.py", language: "python",
        content: "#!/usr/bin/env python3\nimport rclpy\nfrom rclpy.node import Node\nfrom nav_msgs.msg import Odometry\nfrom sensor_msgs.msg import Image, Imu\nfrom message_filters import ApproximateTimeSynchronizer, Subscriber\n\nclass VIONode(Node):\n    def __init__(self):\n        super().__init__('vio_node')\n        self.odom_pub = self.create_publisher(Odometry, '/vio/odom', 10)\n        img_sub = Subscriber(self, Image, '/camera/color/image_raw')\n        imu_sub = Subscriber(self, Imu, '/camera/imu')\n        sync = ApproximateTimeSynchronizer([img_sub, imu_sub], 10, 0.05)\n        sync.registerCallback(self.slam_callback)\n        self.get_logger().info('VIO Node initialized — waiting for camera...')\n\n    def slam_callback(self, img_msg, imu_msg):\n        pass\n\ndef main():\n    rclpy.init()\n    node = VIONode()\n    rclpy.spin(node)\n\nif __name__ == '__main__':\n    main()"
      }
    ],
    buildInstructions: [
      { step: "Install ROS2", cmd: "sudo apt install ros-humble-desktop", note: "Ubuntu 22.04 LTS only" },
      { step: "Build workspace", cmd: "colcon build --symlink-install", note: "First build takes ~8min" },
      { step: "Launch simulation", cmd: "ros2 launch quadcopter_nav gazebo_sim.launch.py", note: "Opens Gazebo + RViz2" }
    ],
    testSuite: [
      { name: "VIO Drift Test", file: "test/test_vio_drift.py", status: "pass", ms: "12000", desc: "100m loop closure — drift <0.8% of distance" },
      { name: "Obstacle Avoidance", file: "test/test_avoid.py", status: "pass", ms: "45", desc: "3 dynamic obstacles injected — all avoided successfully" }
    ],
    downloads: [
      { name: "QuadNav_ROS2_v1.0.3.tar.gz", size: "18MB", fmt: "TAR.GZ", url: "#", desc: "Full ROS2 workspace with launch files" },
      { name: "Gazebo_World_Lab.zip", size: "5MB", fmt: "ZIP", url: "#", desc: "Indoor simulation environment with obstacles" }
    ]
  },
  {
    id: 4,
    title: "Graph Neural Network Recommender",
    slug: "gnn-recommendations",
    authorId: "user-5",
    author: "ai_alex",
    authorAvatar: "https://i.pravatar.cc/150?u=user5",
    description: "GCN-based collaborative filtering for large-scale social recommendation. Implements LightGCN + NGCF architectures with PyTorch Geometric. Achieves NDCG@20=0.412 on Amazon-Book dataset — SOTA as of late 2025.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
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
    version: "v3.1.0",
    license: "MIT",
    githubUrl: "https://github.com/ai_alex/gnn-recommendations",
    prerequisites: ["Python 3.10+", "PyTorch 2.1+ with CUDA 11.8", "PyTorch Geometric 2.4+", "8GB+ VRAM GPU"],
    tools: ["Weights & Biases (experiment tracking)", "Jupyter Lab", "NVIDIA Nsight (profiling)"],
    objectives: ["Train LightGCN on OGB-dataset in <30min on A100", "Achieve NDCG@20 > 0.40 on Amazon-Book", "Support real-time inference <10ms per user"],
    designDecisions: [
      { q: "LightGCN vs NGCF?", a: "LightGCN removes feature transformation and non-linear activation — simplicity improves performance by 16% on Amazon-Book." },
      { q: "Mini-batch vs full-graph training?", a: "Full-graph training is infeasible on 10M+ node graphs. Mini-batch GraphSAGE sampling with 2-hop neighborhood used instead." }
    ],
    bom: [
      { name: "NVIDIA A100 80GB (cloud)", category: "Compute", qty: 1, price: "$3.20/hr", supplier: "AWS p4d", link: "https://aws.amazon.com/ec2/instance-types/p4/" },
      { name: "Amazon-Book Dataset", category: "Dataset", qty: 1, price: "Free", supplier: "OGB", link: "https://ogb.stanford.edu" }
    ],
    codeFiles: [
      {
        id: "1", name: "model.py", language: "python",
        content: "import torch\nimport torch.nn.functional as F\nfrom torch_geometric.nn import LGConv\n\nclass LightGCN(torch.nn.Module):\n    def __init__(self, num_users, num_items, embed_dim=64, n_layers=3):\n        super().__init__()\n        self.embed_dim = embed_dim\n        self.n_layers = n_layers\n        self.user_emb = torch.nn.Embedding(num_users, embed_dim)\n        self.item_emb = torch.nn.Embedding(num_items, embed_dim)\n        self.convs = torch.nn.ModuleList([LGConv() for _ in range(n_layers)])\n        torch.nn.init.xavier_uniform_(self.user_emb.weight)\n        torch.nn.init.xavier_uniform_(self.item_emb.weight)\n\n    def forward(self, edge_index, users, items):\n        x = torch.cat([self.user_emb.weight, self.item_emb.weight])\n        embs = [x]\n        for conv in self.convs:\n            x = conv(x, edge_index)\n            embs.append(x)\n        final = torch.stack(embs, dim=1).mean(dim=1)\n        u_final = final[users]\n        i_final = final[items]\n        return (u_final * i_final).sum(dim=-1)\n\n    @torch.no_grad()\n    def recommend(self, user_ids, k=20):\n        all_items = self.item_emb.weight\n        user_vecs = self.user_emb(user_ids)\n        scores = user_vecs @ all_items.T\n        return scores.topk(k).indices"
      },
      {
        id: "2", name: "train.py", language: "python",
        content: "import wandb\nfrom model import LightGCN\nfrom data import load_amazon_book\n\ndef train():\n    wandb.init(project='gnn-rec', config={'lr': 1e-3, 'embed_dim': 64, 'layers': 3})\n    data = load_amazon_book()\n    model = LightGCN(data.num_users, data.num_items).cuda()\n    opt = torch.optim.Adam(model.parameters(), lr=1e-3, weight_decay=1e-5)\n\n    for epoch in range(1000):\n        model.train()\n        loss = bpr_loss(model, data.train_edge_index, data.neg_samples)\n        opt.zero_grad(); loss.backward(); opt.step()\n        if epoch % 10 == 0:\n            ndcg = evaluate_ndcg(model, data, k=20)\n            wandb.log({'loss': loss.item(), 'NDCG@20': ndcg})\n            print(f'Epoch {epoch}: Loss={loss:.4f} NDCG@20={ndcg:.4f}')\n\nif __name__ == '__main__':\n    train()"
      }
    ],
    buildInstructions: [
      { step: "Install deps", cmd: "pip install torch==2.1.0 torch-geometric==2.4.0 wandb ogb", note: "CUDA 11.8 build" },
      { step: "Download data", cmd: "python data.py --dataset amazon-book", note: "Downloads ~2GB, takes 5min" },
      { step: "Train", cmd: "python train.py --layers 3 --embed-dim 64 --epochs 1000", note: "~25min on A100" }
    ],
    testSuite: [
      { name: "Forward Pass Shape", file: "tests/test_model.py", status: "pass", ms: "340", desc: "Verifies output shape for batch of 1024 user-item pairs" },
      { name: "NDCG@20 Regression", file: "tests/test_metrics.py", status: "pass", ms: "8200", desc: "Full eval on test split — asserts NDCG@20 >= 0.40" }
    ],
    downloads: [
      { name: "LightGCN_pretrained_amazon.pt", size: "24MB", fmt: "PT", url: "#", desc: "Pre-trained weights on Amazon-Book dataset" },
      { name: "GNN_Rec_Notebook.ipynb", size: "1.8MB", fmt: "IPYNB", url: "#", desc: "Full training and evaluation notebook with plots" }
    ]
  },
  {
    id: 5,
    title: "Neural Engine Accelerator ASIC",
    slug: "neural-engine-asic",
    authorId: "user-2",
    author: "tech_wizard",
    authorAvatar: "https://i.pravatar.cc/150?u=user2",
    description: "Custom 8x8 systolic array ASIC for INT8 transformer inference. 512 MAC units at 500MHz, 2MB on-chip SRAM, 45 TOPS/W efficiency. RTL in Verilog, verified with UVM, synthesized with Synopsys Design Compiler on GF 12nm.",
    image: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=900&q=80",
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
    version: "v0.9.0-tape-out",
    license: "MIT",
    githubUrl: "https://github.com/tech_wizard/neural-engine-asic",
    prerequisites: ["Verilog/SystemVerilog proficiency", "UVM testbench experience", "Synopsys DC or Cadence Genus access"],
    tools: ["Synopsys Design Compiler 2022.03", "Synopsys VCS + Verdi", "Cadence Innovus (P&R)"],
    objectives: ["Implement 8x8 systolic array for matrix-multiply", "Achieve 45 TOPS/W at INT8 on GF 12nm", "Full UVM verification at block and chip level"],
    designDecisions: [
      { q: "Weight-stationary vs output-stationary?", a: "Output-stationary systolic array reduces SRAM bandwidth by 4x since partial sums accumulate in-register." },
      { q: "INT8 vs FP16?", a: "INT8 quantisation gives 4x throughput vs FP16 with <0.5% accuracy loss on BERT-base — validated against PyTorch QAT baseline." }
    ],
    codeFiles: [
      {
        id: "1", name: "systolic_array.v", language: "verilog",
        content: "module systolic_array #(\n    parameter N = 8,\n    parameter W = 8\n)(\n    input  wire         clk, rst_n,\n    input  wire [W-1:0] a_row [N],\n    input  wire [W-1:0] b_col [N],\n    output reg  [31:0]  c_out [N][N]\n);\n    wire [31:0] pe_out [N+1][N+1];\n    assign pe_out[0] = '{N+1{32'b0}};\n\n    genvar i, j;\n    generate\n        for (i=0; i<N; i++) begin : row\n            for (j=0; j<N; j++) begin : col\n                PE u_pe (.clk(clk), .rst_n(rst_n),\n                         .a_in(a_row[i]), .b_in(b_col[j]),\n                         .c_in(pe_out[i][j]),\n                         .c_out(pe_out[i+1][j+1]));\n            end\n        end\n    endgenerate\nendmodule"
      }
    ],
    downloads: [
      { name: "NeuralEngine_RTL_v0.9.zip", size: "120KB", fmt: "ZIP", url: "#", desc: "Full Verilog RTL, UVM testbench, and synthesis scripts" },
      { name: "DC_SynthReport_GF12nm.pdf", size: "890KB", fmt: "PDF", url: "#", desc: "Synopsys DC synthesis report — area, timing, power" }
    ]
  },
  {
    id: 6,
    title: "LoRa Mesh Network",
    slug: "lora-mesh-network",
    authorId: "user-3",
    author: "sarah_circuits",
    authorAvatar: "https://i.pravatar.cc/150?u=user3",
    description: "Self-healing LoRa mesh using SX1276 transceivers and AODV routing on STM32L072. 30km line-of-sight field-tested in Rajasthan. <500ms end-to-end latency across 12 hops. Ideal for disaster-relief and remote sensor networks.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
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
    version: "v2.1.0",
    license: "MIT",
    githubUrl: "https://github.com/sarah_circuits/lora-mesh-network",
    prerequisites: ["Basic RF/LoRa knowledge", "STM32 HAL familiarity", "Python 3.9+ for gateway dashboard"],
    tools: ["STM32CubeIDE v1.13", "GNU Arm Embedded Toolchain", "RTL-SDR (for RF debugging)"],
    objectives: ["Self-heal network topology on node failure in <3s", "Achieve 30km range on 868MHz with +14dBm TX", "End-to-end latency <500ms across 12 hops"],
    designDecisions: [
      { q: "AODV vs OLSR routing?", a: "AODV is reactive — routes are built on demand, reducing idle transmission by 70% compared to proactive OLSR on battery nodes." },
      { q: "STM32L072 over ESP32?", a: "STM32L072 draws 1.4mA in run mode vs ESP32's 80mA — critical for solar-battery nodes lasting 6+ months." }
    ],
    bom: [
      { name: "Ra-02 LoRa SX1276 Module", category: "RF Module", qty: 6, price: "₹420", supplier: "AliExpress", link: "#" },
      { name: "STM32L072CZ MCU", category: "Microcontroller", qty: 6, price: "₹380", supplier: "Mouser", link: "#" },
      { name: "18650 LiPo + TP4056 Charger", category: "Power", qty: 6, price: "₹180", supplier: "Robu", link: "#" },
      { name: "5.5dBi 868MHz Antenna", category: "Antenna", qty: 6, price: "₹350", supplier: "RF Solutions", link: "#" }
    ],
    codeFiles: [
      {
        id: "1", name: "aodv_router.c", language: "c",
        content: "#include \"aodv.h\"\n#include \"lora.h\"\n\n#define MAX_ROUTES 32\n#define ROUTE_TIMEOUT_MS 30000\n\ntypedef struct {\n    uint8_t  dest;\n    uint8_t  next_hop;\n    uint8_t  hop_count;\n    uint32_t last_seen;\n} RouteEntry;\n\nstatic RouteEntry table[MAX_ROUTES];\nstatic uint8_t    table_len = 0;\n\nvoid aodv_send(uint8_t dest, uint8_t *data, uint8_t len) {\n    RouteEntry *r = aodv_lookup(dest);\n    if (!r) {\n        aodv_rreq_broadcast(dest);\n        r = aodv_wait_rrep(dest, 2000);\n    }\n    if (r) lora_send_to(r->next_hop, data, len);\n}\n\nvoid aodv_on_rx(LoRaPacket *pkt) {\n    if (pkt->type == PKT_RREQ) aodv_handle_rreq(pkt);\n    else if (pkt->type == PKT_RREP) aodv_handle_rrep(pkt);\n    else if (pkt->dest == NODE_ID) app_receive(pkt->data, pkt->len);\n    else aodv_forward(pkt);\n}"
      }
    ],
    testSuite: [
      { name: "Route Discovery Latency", file: "test/test_aodv.c", status: "pass", ms: "2800", desc: "Cold-start route discovery across 8 hops — avg 2.3s" },
      { name: "Self-Heal on Node Failure", file: "test/test_heal.c", status: "pass", ms: "2900", desc: "Kills node 4 mid-transmission, verifies alternate route in <3s" },
      { name: "Range Field Test", file: "test/field_report.md", status: "pass", ms: "N/A", desc: "30.4km achieved in Jaisalmer desert, RSSI=-108dBm" }
    ],
    downloads: [
      { name: "LoRaMesh_Firmware_v2.1.zip", size: "340KB", fmt: "ZIP", url: "#", desc: "STM32 firmware + Python gateway dashboard" },
      { name: "PCB_Gerbers_Node_v2.zip", size: "1.1MB", fmt: "ZIP", url: "#", desc: "2-layer PCB for solar-powered mesh node" },
      { name: "Field_Test_Report_Rajasthan.pdf", size: "3.4MB", fmt: "PDF", url: "#", desc: "30km range test with RSSI plots and GPS track" }
    ]
  },
  {
    id: 7,
    title: "Real-Time OS Kernel for ARM",
    slug: "rtos-arm-kernel",
    authorId: "user-1",
    author: "bhavya_dev",
    authorAvatar: "https://i.pravatar.cc/150?u=user1",
    description: "A preemptive, priority-based RTOS kernel for ARM Cortex-M4 with cooperative round-robin scheduling, inter-task communication, and a custom heap allocator.",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=900&q=80",
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
    description: "Pneumatically actuated bellows-type soft gripper. Handles objects 10–500g without feedback control. Molds 3D-printed in Bambu Lab X1C at 0.12mm resolution using Smooth-Sil 950 platinum silicone. ROS-compatible gripper node included.",
    image: "https://images.unsplash.com/photo-1561144257-e32e8506afe4?auto=format&fit=crop&w=900&q=80",
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
    version: "v1.1.0",
    license: "CC BY-SA 4.0",
    githubUrl: "https://github.com/drone_guy/soft-robotic-gripper",
    prerequisites: ["3D printing experience", "ROS Noetic or Humble", "Access to silicone casting materials"],
    tools: ["Bambu Lab X1C (or Prusa MK4)", "Vacuum degassing chamber", "Air compressor (6 bar max)"],
    objectives: ["Grasp objects 10–500g without rigid skeleton", "Actuate at 1.5 bar with 3W pneumatic pump", "Integrate with ROS as MoveIt-compatible gripper"],
    designDecisions: [
      { q: "Bellows vs PneuNets?", a: "Bellows actuators produce 3x more tip force than PneuNets at same pressure — better for picking objects >200g." },
      { q: "Smooth-Sil 950 over Dragon Skin?", a: "Smooth-Sil 950 has Shore A hardness 50 — ideal balance between flexibility and tear resistance for 10k+ cycle life." }
    ],
    bom: [
      { name: "Smooth-Sil 950 Silicone (Part A+B)", category: "Material", qty: 1, price: "₹3200", supplier: "Smooth-On", link: "https://www.smooth-on.com/products/smooth-sil-950/" },
      { name: "PETG Filament 1kg", category: "Material", qty: 1, price: "₹1200", supplier: "Bambu Lab", link: "#" },
      { name: "CJMCU-758 Pressure Sensor", category: "Sensor", qty: 3, price: "₹280", supplier: "AliExpress", link: "#" },
      { name: "2-Way Mini Solenoid Valve 1/8\"", category: "Pneumatics", qty: 3, price: "₹650", supplier: "RS Components", link: "#" },
      { name: "12V Mini Air Pump 10LPM", category: "Pneumatics", qty: 1, price: "₹1800", supplier: "Amazon", link: "#" }
    ],
    codeFiles: [
      {
        id: "1", name: "gripper_node.py", language: "python",
        content: "#!/usr/bin/env python3\nimport rclpy\nfrom rclpy.node import Node\nfrom std_msgs.msg import Float32\nfrom RPi.GPIO import GPIO\n\nVALVE_PINS = [17, 27, 22]  # BCM pins for 3 fingers\n\nclass GripperNode(Node):\n    def __init__(self):\n        super().__init__('gripper_node')\n        GPIO.setmode(GPIO.BCM)\n        for p in VALVE_PINS: GPIO.setup(p, GPIO.OUT, initial=GPIO.LOW)\n        self.sub = self.create_subscription(Float32, '/gripper/pressure', self.on_cmd, 10)\n        self.get_logger().info('Gripper node ready.')\n\n    def on_cmd(self, msg):\n        # msg.data: 0.0=release, 1.0=full grip\n        state = msg.data > 0.5\n        for p in VALVE_PINS: GPIO.output(p, state)\n\ndef main():\n    rclpy.init()\n    rclpy.spin(GripperNode())\n\nif __name__ == '__main__':\n    main()"
      }
    ],
    downloads: [
      { name: "SoftGripper_Molds_v1.1.zip", size: "28MB", fmt: "ZIP", url: "#", desc: "STEP + STL mold files for Bambu Lab / Prusa" },
      { name: "ROS2_Gripper_Package.tar.gz", size: "4MB", fmt: "TAR.GZ", url: "#", desc: "ROS2 Humble gripper control package" }
    ]
  },
  {
    id: 9,
    title: "Diffusion Model from Scratch",
    slug: "diffusion-model-scratch",
    authorId: "user-5",
    author: "ai_alex",
    authorAvatar: "https://i.pravatar.cc/150?u=user5",
    description: "Clean annotated PyTorch implementation of DDPM and DDIM from first principles. No Diffusers library dependency. Trains on CelebA-HQ 256x256 in 4h on single A100. FID=8.1 on CIFAR-10, matching original DDPM paper results.",
    image: "https://images.unsplash.com/photo-1686191128892-3b37add4c844?auto=format&fit=crop&w=900&q=80",
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
    version: "v2.0.0",
    license: "MIT",
    githubUrl: "https://github.com/ai_alex/diffusion-model-scratch",
    prerequisites: ["PyTorch 2.0+ with CUDA", "Deep learning fundamentals (U-Net, attention)", "16GB+ VRAM for CelebA-HQ training"],
    tools: ["Weights & Biases", "Jupyter Lab", "NVIDIA Nsight Compute"],
    objectives: ["Match DDPM paper FID of 8.2 on CIFAR-10", "Implement DDIM for 50-step fast sampling", "Full training loop in <500 lines of pure PyTorch"],
    designDecisions: [
      { q: "Cosine vs linear noise schedule?", a: "Cosine schedule (Improved DDPM) gives FID 8.1 vs 11.9 for linear — keeps signal-to-noise ratio better at small timesteps." },
      { q: "Why no Diffusers dependency?", a: "Educational clarity — every operation is explicit. Users can trace the math from the paper to the code line by line." }
    ],
    codeFiles: [
      {
        id: "1", name: "ddpm.py", language: "python",
        content: "import torch\nimport torch.nn.functional as F\nfrom unet import UNet\n\nclass DDPM:\n    def __init__(self, model: UNet, timesteps=1000, beta_schedule='cosine'):\n        self.model = model\n        self.T = timesteps\n        betas = self._cosine_schedule(timesteps)\n        alphas = 1.0 - betas\n        self.alpha_bar = torch.cumprod(alphas, dim=0)  # ᾱ_t\n\n    def _cosine_schedule(self, T, s=0.008):\n        steps = torch.arange(T + 1, dtype=torch.float64)\n        f = torch.cos((steps / T + s) / (1 + s) * torch.pi / 2) ** 2\n        alphas_bar = f / f[0]\n        return torch.clamp(1 - alphas_bar[1:] / alphas_bar[:-1], 0, 0.999)\n\n    def q_sample(self, x0, t, noise=None):\n        '''Forward diffusion: add noise to x0 at timestep t'''\n        if noise is None: noise = torch.randn_like(x0)\n        ab = self.alpha_bar[t].view(-1,1,1,1)\n        return ab.sqrt() * x0 + (1-ab).sqrt() * noise, noise\n\n    def p_loss(self, x0, t):\n        '''Training loss: predict added noise'''\n        x_noisy, noise = self.q_sample(x0, t)\n        pred_noise = self.model(x_noisy, t)\n        return F.mse_loss(pred_noise, noise)\n\n    @torch.no_grad()\n    def p_sample(self, x_t, t):\n        '''Reverse step: denoise from x_t to x_{t-1}'''\n        beta_t = 1 - self.alpha_bar[t] / (self.alpha_bar[t-1] if t>0 else torch.tensor(1.0))\n        pred_noise = self.model(x_t, torch.tensor([t]))\n        x0_pred = (x_t - (1-self.alpha_bar[t]).sqrt() * pred_noise) / self.alpha_bar[t].sqrt()\n        mean = x0_pred * self.alpha_bar[t-1].sqrt() * beta_t / (1-self.alpha_bar[t]) + \\\n               x_t * (1-self.alpha_bar[t-1]) * (1-beta_t).sqrt() / (1-self.alpha_bar[t])\n        return mean + beta_t.sqrt() * torch.randn_like(x_t) if t > 0 else mean\n\n    @torch.no_grad()\n    def sample(self, shape):\n        x = torch.randn(shape).cuda()\n        for t in reversed(range(self.T)):\n            x = self.p_sample(x, t)\n        return x.clamp(-1, 1)"
      }
    ],
    testSuite: [
      { name: "FID Score CIFAR-10", file: "eval/fid.py", status: "pass", ms: "180000", desc: "50k samples evaluated — FID=8.1 matching paper" },
      { name: "DDIM 50-step sampling", file: "eval/ddim_speed.py", status: "pass", ms: "4200", desc: "50-step DDIM generates 64 images in 4.2s on A100 vs 6min for DDPM" }
    ],
    downloads: [
      { name: "DDPM_pretrained_celeba256.pt", size: "890MB", fmt: "PT", url: "#", desc: "Pre-trained DDPM weights on CelebA-HQ 256x256" },
      { name: "Diffusion_From_Scratch.ipynb", size: "3.2MB", fmt: "IPYNB", url: "#", desc: "Step-by-step educational notebook with all math" }
    ]
  },
  {
    id: 10,
    title: "Open-Source Oscilloscope",
    slug: "open-source-oscilloscope",
    authorId: "user-1",
    author: "bhavya_dev",
    authorAvatar: "https://i.pravatar.cc/150?u=user1",
    description: "2-channel 10MSPS oscilloscope on STM32H750 with 4-inch TFT display. FFT mode up to 5MHz, 1MΩ input impedance, USB scope mode via Python PyUSB companion app. Fully open-source hardware + firmware. BOM under ₹2500.",
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=900&q=80",
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
    version: "v3.0.0",
    license: "CERN-OHL-S-2.0",
    githubUrl: "https://github.com/bhavya_dev/open-source-oscilloscope",
    prerequisites: ["STM32 HAL/LL driver experience", "Basic analog design (op-amps, ADC front-end)", "Python 3.10+ for companion app"],
    tools: ["STM32CubeIDE v1.13", "KiCad 7 (hardware)", "Python + PyUSB + Matplotlib"],
    objectives: ["10MSPS dual-channel sampling with 8-bit ADC", "FFT display up to 5MHz", "USB data export at 5MB/s to Python companion app"],
    designDecisions: [
      { q: "STM32H750 over H743?", a: "H750 has 2MB DTCM RAM vs H743's 512KB — critical for DMA ping-pong buffers at 10MSPS without data loss." },
      { q: "Op-amp input stage?", a: "OPA354 rail-to-rail op-amp with 200MHz GBW product handles 5MHz signals with <0.5dB flatness across gain settings." }
    ],
    bom: [
      { name: "STM32H750VBT6", category: "Microcontroller", qty: 1, price: "₹480", supplier: "Mouser", link: "https://www.mouser.in" },
      { name: "4.0\" ILI9341 TFT SPI 320x240", category: "Display", qty: 1, price: "₹380", supplier: "Robu", link: "https://robu.in" },
      { name: "OPA354AIDBVR Op-Amp", category: "Analog Front-End", qty: 2, price: "₹95", supplier: "Mouser", link: "#" },
      { name: "STM32H7_ADC 12-bit 5MSPS", category: "ADC", qty: 1, price: "Built-in", supplier: "N/A", link: "#" },
      { name: "BNC Connectors", category: "Connector", qty: 2, price: "₹120", supplier: "Amazon", link: "#" },
      { name: "1MΩ 1% Resistors 0402", category: "Passive", qty: 4, price: "₹15", supplier: "Robu", link: "#" }
    ],
    codeFiles: [
      {
        id: "1", name: "scope_core.c", language: "c",
        content: "#include \"scope_core.h\"\n#include \"stm32h7xx_hal.h\"\n\n#define SAMPLE_BUF_SIZE 4096\n#define CHANNELS 2\n\nstatic uint16_t dma_buf[CHANNELS][SAMPLE_BUF_SIZE];\nstatic volatile uint8_t buf_ready = 0;\n\nvoid scope_start_capture(void) {\n    HAL_ADC_Start_DMA(&hadc1, (uint32_t*)dma_buf[0], SAMPLE_BUF_SIZE);\n    HAL_ADC_Start_DMA(&hadc3, (uint32_t*)dma_buf[1], SAMPLE_BUF_SIZE);\n}\n\nvoid HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef *hadc) {\n    if (hadc == &hadc1) buf_ready = 1;\n}\n\nvoid scope_render_waveform(uint16_t *buf, uint16_t color) {\n    for (int i = 1; i < SAMPLE_BUF_SIZE; i++) {\n        int y0 = 240 - (buf[i-1] * 240 / 4096);\n        int y1 = 240 - (buf[i]   * 240 / 4096);\n        tft_draw_line(i-1, y0, i, y1, color);\n    }\n}\n\nvoid scope_fft_display(void) {\n    arm_rfft_fast_instance_f32 fft;\n    arm_rfft_fast_init_f32(&fft, SAMPLE_BUF_SIZE);\n    float32_t input[SAMPLE_BUF_SIZE], output[SAMPLE_BUF_SIZE];\n    for (int i=0; i<SAMPLE_BUF_SIZE; i++) input[i] = (float32_t)dma_buf[0][i];\n    arm_rfft_fast_f32(&fft, input, output, 0);\n    // Display magnitude spectrum on TFT\n    scope_render_spectrum(output, SAMPLE_BUF_SIZE/2, TFT_YELLOW);\n}"
      },
      {
        id: "2", name: "companion.py", language: "python",
        content: "import usb.core, usb.util\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport matplotlib.animation as animation\n\nVENDOR_ID  = 0x0483  # STMicroelectronics\nPRODUCT_ID = 0x5740  # Custom scope\n\ndef connect():\n    dev = usb.core.find(idVendor=VENDOR_ID, idProduct=PRODUCT_ID)\n    if dev is None: raise ValueError('Oscilloscope not found')\n    dev.set_configuration()\n    return dev\n\ndef read_frame(dev, samples=4096):\n    data = dev.read(0x81, samples * 2, timeout=1000)\n    return np.frombuffer(data, dtype=np.uint16) * 3.3 / 4096\n\nfig, ax = plt.subplots()\ndev = connect()\nline, = ax.plot([], [])\nax.set_ylim(0, 3.3); ax.set_xlabel('Sample'); ax.set_ylabel('Voltage (V)')\n\ndef update(frame):\n    y = read_frame(dev)\n    line.set_data(range(len(y)), y)\n    return line,\n\nani = animation.FuncAnimation(fig, update, interval=50, blit=True)\nplt.show()"
      }
    ],
    testSuite: [
      { name: "ADC Sampling Accuracy", file: "test/test_adc.c", status: "pass", ms: "200", desc: "1kHz sine input — frequency error <0.1%, THD <1%" },
      { name: "FFT Frequency Resolution", file: "test/test_fft.c", status: "pass", ms: "180", desc: "Bin resolution 2.44Hz at 10MSPS/4096 samples — verified" },
      { name: "USB Transfer Rate", file: "test/test_usb.py", status: "pass", ms: "5000", desc: "Sustained 5.2MB/s transfer to Python companion app" }
    ],
    downloads: [
      { name: "OpenScope_Gerbers_v3.zip", size: "2.1MB", fmt: "ZIP", url: "#", desc: "KiCad 7 Gerbers — 4-layer PCB for JLCPCB" },
      { name: "OpenScope_Firmware_v3.bin", size: "156KB", fmt: "BIN", url: "#", desc: "Pre-compiled STM32H750 firmware" },
      { name: "Python_Companion_App.zip", size: "18KB", fmt: "ZIP", url: "#", desc: "PyUSB + Matplotlib real-time companion application" },
      { name: "OpenScope_Schematic_v3.pdf", size: "1.8MB", fmt: "PDF", url: "#", desc: "Full annotated schematic PDF" }
    ]
  },
  {
    id: 11,
    title: "ESP32 Air Mouse with MPU6050",
    slug: "esp32-air-mouse-mpu6050",
    authorId: "user-1",
    author: "bhavya_dev",
    authorAvatar: "https://i.pravatar.cc/150?u=user1",
    description: "Wearable Bluetooth air mouse built with ESP32 and MPU6050 IMU. Tracks hand orientation in 3D space, applies sensor fusion, and exposes a standard HID mouse over Bluetooth to control a PC or smart TV.",
    image: "https://images.unsplash.com/photo-1601004890657-03e58aaf2570?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    categoryStyles: "bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-xl shadow-lg",
    level: "Intermediate",
    tags: ["ESP32", "MPU6050", "Bluetooth", "HID", "Wearable"],
    stars: 980,
    views: 5123,
    comments: 27,
    forks: 143,
    createdAt: "2026-02-24T18:00:00.000Z",
    status: "published",
    version: "v1.0.0",
    license: "MIT",
    githubUrl: "https://github.com/bhavya_dev/esp32-air-mouse",
    safetyNotice: "Low-voltage wearable. Insulate all solder joints. Use Li-ion cells with built-in protection PCB.",
    prerequisites: [
      "Basic Arduino / ESP-IDF familiarity",
      "Understanding of accelerometer and gyroscope axes",
      "Ability to solder header pins"
    ],
    tools: ["Fine-tip soldering iron", "3D printer (for enclosure, optional)", "Multimeter"],
    objectives: [
      "Use hand motions to move a mouse cursor in X–Y plane",
      "Implement click and drag gestures using hardware buttons",
      "Achieve smooth, low-latency pointer motion over Bluetooth HID"
    ],
    designDecisions: [
      { q: "Why ESP32 + Bluetooth HID instead of USB?", a: "Bluetooth HID lets the air mouse connect to laptops, TVs, and tablets wirelessly, without needing a USB dongle or cable." },
      { q: "Why MPU6050 IMU?", a: "MPU6050 integrates a 3-axis accelerometer and 3-axis gyro, is inexpensive, and has a mature Arduino ecosystem." }
    ],
    bom: [
      { name: "ESP32 DevKitC", category: "Microcontroller", qty: 1, price: "₹350", supplier: "Robu", link: "https://robu.in/product/esp32-devkitc-development-board/" },
      { name: "MPU6050 6-axis IMU Module", category: "Sensor", qty: 1, price: "₹180", supplier: "Robu", link: "https://robu.in/product/mpu6050-3-axis-gyroscope-accelerometer-module/" },
      { name: "TP4056 Li-ion Charger Module", category: "Power", qty: 1, price: "₹70", supplier: "Robu", link: "https://robu.in" },
      { name: "18650 Li-ion Cell 2200mAh", category: "Battery", qty: 1, price: "₹220", supplier: "Amazon", link: "#" },
      { name: "Tactile Push Button 6×6mm", category: "Input", qty: 3, price: "₹10", supplier: "Any", link: "#" }
    ],
    buildSteps: [
      { title: "Wire ESP32 and MPU6050", time: "20m", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", body: "Connect MPU6050 VCC→3V3, GND→GND, SCL→GPIO22, SDA→GPIO21. Keep I2C wires short and twisted to reduce noise." },
      { title: "Add Click Buttons and Power", time: "15m", imageUrl: "", body: "Wire two buttons to GPIOs with pull-downs for left/right click. Add TP4056 + 18650 cell for portable power." },
      { title: "Flash Firmware and Calibrate", time: "20m", imageUrl: "", body: "Upload firmware via Arduino IDE. Open serial monitor, keep device flat, press calibration button to zero pitch/roll offsets." }
    ],
    codeFiles: [
      {
        id: "air-mouse-main",
        name: "main.cpp",
        language: "cpp",
        content: "#include <BleMouse.h>\n#include <Wire.h>\n#include \"mpu6050.h\"\n\nBleMouse mouse(\"NetList Air Mouse\");\n\nvoid setup() {\n  Serial.begin(115200);\n  Wire.begin();\n  mpu_init();\n  mouse.begin();\n}\n\nvoid loop() {\n  if (!mouse.isConnected()) return;\n  float pitch, roll;\n  mpu_read_angles(pitch, roll);\n  int dx = (int)(roll * 3.0f);\n  int dy = (int)(-pitch * 3.0f);\n  mouse.move(dx, dy);\n  delay(10);\n}"
      }
    ],
    dependencies: [
      { name: "BleMouse", ver: "0.3.0", license: "MIT", desc: "Arduino BLE HID mouse library for ESP32." },
      { name: "MPU6050 Driver", ver: "1.0.0", license: "MIT", desc: "Minimal driver for reading raw accel/gyro and computing pitch/roll." }
    ],
    buildInstructions: [
      { step: "Clone", cmd: "git clone https://github.com/bhavya_dev/esp32-air-mouse", note: "Open in Arduino IDE or VS Code + PlatformIO." },
      { step: "Configure", cmd: "Copy config.example.h to config.h and adjust sensitivity constants.", note: "Tune gain values for your hand movement range." },
      { step: "Flash", cmd: "Upload to ESP32 DevKitC at 115200 baud.", note: "Press BOOT if your board requires it." }
    ],
    envSetup: [
      { title: "Arduino Toolchain", items: ["Arduino IDE 2.x or PlatformIO", "ESP32 board support installed", "BleMouse and MPU6050 libraries installed"] }
    ],
    testSuite: [
      { name: "Static Drift", file: "tests/drift.md", status: "pass", ms: "60000", desc: "Device held still for 60s; pointer stayed within 40px radius on 1080p monitor." },
      { name: "Latency Check", file: "tests/latency.md", status: "pass", ms: "15", desc: "Measured ~15ms motion-to-cursor latency using high-speed camera and LED marker." }
    ],
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1601004890657-03e58aaf2570?auto=format&fit=crop&w=600&q=80", caption: "ESP32 DevKitC with MPU6050 mounted on a small 3D-printed grip.", label: "Prototype" }
    ],
    simulations: [
      { title: "Gesture Debug Simulator", desc: "Simple visualizer that shows pitch and roll angles as bars while you move your hand.", url: "https://wokwi.com", icon: "🖱️", badge: "MPU6050" }
    ],
    downloads: [
      { name: "ESP32_AirMouse_Firmware_v1.0.bin", size: "96KB", fmt: "BIN", url: "#", desc: "Pre-compiled firmware for ESP32 DevKitC." },
      { name: "AirMouse_3D_Enclosure.stl", size: "1.8MB", fmt: "STL", url: "#", desc: "3D-printed shell for handheld grip and buttons." }
    ]
  },
  {
    id: 12,
    title: "ESP32 3D Orientation Simulator",
    slug: "esp32-3d-orientation-sim",
    authorId: "user-2",
    author: "tech_wizard",
    authorAvatar: "https://i.pravatar.cc/150?u=user2",
    description: "Wi-Fi-enabled ESP32 + MPU6050 board that streams real-time orientation to a browser, which renders a 3D model using Three.js. Perfect for visualizing IMU attitude and debugging robotics or aerospace projects.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    categoryStyles: "bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-xl shadow-lg",
    level: "Intermediate",
    tags: ["ESP32", "MPU6050", "3D", "Three.js", "Web"],
    stars: 1245,
    views: 6890,
    comments: 38,
    forks: 204,
    createdAt: "2026-03-01T10:30:00.000Z",
    status: "published",
    version: "v1.0.0",
    license: "MIT",
    githubUrl: "https://github.com/tech_wizard/esp32-3d-orientation",
    safetyNotice: "Mount the board securely when moving it quickly; avoid letting wired USB cables whip around during demonstrations.",
    prerequisites: [
      "Basic ESP32 + Wi-Fi knowledge",
      "Familiarity with HTML / JavaScript",
      "Understanding of yaw/pitch/roll"
    ],
    tools: ["ESP32 DevKitC or similar", "MPU6050 breakout", "Browser with WebGL (Chrome/Firefox)"],
    objectives: [
      "Render a live 3D model that tracks board orientation",
      "Update 3D view at ~30 FPS using server-sent events",
      "Display raw accelerometer and gyroscope readings alongside the model"
    ],
    designDecisions: [
      { q: "Why Three.js on the frontend?", a: "Three.js abstracts WebGL boilerplate and makes it easy to add lighting, materials, and camera controls for the 3D board model." },
      { q: "Why SSE instead of polling?", a: "Server-Sent Events push updates from ESP32 to the browser with less overhead than repeated HTTP polling." }
    ],
    bom: [
      { name: "ESP32 DevKitC", category: "Microcontroller", qty: 1, price: "₹350", supplier: "Robu", link: "https://robu.in" },
      { name: "MPU6050 IMU Breakout", category: "Sensor", qty: 1, price: "₹180", supplier: "Robu", link: "https://robu.in" }
    ],
    buildSteps: [
      { title: "Connect IMU to ESP32", time: "10m", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", body: "Wire MPU6050 to ESP32 over I2C (3V3, GND, SDA→GPIO21, SCL→GPIO22). Double-check axis orientation so the 3D model matches physical movement." },
      { title: "Flash Wi-Fi Web Server", time: "10m", imageUrl: "", body: "Flash the ESP32 firmware that exposes a web server on port 80 and streams IMU data to /events endpoint using SSE." },
      { title: "Open Browser Dashboard", time: "5m", imageUrl: "", body: "Connect your PC to the same Wi-Fi. Visit http://<esp32-ip>/ to see the live 3D cube and sensor readouts." }
    ],
    codeFiles: [
      {
        id: "esp32-3d-main",
        name: "main.cpp",
        language: "cpp",
        content: "#include <WiFi.h>\n#include <ESPAsyncWebServer.h>\n#include \"mpu6050.h\"\n#include \"web_assets.h\"\n\nAsyncWebServer server(80);\nAsyncEventSource events(\"/events\");\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.begin(WIFI_SSID, WIFI_PASS);\n  while (WiFi.status() != WL_CONNECTED) delay(200);\n  mpu_init();\n  server.on(\"/\", HTTP_GET, [](AsyncWebServerRequest *req){\n    req->send_P(200, \"text/html\", INDEX_HTML);\n  });\n  server.addHandler(&events);\n  server.begin();\n  Serial.println(WiFi.localIP());\n}\n\nvoid loop() {\n  static uint32_t last = 0;\n  if (millis() - last > 33) {\n    last = millis();\n    float yaw, pitch, roll;\n    mpu_read_ypr(yaw, pitch, roll);\n    char buf[128];\n    snprintf(buf, sizeof(buf), \"{\\\"yaw\\\":%.2f,\\\"pitch\\\":%.2f,\\\"roll\\\":%.2f}\", yaw, pitch, roll);\n    events.send(buf, \"orientation\");\n  }\n}"
      },
      {
        id: "esp32-3d-index",
        name: "index.html",
        language: "html",
        content: "<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\" />\n  <title>ESP32 3D Orientation</title>\n  <style>body{margin:0;background:#020617;color:#e5e7eb;font-family:system-ui;}#hud{position:absolute;top:10px;left:10px;font-size:13px;line-height:2;}canvas{display:block;}</style>\n  <script src=\"https://cdnjs.cloudflare.com/ajax/libs/three.js/r152/three.min.js\"></script>\n</head>\n<body>\n<div id=\"hud\">\n  Yaw: <span id=\"yaw\">0</span>°<br/>\n  Pitch: <span id=\"pitch\">0</span>°<br/>\n  Roll: <span id=\"roll\">0</span>°\n</div>\n<script>\n  const scene = new THREE.Scene();\n  const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100);\n  camera.position.z = 3;\n  const renderer = new THREE.WebGLRenderer({antialias:true});\n  renderer.setSize(innerWidth, innerHeight);\n  document.body.appendChild(renderer.domElement);\n  const geo = new THREE.BoxGeometry(2, 0.3, 1.2);\n  const mat = new THREE.MeshPhongMaterial({color:0x00e5ff, wireframe:false});\n  const cube = new THREE.Mesh(geo, mat);\n  scene.add(cube);\n  scene.add(new THREE.AmbientLight(0xffffff, 0.6));\n  const dl = new THREE.DirectionalLight(0xffffff, 0.8);\n  dl.position.set(5,5,5); scene.add(dl);\n  const source = new EventSource('/events');\n  source.addEventListener('orientation', (e) => {\n    const o = JSON.parse(e.data);\n    document.getElementById('yaw').textContent = o.yaw.toFixed(1);\n    document.getElementById('pitch').textContent = o.pitch.toFixed(1);\n    document.getElementById('roll').textContent = o.roll.toFixed(1);\n    cube.rotation.y = o.yaw * Math.PI / 180;\n    cube.rotation.x = o.pitch * Math.PI / 180;\n    cube.rotation.z = o.roll * Math.PI / 180;\n  });\n  (function animate(){ requestAnimationFrame(animate); renderer.render(scene, camera); })();\n</script>\n</body>\n</html>"
      }
    ],
    dependencies: [
      { name: "ESPAsyncWebServer", ver: "3.0.0", license: "LGPL-3.0", desc: "Async web server + SSE support for ESP32." },
      { name: "Three.js", ver: "r152", license: "MIT", desc: "3D rendering engine for the browser board model." }
    ],
    buildInstructions: [
      { step: "Configure Wi-Fi", cmd: "Edit config.h and set WIFI_SSID / WIFI_PASS.", note: "Switch to AP mode if you want the ESP32 to host its own network." },
      { step: "Upload Filesystem", cmd: "Upload web assets (index.html) to ESP32 LittleFS using the PlatformIO filesystem uploader.", note: "Or inline the HTML as a PROGMEM string in web_assets.h." },
      { step: "Flash & Open Browser", cmd: "Flash firmware, check Serial Monitor for IP, open http://<ip>/ in Chrome.", note: "Enable WebGL in browser if not already active." }
    ],
    envSetup: [
      { title: "Web Tooling", items: ["Modern browser with WebGL2 support", "VS Code + PlatformIO for flashing", "Node.js (optional) for asset bundling"] }
    ],
    testSuite: [
      { name: "Orientation Consistency", file: "tests/orientation.md", status: "pass", ms: "300000", desc: "Rotated board around each axis; browser values matched serial output within ±1°." },
      { name: "Update Rate", file: "tests/fps.md", status: "pass", ms: "10000", desc: "Sustained ~30 FPS SSE update rate confirmed in Chrome DevTools." }
    ],
    galleryImages: [
      { url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80", caption: "ESP32 + MPU6050 dev board used as a 3D orientation probe.", label: "Live Demo" }
    ],
    simulations: [
      { title: "Wokwi Orientation Demo", desc: "Simulate ESP32 + MPU6050 wiring in Wokwi and watch JSON orientation packets in the serial monitor.", url: "https://wokwi.com", icon: "🧪", badge: "Simulator" }
    ],
    downloads: [
      { name: "ESP32_3D_Orientation_Firmware.bin", size: "128KB", fmt: "BIN", url: "#", desc: "Compiled firmware with Wi-Fi + SSE streaming." },
      { name: "Web_Dashboard_Files.zip", size: "35KB", fmt: "ZIP", url: "#", desc: "index.html + Three.js 3D dashboard source." }
    ]
  }
];
