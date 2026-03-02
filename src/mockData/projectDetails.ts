import { Project } from "./projects";
import { BOMItem } from "./bom";

export interface BuildStep {
  step: number;
  title: string;
  description: string;
  image: string;
}

export interface ProjectDetail extends Project {
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
    title: "ESP32 Radar Intrusion",
    slug: "esp32-radar-intrusion",
    authorId: "user-2",
    author: "@tech_wizard",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
    description: "A compact, low-power intrusion detection system using ESP32 and millimeter-wave radar sensors for precise motion tracking.",
    fullDescription: "This project uses the ESP32-C3 along with the HLK-LD2410B mmWave radar sensor to create a highly sensitive motion detection system. Unlike PIR sensors, this radar can detect stationary human presence by measuring micro-motions like breathing.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    categoryStyles: "bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-xl shadow-lg",
    level: "Advanced",
    tags: ["ESP32", "C++", "IoT", "Radar", "FreeRTOS"],
    stars: 1200,
    views: 4500,
    comments: 32,
    forks: 128,
    createdAt: "2026-01-15T09:00:00Z",
    status: "published",
    bom: [
      { id: "1", name: "ESP32-C3 SuperMini", qty: 1, unit: "pcs", partNumber: "ESP32-C3", category: "Microcontroller", price: 380, supplier: "Robu.in", mounting: "Module" as const, stock: "In Stock" as const },
      { id: "2", name: "HLK-LD2410B mmWave Radar", qty: 1, unit: "pcs", partNumber: "LD2410B", category: "Sensor", price: 520, supplier: "AliExpress", mounting: "Module" as const, stock: "In Stock" as const },
      { id: "3", name: "0.96 inch OLED Display", qty: 1, unit: "pcs", partNumber: "SSD1306", category: "Display", price: 250, supplier: "Robu.in", mounting: "Module" as const, stock: "In Stock" as const },
    ],
    schematics: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
    ],
    buildSteps: [
      { step: 1, title: "Prepare Components", description: "Gather the ESP32, Radar sensor, and jumper wires. Ensure you have a stable 5V power supply.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
      { step: 2, title: "Wiring", description: "Connect the VCC/GND of the sensor to the ESP32. Connect TX/RX pins for serial communication.", image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80" },
    ],
    codeSnippet: `void setup() {
  Serial.begin(115200);
  radar.begin(Serial1);
  display.init();
}

void loop() {
  if (radar.read()) {
    display.showMotion(radar.getDistance());
  }
}`,
    downloads: [
      { name: "ESP32_Radar_Source.zip", url: "#", size: "1.2 MB" },
      { name: "Radar_Case_3D_Print.stl", url: "#", size: "4.5 MB" }
    ]
  }
};
