import { Project } from "./projects";
import { BOMItem } from "./bom";

export interface BuildStep {
  step: number;
  title: string;
  description: string;
  image: string;
}

export interface ProjectDetail extends Omit<Project, 'bom' | 'buildSteps' | 'schematics' | 'downloads'> {
  fullDescription: string;
  bom: BOMItem[];
  schematics: string[];
  buildSteps: BuildStep[];
  codeSnippet: string;
  downloads: { name: string; url: string; size: string }[];
}

export const projectDetails: Record<number, ProjectDetail> = {

  1: {
    id: 1,
    title: "ESP32 Radar Intrusion System",
    slug: "esp32-radar-intrusion",
    authorId: "user-2",
    author: "@tech_wizard",
    authorAvatar: "https://i.pravatar.cc/150?u=user2",
    description: "Compact mmWave-based human presence detector using ESP32-S3 and LD2410C radar.",
    fullDescription: "This project uses the ESP32-S3 along with the HLK-LD2410C 24GHz mmWave radar sensor to create a highly sensitive occupancy detection system. Unlike PIR sensors, the LD2410C detects stationary human presence by measuring micro-Doppler signatures from breathing. It publishes MQTT alerts over Wi-Fi using FreeRTOS task scheduling, displays presence state on a 0.96\" OLED, and runs from a single 18650 cell. The custom 2-layer PCB fits in a 60Ã—40mm enclosure printed in ABS.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
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
    bom: [
      { id: "bom1-1", name: "ESP32-S3 WROOM-1 N8R2", partNumber: "ESP32-S3-WROOM-1", category: "Microcontroller", qty: 1, unit: "pcs", price: 450, supplier: "Mouser", buyLink: "https://www.mouser.in", notes: "4MB Flash, 2MB PSRAM", stock: "In Stock", mounting: "Module" },
      { id: "bom1-2", name: "HLK-LD2410C mmWave Radar", partNumber: "HLK-LD2410C", category: "Sensor", qty: 1, unit: "pcs", price: 520, supplier: "AliExpress", buyLink: "#", notes: "24GHz presence + motion detection", stock: "In Stock", mounting: "Module" },
      { id: "bom1-3", name: "AMS1117-3.3 LDO Regulator", partNumber: "AMS1117-3.3", category: "Power IC", qty: 2, unit: "pcs", price: 12, supplier: "Robu", buyLink: "https://robu.in", stock: "In Stock", mounting: "THT" },
      { id: "bom1-4", name: "0.96\" SSD1306 OLED I2C", partNumber: "SSD1306-096", category: "Display", qty: 1, unit: "pcs", price: 250, supplier: "Robu", buyLink: "https://robu.in", stock: "In Stock", mounting: "Module" },
      { id: "bom1-5", name: "100ÂµF 16V Electrolytic Cap", partNumber: "ECE-A1CN101", category: "Passive", qty: 4, unit: "pcs", price: 8, supplier: "Robu", buyLink: "#", stock: "In Stock", mounting: "THT" },
      { id: "bom1-6", name: "18650 Battery Holder", partNumber: "BH-18650", category: "Power", qty: 1, unit: "pcs", price: 60, supplier: "Robu", buyLink: "#", stock: "In Stock", mounting: "THT" },
      { id: "bom1-7", name: "Custom FR4 PCB 60Ã—40mm", partNumber: "NL-PCB-001", category: "PCB", qty: 1, unit: "pcs", price: 450, supplier: "JLCPCB", buyLink: "#", notes: "2-layer, HASL, 1.6mm", stock: "In Stock", mounting: "Module" },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601004890657-03e58aaf2570?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "PCB Fabrication", description: "Order PCB from JLCPCB using provided Gerbers. 2-layer FR4, 1.6mm, HASL finish. Takes 3â€“5 days to arrive. Inspect for shorts before assembly.", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "SMD Assembly", description: "Apply solder paste to pads. Place 0402 passives, AMS1117 regulator, and ESP32-S3 module. Reflow at 240Â°C peak. Inspect joints under magnification.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
      { step: 3, title: "Radar Module Wiring", description: "Connect LD2410C TXâ†’GPIO17, RXâ†’GPIO18. Power with 5V rail. Add 100ÂµF + 100nF decoupling on radar VCC pin.", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" },
      { step: 4, title: "Flash Firmware", description: "Clone repo. Copy config.h.example â†’ config.h. Fill WiFi SSID, password, MQTT broker IP. Run: idf.py -p /dev/ttyUSB0 flash monitor", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
      { step: 5, title: "Calibration", description: "Open serial monitor at 115200 baud. Type 'CAL'. Stand 1m from sensor for 10s. Threshold auto-sets based on environment noise floor.", image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `#include <WiFi.h>
#include <PubSubClient.h>
#include "RadarManager.h"

RadarManager radar(Serial2, 17, 18);
WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);

void mqttTask(void *pv) {
  while(1) {
    if (!mqtt.connected()) mqtt.connect("radar-node");
    RadarState s = radar.getState();
    String payload = "{\\"present\\":" + String(s.present ? "true" : "false") +
                     ",\\"distance\\":" + s.distance + "}";
    mqtt.publish("home/radar", payload.c_str());
    vTaskDelay(pdMS_TO_TICKS(500));
  }
}

void setup() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  radar.begin();
  mqtt.setServer(MQTT_HOST, 1883);
  xTaskCreate(mqttTask, "MQTT", 4096, NULL, 1, NULL);
}`,
    downloads: [
      { name: "ESP32_Radar_Gerbers_v1.2.zip", url: "#", size: "1.4 MB" },
      { name: "ESP32_Radar_Firmware_v1.2.bin", url: "#", size: "312 KB" },
      { name: "Enclosure_v2.stl", url: "#", size: "2.1 MB" }
    ]
  },

  2: {
    id: 2,
    title: "VLSI Cache Controller",
    slug: "vlsi-cache-controller",
    authorId: "user-3",
    author: "@sarah_circuits",
    authorAvatar: "https://i.pravatar.cc/150?u=user3",
    description: "Synthesizable L2 cache controller in SystemVerilog with configurable associativity, LRU replacement, and MESI coherence protocol.",
    fullDescription: "A fully synthesizable L2 cache controller written in SystemVerilog. Supports 2/4/8-way set associativity, configurable set count (64â€“512), and 64-byte cache lines. Implements both standard LRU and Low-Power LRU (LPLRU) replacement policies. MESI coherence protocol supports multi-core simulation. Verified on Xilinx Artix-7 FPGA at 150MHz with all 3 UVM regression suites passing. Area: 18,400 LUTs on XC7A35T.",
    image: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=800&q=80",
    category: "Hardware",
    categoryStyles: "bg-blue-100/90 dark:bg-blue-950/90 text-blue-800 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-xl shadow-lg",
    level: "Expert",
    tags: ["Verilog", "FPGA", "VLSI", "SystemVerilog", "MESI"],
    stars: 892,
    views: 2134,
    comments: 14,
    forks: 45,
    createdAt: "2026-01-20T11:30:00Z",
    status: "published",
    bom: [
      { id: "bom2-1", name: "Digilent Arty A7-35T FPGA Board", partNumber: "410-319", category: "FPGA Dev Board", qty: 1, unit: "pcs", price: 8500, supplier: "Digilent", buyLink: "https://digilent.com/shop/arty-a7-35t/", notes: "Xilinx Artix-7 XC7A35T", stock: "In Stock", mounting: "Module" },
      { id: "bom2-2", name: "USB-JTAG Programmer Cable", partNumber: "JTAG-USB", category: "Tool", qty: 1, unit: "pcs", price: 1200, supplier: "Mouser", buyLink: "#", stock: "In Stock", mounting: "Module" },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "Clone and Simulate", description: "Clone the repo and run \`vsim -do run.do tb_cache\` in ModelSim. All 3 test suites should pass before moving to FPGA.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "Synthesize in Vivado", description: "Open Vivado 2023.1, source synth.tcl. Target XC7A35T-1CPG236C. Check timing report â€” should show positive slack at 150MHz.", image: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=800&q=80" },
      { step: 3, title: "Program FPGA and Verify", description: "Program the Arty A7 via JTAG. Use VIO (Virtual I/O) core to inject cache addresses and observe hit/miss signals on ILA waveform.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `module cache_controller #(
  parameter WAYS    = 4,
  parameter SETS    = 256,
  parameter LINE_SZ = 64
)(
  input  logic        clk, rst_n,
  input  logic [31:0] addr,
  input  logic        rd_en, wr_en,
  output logic [31:0] rd_data,
  output logic        hit, miss
);
  logic [21:0] tag_array  [SETS][WAYS];
  logic [31:0] data_array [SETS][WAYS][LINE_SZ/4];
  logic        valid      [SETS][WAYS];
  logic [2:0]  lru_bits   [SETS];
  // LRU replacement + MESI state machine below
endmodule`,
    downloads: [
      { name: "CacheCtrl_RTL_v2.0.1.zip", url: "#", size: "48 KB" },
      { name: "Synthesis_Report_Artix7.pdf", url: "#", size: "220 KB" }
    ]
  },

  3: {
    id: 3,
    title: "Autonomous Quadcopter Nav Stack",
    slug: "autonomous-quadcopter",
    authorId: "user-4",
    author: "@drone_guy",
    authorAvatar: "https://i.pravatar.cc/150?u=user4",
    description: "Full ROS2 Humble navigation stack for quadcopters with ORB-SLAM3 visual-inertial odometry and EGO-Planner trajectory optimization.",
    fullDescription: "A complete autonomous quadcopter software stack built on ROS2 Humble. Uses ORB-SLAM3 for visual-inertial odometry (GPS-denied indoor navigation), EGO-Planner for real-time jerk-minimized trajectory generation, and PX4 Autopilot for low-level flight control. The Jetson Nano companion computer runs the full stack at 30Hz. Field-tested on a DJI F450 frame in a 10Ã—8m indoor lab with 5-waypoint autonomous missions completing with <30cm position error.",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80",
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
    bom: [
      { id: "bom3-1", name: "DJI F450 Frame Kit", partNumber: "F450", category: "Frame", qty: 1, unit: "pcs", price: 2200, supplier: "RoboticsBD", buyLink: "#", stock: "In Stock", mounting: "Module" },
      { id: "bom3-2", name: "Pixhawk 6C Flight Controller", partNumber: "PX4-6C", category: "Flight Controller", qty: 1, unit: "pcs", price: 18000, supplier: "Holybro", buyLink: "https://holybro.com", stock: "In Stock", mounting: "Module" },
      { id: "bom3-3", name: "Intel RealSense D435i", partNumber: "D435i", category: "Camera+IMU", qty: 1, unit: "pcs", price: 22000, supplier: "Intel", buyLink: "#", notes: "Depth + RGB + IMU", stock: "In Stock", mounting: "Module" },
      { id: "bom3-4", name: "NVIDIA Jetson Nano 4GB", partNumber: "945-13450-0000-100", category: "Companion Computer", qty: 1, unit: "pcs", price: 9500, supplier: "Arrow", buyLink: "#", stock: "Low Stock", mounting: "Module" },
      { id: "bom3-5", name: "T-Motor MN3110 KV780", partNumber: "MN3110-KV780", category: "Motor", qty: 4, unit: "pcs", price: 1800, supplier: "T-Motor", buyLink: "#", stock: "In Stock", mounting: "Module" },
      { id: "bom3-6", name: "40A ESC BLHeli32", partNumber: "ESC-40A", category: "ESC", qty: 4, unit: "pcs", price: 1200, supplier: "AliExpress", buyLink: "#", stock: "In Stock", mounting: "Module" },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "Frame and Motor Assembly", description: "Assemble DJI F450 frame. Mount T-Motor MN3110 motors on arms. Connect BLHeli32 ESCs to motor terminals and to Pixhawk PWM outputs.", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "Companion Computer Mount", description: "Mount Jetson Nano on top plate. Connect to Pixhawk via TELEM2 UART. Mount RealSense D435i on front-facing carbon fiber bracket.", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" },
      { step: 3, title: "ROS2 Workspace Build", description: "On Jetson Nano: source ROS2 Humble, run \`colcon build --symlink-install\` in the workspace root. First build takes ~8 min.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
      { step: 4, title: "Simulation in Gazebo", description: "Run \`ros2 launch quadcopter_nav gazebo_sim.launch.py\`. Verify ORB-SLAM3 odometry and EGO-Planner trajectory in RViz2 before any real flight.", image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from nav_msgs.msg import Odometry
from sensor_msgs.msg import Image, Imu
from message_filters import ApproximateTimeSynchronizer, Subscriber

class VIONode(Node):
    def __init__(self):
        super().__init__('vio_node')
        self.odom_pub = self.create_publisher(Odometry, '/vio/odom', 10)
        img_sub = Subscriber(self, Image, '/camera/color/image_raw')
        imu_sub = Subscriber(self, Imu, '/camera/imu')
        sync = ApproximateTimeSynchronizer([img_sub, imu_sub], 10, 0.05)
        sync.registerCallback(self.slam_callback)

    def slam_callback(self, img_msg, imu_msg):
        # ORB-SLAM3 processing here
        pass`,
    downloads: [
      { name: "QuadNav_ROS2_v1.0.3.tar.gz", url: "#", size: "18 MB" },
      { name: "Gazebo_World_Lab.zip", url: "#", size: "5 MB" }
    ]
  },

  4: {
    id: 4,
    title: "Graph Neural Network Recommender",
    slug: "gnn-recommendations",
    authorId: "user-5",
    author: "@ai_alex",
    authorAvatar: "https://i.pravatar.cc/150?u=user5",
    description: "GCN-based collaborative filtering using LightGCN + NGCF architectures with PyTorch Geometric.",
    fullDescription: "A production-grade graph collaborative filtering system built with PyTorch Geometric. Implements LightGCN (linear graph convolution) and NGCF (Neural Graph Collaborative Filtering) architectures. Achieves NDCG@20=0.412 on the Amazon-Book benchmark dataset. Supports mini-batch GraphSAGE sampling for graphs with 10M+ nodes and edges. Training on A100 GPU completes in under 30 minutes. Real-time inference serves top-K recommendations in <10ms per user via a FastAPI endpoint.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
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
    bom: [
      { id: "bom4-1", name: "NVIDIA A100 80GB (cloud)", partNumber: "A100-SXM4-80GB", category: "Compute", qty: 1, unit: "hr", price: 260, supplier: "AWS p4d.24xlarge", buyLink: "https://aws.amazon.com/ec2/instance-types/p4/", notes: "$3.20/hr spot", stock: "In Stock", mounting: "Module" },
      { id: "bom4-2", name: "Amazon-Book Dataset", partNumber: "OGB-ABOOK", category: "Dataset", qty: 1, unit: "pcs", price: 0, supplier: "OGB", buyLink: "https://ogb.stanford.edu", notes: "~2GB download", stock: "In Stock", mounting: "Module" },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "Environment Setup", description: "Install PyTorch 2.1 with CUDA 11.8: \`pip install torch==2.1.0 torch-geometric==2.4.0 wandb ogb\`. Verify GPU detection with \`torch.cuda.is_available()\`.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "Download Dataset", description: "Run \`python data.py --dataset amazon-book\`. Downloads ~2GB and preprocesses into train/val/test splits. Takes ~5 minutes.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
      { step: 3, title: "Train LightGCN", description: "Run \`python train.py --layers 3 --embed-dim 64 --epochs 1000\`. Weights & Biases logs loss and NDCG@20 every 10 epochs. Completes in ~25 min on A100.", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" },
      { step: 4, title: "Evaluate and Serve", description: "Run \`python eval.py\` to compute NDCG@20 on test split. Launch FastAPI server with \`uvicorn serve:app\` for real-time top-K inference.", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `class LightGCN(torch.nn.Module):
    def __init__(self, num_users, num_items, embed_dim=64, n_layers=3):
        super().__init__()
        self.user_emb = torch.nn.Embedding(num_users, embed_dim)
        self.item_emb = torch.nn.Embedding(num_items, embed_dim)
        self.convs = torch.nn.ModuleList([LGConv() for _ in range(n_layers)])

    def forward(self, edge_index, users, items):
        x = torch.cat([self.user_emb.weight, self.item_emb.weight])
        embs = [x]
        for conv in self.convs:
            x = conv(x, edge_index)
            embs.append(x)
        final = torch.stack(embs, dim=1).mean(dim=1)
        return (final[users] * final[items]).sum(dim=-1)`,
    downloads: [
      { name: "LightGCN_pretrained_amazon.pt", url: "#", size: "24 MB" },
      { name: "GNN_Rec_Notebook.ipynb", url: "#", size: "1.8 MB" }
    ]
  },

  5: {
    id: 5,
    title: "Neural Engine Accelerator ASIC",
    slug: "neural-engine-asic",
    authorId: "user-2",
    author: "@tech_wizard",
    authorAvatar: "https://i.pravatar.cc/150?u=user2",
    description: "Custom 8Ã—8 systolic array ASIC for INT8 transformer inference. 512 MAC units at 500MHz, 45 TOPS/W on GF 12nm.",
    fullDescription: "A custom neural network accelerator designed for INT8 transformer inference. The 8Ã—8 output-stationary systolic array contains 512 multiply-accumulate (MAC) units clocked at 500MHz. On-chip SRAM is 2MB, split into weight buffer and activation buffer. RTL is written in Verilog and verified with a full UVM testbench including scoreboard and functional coverage. Synthesized with Synopsys Design Compiler on GF 12nm LP, achieving 45 TOPS/W efficiency â€” 4Ã— better than FP16 alternatives.",
    image: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=800&q=80",
    category: "Hardware",
    categoryStyles: "bg-blue-100/90 dark:bg-blue-950/90 text-blue-800 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-xl shadow-lg",
    level: "Expert",
    tags: ["Verilog", "ASIC", "AI", "Synthesis", "UVM"],
    stars: 1521,
    views: 6201,
    comments: 42,
    forks: 156,
    createdAt: "2026-02-05T10:00:00Z",
    status: "published",
    bom: [
      { id: "bom5-1", name: "GF 12nm LP PDK License", partNumber: "GF12LP-PDK", category: "EDA/PDK", qty: 1, unit: "pcs", price: 0, supplier: "GlobalFoundries (academic)", buyLink: "#", notes: "Requires NDA. Free for academia.", stock: "In Stock", mounting: "Module" },
      { id: "bom5-2", name: "Synopsys Design Compiler 2022.03", partNumber: "DC-2022.03", category: "EDA Tool", qty: 1, unit: "license", price: 0, supplier: "Synopsys (academic)", buyLink: "#", notes: "University program license", stock: "In Stock", mounting: "Module" },
      { id: "bom5-3", name: "Synopsys VCS + Verdi", partNumber: "VCS-2022", category: "Simulation Tool", qty: 1, unit: "license", price: 0, supplier: "Synopsys (academic)", buyLink: "#", stock: "In Stock", mounting: "Module" },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "RTL Simulation with VCS", description: "Run \`vcs -sverilog tb_systolic.sv systolic_array.v\` then \`./simv\`. All 512 MAC outputs should match the golden reference model.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "UVM Regression Suite", description: "Run \`make uvm_regression\`. 3 test suites: random stimulus, corner cases, BERT-base layer dimensions. All must pass before synthesis.", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" },
      { step: 3, title: "Synthesis with Design Compiler", description: "Run \`dc_shell -f synth.tcl\`. Check area (target <0.5mmÂ² on GF12nm), timing (500MHz closure), and power report (target <12mW static).", image: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `module systolic_array #(
  parameter N = 8,
  parameter W = 8
)(
  input  wire         clk, rst_n,
  input  wire [W-1:0] a_row [N],
  input  wire [W-1:0] b_col [N],
  output reg  [31:0]  c_out [N][N]
);
  genvar i, j;
  generate
    for (i=0; i<N; i++) begin : row
      for (j=0; j<N; j++) begin : col
        PE u_pe (.clk(clk), .rst_n(rst_n),
                 .a_in(a_row[i]), .b_in(b_col[j]),
                 .c_out(c_out[i][j]));
      end
    end
  endgenerate
endmodule`,
    downloads: [
      { name: "NeuralEngine_RTL_v0.9.zip", url: "#", size: "120 KB" },
      { name: "DC_SynthReport_GF12nm.pdf", url: "#", size: "890 KB" }
    ]
  },
  6: {
    id: 6,
    title: "LoRa Mesh Network",
    slug: "lora-mesh-network",
    authorId: "user-3",
    author: "@sarah_circuits",
    authorAvatar: "https://i.pravatar.cc/150?u=user3",
    description: "Self-healing LoRa mesh using SX1276 transceivers and AODV routing on STM32L072. 30km field-tested range.",
    fullDescription: "A self-healing, multi-hop LoRa mesh network running AODV (Ad-hoc On-Demand Distance Vector) routing on ultra-low-power STM32L072 nodes. Each node uses an Ra-02 SX1276 LoRa module at 868MHz. The network was field-tested across 12 nodes covering 30km line-of-sight in Rajasthan desert terrain, achieving <500ms end-to-end latency. Each node runs on a single 18650 cell recharged by a 5W solar panel â€” projected battery life >6 months with 1 packet/min duty cycle.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    categoryStyles: "bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-xl shadow-lg",
    level: "Intermediate",
    tags: ["LoRa", "STM32", "IoT", "Networking", "RF"],
    stars: 720,
    views: 3421,
    comments: 18,
    forks: 64,
    createdAt: "2026-02-08T12:00:00Z",
    status: "published",
    bom: [
      { id: "bom6-1", name: "Ra-02 LoRa SX1276 Module", partNumber: "Ra-02", category: "RF Module", qty: 6, unit: "pcs", price: 420, supplier: "AliExpress", buyLink: "#", notes: "868MHz, +20dBm TX", stock: "In Stock", mounting: "Module" },
      { id: "bom6-2", name: "STM32L072CZ MCU", partNumber: "STM32L072CZT6", category: "Microcontroller", qty: 6, unit: "pcs", price: 380, supplier: "Mouser", buyLink: "#", notes: "1.4mA run current", stock: "In Stock", mounting: "THT" },
      { id: "bom6-3", name: "TP4056 Li-ion Charger Module", partNumber: "TP4056-MOD", category: "Power", qty: 6, unit: "pcs", price: 70, supplier: "Robu", buyLink: "#", stock: "In Stock", mounting: "Module" },
      { id: "bom6-4", name: "18650 Li-ion 3000mAh", partNumber: "18650-3000", category: "Battery", qty: 6, unit: "pcs", price: 280, supplier: "Generic", buyLink: "#", stock: "In Stock", mounting: "THT" },
      { id: "bom6-5", name: "5.5dBi 868MHz Fiberglass Antenna", partNumber: "ANT-868-5.5", category: "Antenna", qty: 6, unit: "pcs", price: 350, supplier: "RF Solutions", buyLink: "#", stock: "In Stock", mounting: "Module" },
      { id: "bom6-6", name: "5W Mono Solar Panel", partNumber: "SP-5W", category: "Power", qty: 6, unit: "pcs", price: 450, supplier: "Amazon", buyLink: "#", stock: "In Stock", mounting: "Module" },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "Build One Node", description: "Solder STM32L072 onto custom PCB. Connect Ra-02 via SPI (NSSâ†’PA4, SCKâ†’PA5, MISOâ†’PA6, MOSIâ†’PA7, DIO0â†’PB0). Add TP4056 + 18650 power circuit.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "Flash AODV Firmware", description: "Open STM32CubeIDE project. Set NODE_ID in config.h (unique per node). Flash via ST-Link. Verify 'Node ready' on UART at 9600 baud.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
      { step: 3, title: "Range and Mesh Testing", description: "Deploy minimum 3 nodes. Use the Python gateway dashboard to watch route discovery and packet delivery. Check RSSI values â€” target > -115dBm for reliable links.", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `void aodv_send(uint8_t dest, uint8_t *data, uint8_t len) {
  RouteEntry *r = aodv_lookup(dest);
  if (!r) {
    aodv_rreq_broadcast(dest);
    r = aodv_wait_rrep(dest, 2000);
  }
  if (r) lora_send_to(r->next_hop, data, len);
}

void aodv_on_rx(LoRaPacket *pkt) {
  if (pkt->type == PKT_RREQ)      aodv_handle_rreq(pkt);
  else if (pkt->type == PKT_RREP) aodv_handle_rrep(pkt);
  else if (pkt->dest == NODE_ID)  app_receive(pkt->data, pkt->len);
  else                             aodv_forward(pkt);
}`,
    downloads: [
      { name: "LoRaMesh_Firmware_v2.1.zip", url: "#", size: "340 KB" },
      { name: "PCB_Gerbers_Node_v2.zip", url: "#", size: "1.1 MB" },
      { name: "Field_Test_Report_Rajasthan.pdf", url: "#", size: "3.4 MB" }
    ]
  },

  7: {
    id: 7,
    title: "Real-Time OS Kernel for ARM",
    slug: "rtos-arm-kernel",
    authorId: "user-1",
    author: "@bhavya_dev",
    authorAvatar: "https://i.pravatar.cc/150?u=user1",
    description: "Preemptive priority-based RTOS kernel for ARM Cortex-M4 with cooperative round-robin scheduling and custom heap allocator.",
    fullDescription: "A hand-written preemptive RTOS kernel targeting ARM Cortex-M4 (STM32F429). Implements fixed-priority preemptive scheduling with round-robin at equal priority levels. Context switching is done via PendSV handler in 64 bytes of hand-written ARMv7-M assembly â€” measured at 1.8Âµs worst-case latency over 10,000 switches. Features priority-inheritance mutexes, binary semaphores, message queues, and a buddy-system heap allocator achieving O(log n) alloc/free.",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80",
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
    bom: [
      { id: "bom7-1", name: "STM32F429I-DISC1 Dev Board", partNumber: "STM32F429I-DISC1", category: "Dev Board", qty: 1, unit: "pcs", price: 2400, supplier: "STMicroelectronics", buyLink: "#", notes: "Cortex-M4 @ 180MHz, 2MB Flash", stock: "In Stock", mounting: "Module" },
      { id: "bom7-2", name: "Saleae Logic 8 Analyzer", partNumber: "LOGIC-8", category: "Measurement", qty: 1, unit: "pcs", price: 12000, supplier: "Saleae", buyLink: "#", stock: "In Stock", mounting: "Module" },
      { id: "bom7-3", name: "ST-Link V3 Programmer", partNumber: "STLINK-V3MODS", category: "Programmer", qty: 1, unit: "pcs", price: 1800, supplier: "Mouser", buyLink: "#", stock: "In Stock", mounting: "Module" },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "Toolchain Setup", description: "Install arm-none-eabi-gcc v10.3.1 and OpenOCD v0.11. Verify: \`arm-none-eabi-gcc --version\`. Add to PATH.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "Build Kernel", description: "Run \`make all\` in repo root. Generates kernel.elf, kernel.bin, and kernel.hex. Check for zero errors and warnings.", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" },
      { step: 3, title: "Flash and Debug", description: "Connect ST-Link to STM32F429 Discovery board. Run \`make flash\`. Open GDB with \`arm-none-eabi-gdb kernel.elf\` and connect to OpenOCD.", image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80" },
      { step: 4, title: "Run Test Suite", description: "Open serial monitor at 115200 baud. All 6 kernel tests should print PASS. Check logic analyzer for context switch timing on GPIO toggle pin.", image: "https://images.unsplash.com/photo-1501250987900-211872d97eaa?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `// PendSV_Handler â€” ARMv7-M context switch (assembly)
PendSV_Handler:
    MRS     R0, PSP
    STMDB   R0!, {R4-R11}       // Save callee-saved regs
    LDR     R1, =current_tcb
    STR     R0, [R1]            // Save new PSP to TCB
    BL      os_select_next      // Pick next task
    LDR     R1, =current_tcb
    LDR     R0, [R1]            // Load new task PSP
    LDMIA   R0!, {R4-R11}       // Restore callee-saved regs
    MSR     PSP, R0
    BX      LR                  // Return to new task`,
    downloads: [
      { name: "RTOS_ARM_Kernel_v0.8.zip", url: "#", size: "82 KB" },
      { name: "Kernel_Design_Doc.pdf", url: "#", size: "1.1 MB" }
    ]
  },

  8: {
    id: 8,
    title: "Soft Robotic Gripper",
    slug: "soft-robotic-gripper",
    authorId: "user-4",
    author: "@drone_guy",
    authorAvatar: "https://i.pravatar.cc/150?u=user4",
    description: "Pneumatically actuated bellows-type soft gripper from Smooth-Sil 950 silicone with ROS2 control node.",
    fullDescription: "A pneumatically actuated 3-finger bellows gripper cast from Smooth-Sil 950 platinum silicone. The finger molds are 3D printed at 0.12mm layer height on a Bambu Lab X1C in PETG. Each finger is independently controlled via a 2-way solenoid valve. A CJMCU-758 pressure sensor on each finger provides feedback. The ROS2 Humble gripper node publishes finger pressure state and accepts Float32 pressure commands on \`/gripper/pressure\`. Handles objects 10â€“500g without rigid skeleton â€” tested on 200+ pick-and-place cycles.",
    image: "https://images.unsplash.com/photo-1561144257-e32e8506afe4?auto=format&fit=crop&w=800&q=80",
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
    bom: [
      { id: "bom8-1", name: "Smooth-Sil 950 Silicone Part A+B", partNumber: "SS950-KIT", category: "Material", qty: 1, unit: "kit", price: 3200, supplier: "Smooth-On", buyLink: "https://www.smooth-on.com", notes: "Shore A50, 1:1 mix ratio", stock: "In Stock", mounting: "Module" },
      { id: "bom8-2", name: "PETG Filament 1kg", partNumber: "PETG-1KG", category: "Material", qty: 1, unit: "roll", price: 1200, supplier: "Bambu Lab", buyLink: "#", stock: "In Stock", mounting: "Module" },
      { id: "bom8-3", name: "CJMCU-758 Pressure Sensor", partNumber: "CJMCU-758", category: "Sensor", qty: 3, unit: "pcs", price: 280, supplier: "AliExpress", buyLink: "#", stock: "In Stock", mounting: "Module" },
      { id: "bom8-4", name: "2-Way Solenoid Valve 1/8\" 12V", partNumber: "SV-1-8-12V", category: "Pneumatics", qty: 3, unit: "pcs", price: 650, supplier: "RS Components", buyLink: "#", stock: "In Stock", mounting: "Module" },
      { id: "bom8-5", name: "12V Mini Air Pump 10LPM", partNumber: "AP-10L-12V", category: "Pneumatics", qty: 1, unit: "pcs", price: 1800, supplier: "Amazon", buyLink: "#", stock: "In Stock", mounting: "Module" },
      { id: "bom8-6", name: "Raspberry Pi 4B 4GB", partNumber: "SC0194", category: "Controller", qty: 1, unit: "pcs", price: 6500, supplier: "Robu", buyLink: "https://robu.in", notes: "Runs ROS2 Humble gripper node", stock: "In Stock", mounting: "Module" },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1561144257-e32e8506afe4?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "Print and Prep Molds", description: "Print mold files at 0.12mm layer height, 40% gyroid infill in PETG. Sand mold interior surfaces to 400 grit. Apply mold release spray.", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "Mix and Cast Silicone", description: "Weigh Smooth-Sil 950 Part A and Part B at 1:1 ratio by weight. Mix for 3 min. Vacuum degas for 5 min at -28 inHg. Pour slowly into molds. Cure 16h at 23Â°C.", image: "https://images.unsplash.com/photo-1561144257-e32e8506afe4?auto=format&fit=crop&w=800&q=80" },
      { step: 3, title: "Assemble Pneumatic Circuit", description: "Connect air pump â†’ pressure regulator â†’ solenoid valves â†’ finger inlets via 4mm OD silicone tubing. Confirm no leaks at 1.5 bar with soapy water test.", image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=800&q=80" },
      { step: 4, title: "Deploy ROS2 Node", description: "On Raspberry Pi: \`ros2 launch gripper_control gripper.launch.py\`. Test with \`ros2 topic pub /gripper/pressure std_msgs/Float32 '{data: 1.0}'\`.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `class GripperNode(Node):
    def __init__(self):
        super().__init__('gripper_node')
        GPIO.setmode(GPIO.BCM)
        for p in VALVE_PINS:
            GPIO.setup(p, GPIO.OUT, initial=GPIO.LOW)
        self.sub = self.create_subscription(
            Float32, '/gripper/pressure', self.on_cmd, 10)

    def on_cmd(self, msg):
        state = msg.data > 0.5
        for p in VALVE_PINS:
            GPIO.output(p, state)`,
    downloads: [
      { name: "SoftGripper_Molds_v1.1.zip", url: "#", size: "28 MB" },
      { name: "ROS2_Gripper_Package.tar.gz", url: "#", size: "4 MB" }
    ]
  },

  9: {
    id: 9,
    title: "Diffusion Model from Scratch",
    slug: "diffusion-model-scratch",
    authorId: "user-5",
    author: "@ai_alex",
    authorAvatar: "https://i.pravatar.cc/150?u=user5",
    description: "Clean annotated PyTorch DDPM and DDIM from first principles. FID=8.1 on CIFAR-10 matching the original paper.",
    fullDescription: "A clean, fully-annotated PyTorch implementation of DDPM (Denoising Diffusion Probabilistic Models) and DDIM (Denoising Diffusion Implicit Models) from first principles â€” no HuggingFace Diffusers dependency. Every operation maps directly to equations in the original papers. Uses a cosine noise schedule (Improved DDPM) achieving FID=8.1 on CIFAR-10 vs FID=11.9 for linear schedule. DDIM 50-step sampling generates 64 images in 4.2s on A100, a 70Ã— speedup over DDPM 1000-step sampling.",
    image: "https://images.unsplash.com/photo-1686191128892-3b37add4c844?auto=format&fit=crop&w=800&q=80",
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
    bom: [
      { id: "bom9-1", name: "NVIDIA A100 80GB (cloud)", partNumber: "A100-SXM4", category: "Compute", qty: 1, unit: "hr", price: 260, supplier: "AWS", buyLink: "#", notes: "$3.20/hr on-demand", stock: "In Stock", mounting: "Module" },
      { id: "bom9-2", name: "CelebA-HQ 256x256 Dataset", partNumber: "CELEBA-HQ-256", category: "Dataset", qty: 1, unit: "pcs", price: 0, supplier: "Academic", buyLink: "#", notes: "~15GB download", stock: "In Stock", mounting: "Module" },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1686191128892-3b37add4c844?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "Install Dependencies", description: "Run \`pip install torch==2.1.0 torchvision wandb\`. Verify CUDA: \`python -c 'import torch; print(torch.cuda.is_available())'\`.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "Train on CIFAR-10 First", description: "Run \`python train.py --dataset cifar10 --epochs 800\`. Should reach FID < 10 on CIFAR-10 in ~3h on a single A100. Use W&B dashboard to monitor.", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" },
      { step: 3, title: "Scale to CelebA-HQ 256", description: "Run \`python train.py --dataset celeba256 --epochs 500\`. ~4h on A100. Monitor FID every 50 epochs â€” should drop below 15 by epoch 200.", image: "https://images.unsplash.com/photo-1686191128892-3b37add4c844?auto=format&fit=crop&w=800&q=80" },
      { step: 4, title: "Sample with DDIM", description: "Run \`python sample.py --steps 50 --sampler ddim --n 64\`. Generates a grid of 64 samples in ~4 seconds. Compare with DDPM 1000-step for quality vs speed tradeoff.", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `class DDPM:
    def __init__(self, model, timesteps=1000):
        self.T = timesteps
        betas = self._cosine_schedule(timesteps)
        alphas = 1.0 - betas
        self.alpha_bar = torch.cumprod(alphas, dim=0)

    def q_sample(self, x0, t, noise=None):
        if noise is None: noise = torch.randn_like(x0)
        ab = self.alpha_bar[t].view(-1,1,1,1)
        return ab.sqrt() * x0 + (1-ab).sqrt() * noise, noise

    def p_loss(self, x0, t):
        x_noisy, noise = self.q_sample(x0, t)
        return F.mse_loss(self.model(x_noisy, t), noise)`,
    downloads: [
      { name: "DDPM_pretrained_celeba256.pt", url: "#", size: "890 MB" },
      { name: "Diffusion_From_Scratch.ipynb", url: "#", size: "3.2 MB" }
    ]
  },
  10: {
    id: 10,
    title: "Open-Source Oscilloscope",
    slug: "open-source-oscilloscope",
    authorId: "user-1",
    author: "@bhavya_dev",
    authorAvatar: "https://i.pravatar.cc/150?u=user1",
    description: "2-channel 10MSPS oscilloscope on STM32H750 with 4-inch TFT display, FFT mode, and USB Python companion app.",
    fullDescription: "A fully open-source 2-channel digital oscilloscope built on STM32H750. Captures at 10MSPS with 8-bit resolution using the onboard ADC with DMA ping-pong buffering. The 4\" ILI9341 TFT shows live waveforms, trigger markers, and an ARM CMSIS DSP FFT spectrum up to 5MHz. A 1MÎ© analog front-end uses OPA354 op-amps for flat response up to 5MHz. USB CDC mode streams samples to a Python/Matplotlib companion app at 5MB/s. Total BOM cost under â‚¹2500.",
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=800&q=80",
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
    bom: [
      { id: "bom10-1", name: "STM32H750VBT6", partNumber: "STM32H750VBT6", category: "Microcontroller", qty: 1, unit: "pcs", price: 480, supplier: "Mouser", buyLink: "https://www.mouser.in", notes: "480MHz CM7, 2MB DTCM RAM", stock: "In Stock", mounting: "SMD" },
      { id: "bom10-2", name: "4.0\" ILI9341 TFT SPI 320x240", partNumber: "TFT-ILI9341-4", category: "Display", qty: 1, unit: "pcs", price: 380, supplier: "Robu", buyLink: "https://robu.in", stock: "In Stock", mounting: "Module" },
      { id: "bom10-3", name: "OPA354AIDBVR Rail-to-Rail Op-Amp", partNumber: "OPA354AIDBVR", category: "Analog Front-End", qty: 2, unit: "pcs", price: 95, supplier: "Mouser", buyLink: "#", notes: "200MHz GBW, SOT-23-5", stock: "In Stock", mounting: "SMD" },
      { id: "bom10-4", name: "BNC Connectors PCB Mount", partNumber: "BNC-PCB", category: "Connector", qty: 2, unit: "pcs", price: 120, supplier: "Amazon", buyLink: "#", stock: "In Stock", mounting: "THT" },
      { id: "bom10-5", name: "1MÎ© 1% Resistors 0402", partNumber: "RC0402FR-071ML", category: "Passive", qty: 4, unit: "pcs", price: 15, supplier: "Robu", buyLink: "#", stock: "In Stock", mounting: "SMD" },
      { id: "bom10-6", name: "USB-C Connector SMD", partNumber: "USB4105-GF-A", category: "Connector", qty: 1, unit: "pcs", price: 35, supplier: "Digi-Key", buyLink: "#", stock: "In Stock", mounting: "SMD" },
      { id: "bom10-7", name: "100nF MLCC 0402 x20", partNumber: "GRM155R71C104K", category: "Passive", qty: 20, unit: "pcs", price: 5, supplier: "Mouser", buyLink: "#", stock: "In Stock", mounting: "SMD" },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "Order PCB and Components", description: "Order 4-layer PCB from JLCPCB using provided Gerbers. Order all components from BOM. Expected cost â‚¹2500 total.", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "SMD Soldering", description: "Solder 0402 passives first using paste + reflow. Then hand-solder STM32H750 LQFP100, OPA354 SOT-23, USB-C connector, and BNC jacks.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
      { step: 3, title: "Flash Firmware", description: "Connect ST-Link V3. Flash via STM32CubeIDE. Open serial monitor â€” scope should print 'Ready' and display 'NetList Scope v3.0' splash screen.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
      { step: 4, title: "Calibrate and Test", description: "Connect 1kHz sine from function generator. Verify waveform on TFT. Run FFT mode â€” check peak at 1kHz bin. Connect USB and launch Python companion app.", image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `void scope_start_capture(void) {
  HAL_ADC_Start_DMA(&hadc1, (uint32_t*)dma_buf[0], SAMPLE_BUF_SIZE);
  HAL_ADC_Start_DMA(&hadc3, (uint32_t*)dma_buf[1], SAMPLE_BUF_SIZE);
}

void scope_fft_display(void) {
  arm_rfft_fast_instance_f32 fft;
  arm_rfft_fast_init_f32(&fft, SAMPLE_BUF_SIZE);
  float32_t input[SAMPLE_BUF_SIZE], output[SAMPLE_BUF_SIZE];
  for (int i=0; i<SAMPLE_BUF_SIZE; i++)
    input[i] = (float32_t)dma_buf[0][i];
  arm_rfft_fast_f32(&fft, input, output, 0);
  scope_render_spectrum(output, SAMPLE_BUF_SIZE/2, TFT_YELLOW);
}`,
    downloads: [
      { name: "OpenScope_Gerbers_v3.zip", url: "#", size: "2.1 MB" },
      { name: "OpenScope_Firmware_v3.bin", url: "#", size: "156 KB" },
      { name: "Python_Companion_App.zip", url: "#", size: "18 KB" },
      { name: "OpenScope_Schematic_v3.pdf", url: "#", size: "1.8 MB" }
    ]
  },

  11: {
    id: 11,
    title: "ESP32 Air Mouse with MPU6050",
    slug: "esp32-air-mouse-mpu6050",
    authorId: "user-1",
    author: "@bhavya_dev",
    authorAvatar: "https://i.pravatar.cc/150?u=user1",
    description: "Wearable Bluetooth air mouse that converts hand motion into wireless HID cursor movement using ESP32 and MPU6050.",
    fullDescription: "This ESP32 Air Mouse turns your hand into a wireless pointing device. The MPU6050 6-axis IMU measures pitch and roll at 100Hz over I2C. A complementary filter fuses accelerometer and gyroscope data to produce stable, drift-free angles. The ESP32 exposes itself as a standard Bluetooth HID mouse â€” no USB dongle or receiver needed. Two physical tactile buttons provide left/right click, and a third button toggles between two sensitivity modes. The entire circuit runs from a single 18650 Li-ion cell charged via TP4056, housed in a 3D-printed ergonomic grip. Measured pointer latency: ~15ms.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    categoryStyles: "bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-xl shadow-lg",
    level: "Intermediate",
    tags: ["ESP32", "MPU6050", "Bluetooth", "HID", "Wearable"],
    stars: 980,
    views: 5123,
    comments: 27,
    forks: 143,
    createdAt: "2026-02-24T18:00:00Z",
    status: "published",
    bom: [
      { id: "bom11-1", name: "ESP32 DevKitC V4", partNumber: "ESP32-DEVKITC-32D", category: "Microcontroller", qty: 1, unit: "pcs", price: 350, supplier: "Robu.in", buyLink: "https://robu.in/product/esp32-devkitc-development-board/", notes: "Onboard USB-UART, 38 GPIOs", stock: "In Stock", mounting: "Module" },
      { id: "bom11-2", name: "MPU6050 IMU Breakout GY-521", partNumber: "GY-521", category: "Sensor", qty: 1, unit: "pcs", price: 180, supplier: "Robu.in", buyLink: "https://robu.in/product/mpu6050-3-axis-gyroscope-accelerometer-module/", notes: "3-axis accel + 3-axis gyro, I2C", stock: "In Stock", mounting: "Module" },
      { id: "bom11-3", name: "TP4056 Li-ion Charger Module", partNumber: "TP4056-MOD", category: "Power IC", qty: 1, unit: "pcs", price: 70, supplier: "Robu.in", buyLink: "https://robu.in", notes: "1A charge current, micro-USB input", stock: "In Stock", mounting: "Module" },
      { id: "bom11-4", name: "18650 Li-ion Cell 2200mAh", partNumber: "18650-2200-PCB", category: "Battery", qty: 1, unit: "pcs", price: 220, supplier: "Amazon / Local", buyLink: "#", notes: "Use protected cell with built-in PCB", stock: "Low Stock", mounting: "THT" },
      { id: "bom11-5", name: "Tactile Push Button 6Ã—6mm", partNumber: "BTN-6x6-4P", category: "Input", qty: 3, unit: "pcs", price: 10, supplier: "Any", buyLink: "#", notes: "Left click, right click, sensitivity toggle", stock: "In Stock", mounting: "THT" },
      { id: "bom11-6", name: "10kÎ© Resistor 0.25W", partNumber: "R-10K-025W", category: "Passive", qty: 3, unit: "pcs", price: 2, supplier: "Any", buyLink: "#", notes: "Pull-down for buttons", stock: "In Stock", mounting: "THT" },
      { id: "bom11-7", name: "PLA Filament for Enclosure", partNumber: "PLA-1KG", category: "Material", qty: 1, unit: "roll", price: 800, supplier: "Bambu Lab / Generic", buyLink: "#", notes: "Print ergonomic hand grip", stock: "In Stock", mounting: "Module" },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "Wire ESP32 to MPU6050", description: "Connect MPU6050: VCCâ†’3V3, GNDâ†’GND, SCLâ†’GPIO22, SDAâ†’GPIO21. Add 4.7kÎ© pull-ups on SDA and SCL lines. Keep I2C wires under 10cm. Test with i2c_scanner sketch â€” should see device at 0x68.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "Add Buttons and Power Circuit", description: "Wire 3 tactile buttons: one pin to GPIO 12, 13, 14; other pin to GND with 10kÎ© pull-downs. Connect TP4056 OUT+ to ESP32 VIN, OUT- to GND. Insert protected 18650 cell.", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" },
      { step: 3, title: "Flash Firmware and Test BLE", description: "Install BleMouse library in Arduino IDE. Flash firmware. On PC, go to Bluetooth settings â†’ Add device â†’ look for 'NetList Air Mouse'. Pair and test basic cursor movement in Serial Monitor with flat device.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
      { step: 4, title: "Calibrate and Print Enclosure", description: "Run calibration by holding device flat and pressing button 3 for 3 seconds. Tune sensitivity constants in config.h. Print enclosure STL at 0.2mm layer height, 20% infill.", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `#include <BleMouse.h>
#include <Wire.h>
#include "MPU6050_light.h"

BleMouse bleMouse("NetList Air Mouse");
MPU6050 mpu(Wire);

void setup() {
  Wire.begin();
  mpu.begin();
  mpu.calcOffsets(); // Auto-calibrate on flat surface
  bleMouse.begin();
}

void loop() {
  if (!bleMouse.isConnected()) return;
  mpu.update();
  float pitch = mpu.getAngleX();
  float roll  = mpu.getAngleY();
  int dx = constrain((int)(roll  * 0.8f), -20, 20);
  int dy = constrain((int)(-pitch * 0.8f), -20, 20);
  bleMouse.move(dx, dy);
  delay(10); // 100 Hz update
}`,
    downloads: [
      { name: "ESP32_AirMouse_Firmware_v1.0.zip", url: "#", size: "120 KB" },
      { name: "AirMouse_Enclosure_v1.stl", url: "#", size: "1.9 MB" },
      { name: "AirMouse_Schematic.pdf", url: "#", size: "480 KB" }
    ]
  },

  12: {
    id: 12,
    title: "ESP32 3D Orientation Simulator",
    slug: "esp32-3d-orientation-sim",
    authorId: "user-2",
    author: "@tech_wizard",
    authorAvatar: "https://i.pravatar.cc/150?u=user2",
    description: "Wi-Fi ESP32 + MPU6050 streams live orientation data to a Three.js browser dashboard that renders a real-time 3D model.",
    fullDescription: "This project pairs an ESP32 DevKitC with an MPU6050 IMU to stream real-time yaw, pitch, and roll data over Wi-Fi using Server-Sent Events (SSE). A browser dashboard served directly from the ESP32's LittleFS filesystem renders a 3D board model using Three.js (r152) with Phong lighting and orbit controls. The 3D model rotates live as you physically rotate the hardware â€” latency under 40ms end-to-end. A heads-up display shows numeric angle values in degrees. Update rate: ~30 FPS. Perfect for IMU debugging, sensor fusion education, and robotics attitude visualization.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    categoryStyles: "bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-xl shadow-lg",
    level: "Intermediate",
    tags: ["ESP32", "MPU6050", "Three.js", "Web", "Wi-Fi"],
    stars: 1245,
    views: 6890,
    comments: 38,
    forks: 204,
    createdAt: "2026-03-01T10:30:00Z",
    status: "published",
    bom: [
      { id: "bom12-1", name: "ESP32 DevKitC V4", partNumber: "ESP32-DEVKITC-32D", category: "Microcontroller", qty: 1, unit: "pcs", price: 350, supplier: "Robu.in", buyLink: "https://robu.in", notes: "Wi-Fi + BT, 38 GPIOs", stock: "In Stock", mounting: "Module" },
      { id: "bom12-2", name: "MPU6050 IMU Breakout GY-521", partNumber: "GY-521", category: "Sensor", qty: 1, unit: "pcs", price: 180, supplier: "Robu.in", buyLink: "https://robu.in", notes: "3-axis accel + gyro, I2C, AD0 low = 0x68", stock: "In Stock", mounting: "Module" },
      { id: "bom12-3", name: "Micro USB Cable", partNumber: "USB-MICRO-1M", category: "Accessory", qty: 1, unit: "pcs", price: 80, supplier: "Any", buyLink: "#", notes: "Power + flashing", stock: "In Stock", mounting: "Module" },
      { id: "bom12-4", name: "4.7kÎ© Resistor 0.25W", partNumber: "R-4K7-025W", category: "Passive", qty: 2, unit: "pcs", price: 2, supplier: "Any", buyLink: "#", notes: "I2C pull-ups on SDA and SCL", stock: "In Stock", mounting: "THT" },
      { id: "bom12-5", name: "Breadboard 830-point", partNumber: "BB-830", category: "Prototyping", qty: 1, unit: "pcs", price: 120, supplier: "Robu.in", buyLink: "https://robu.in", notes: "Or solder directly to perfboard", stock: "In Stock", mounting: "Module" },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "Wire MPU6050 to ESP32", description: "On breadboard: MPU6050 VCCâ†’3V3, GNDâ†’GND, SDAâ†’GPIO21, SCLâ†’GPIO22. Add 4.7kÎ© pull-ups from SDA and SCL to 3V3. Verify with i2c_scanner â€” device at address 0x68.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "Configure Wi-Fi and Build Firmware", description: "Edit config.h: set WIFI_SSID and WIFI_PASS. Open PlatformIO project, run \`pio run\`. Firmware includes ESPAsyncWebServer for the HTTP server and SSE endpoint at /events.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80" },
      { step: 3, title: "Upload Filesystem and Flash", description: "Run \`pio run --target uploadfs\` to upload index.html and script.js to LittleFS. Then \`pio run --target upload\` to flash the firmware. Check Serial Monitor for the assigned IP address.", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80" },
      { step: 4, title: "Open Browser Dashboard", description: "Connect your PC to the same Wi-Fi network. Visit http://<esp32-ip>/ in Chrome or Firefox. The 3D board model should rotate live as you tilt the hardware. HUD shows Yaw/Pitch/Roll in degrees.", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `// ESP32 firmware â€” SSE orientation stream
void loop() {
  static uint32_t last = 0;
  if (millis() - last > 33) { // ~30 Hz
    last = millis();
    float yaw, pitch, roll;
    mpu_read_ypr(yaw, pitch, roll);
    char buf[128];
    snprintf(buf, sizeof(buf),
      "{\\"yaw\\":%.2f,\\"pitch\\":%.2f,\\"roll\\":%.2f}",
      yaw, pitch, roll);
    events.send(buf, "orientation");
  }
}

// Browser â€” Three.js handler
source.addEventListener('orientation', (e) => {
  const o = JSON.parse(e.data);
  cube.rotation.y = o.yaw   * Math.PI / 180;
  cube.rotation.x = o.pitch * Math.PI / 180;
  cube.rotation.z = o.roll  * Math.PI / 180;
});`,
    downloads: [
      { name: "ESP32_3D_Orientation_Firmware.zip", url: "#", size: "85 KB" },
      { name: "Web_Dashboard_Files.zip", url: "#", size: "30 KB" },
      { name: "Orientation_Sim_Schematic.pdf", url: "#", size: "320 KB" }
    ]
  }

};
