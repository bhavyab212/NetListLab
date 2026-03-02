export interface BOMItem {
    id: string;
    name: string;
    partNumber?: string;
    category: string;
    qty: number;
    unit: string;
    price: number; // in INR
    supplier?: string;
    buyLink?: string;
    notes?: string;
    stock?: "In Stock" | "Low Stock" | "Out of Stock";
    mounting?: "SMD" | "THT" | "Module";
    altPart?: string;
    value?: string;
    datasheet?: string;
}

// BOM for Project 1: ESP32 Radar Intrusion System
export const bomProject1: BOMItem[] = [
    { id: "bom1-1", name: "ESP32-WROOM-32D Module", partNumber: "ESP32-WROOM-32D", category: "Microcontroller", qty: 1, unit: "pcs", price: 385, supplier: "Mouser", buyLink: "#", notes: "4MB Flash, 520KB SRAM" },
    { id: "bom1-2", name: "HLK-LD2410C Radar Sensor", partNumber: "HLK-LD2410C", category: "Sensor", qty: 1, unit: "pcs", price: 520, supplier: "Robocraze", buyLink: "#", notes: "24GHz mmWave presence detection" },
    { id: "bom1-3", name: "MCP1700-3302E LDO Regulator", partNumber: "MCP1700-3302E/TO", category: "Power IC", qty: 1, unit: "pcs", price: 45, supplier: "Digi-Key", buyLink: "#" },
    { id: "bom1-4", name: "100nF MLCC Capacitor 0402", partNumber: "GRM155R71C104K", category: "Passive", qty: 10, unit: "pcs", price: 5, supplier: "Mouser", buyLink: "#" },
    { id: "bom1-5", name: "10µF Tantalum Capacitor", partNumber: "TAJB106K016RNJ", category: "Passive", qty: 2, unit: "pcs", price: 30, supplier: "Mouser", buyLink: "#" },
    { id: "bom1-6", name: "WS2812B Mini RGB LED", partNumber: "WS2812B-Mini", category: "LED", qty: 1, unit: "pcs", price: 15, supplier: "Robocraze", buyLink: "#" },
    { id: "bom1-7", name: "Custom FR4 PCB 60×40mm", partNumber: "NL-PCB-001", category: "PCB", qty: 1, unit: "pcs", price: 450, supplier: "JLCPCB", buyLink: "#", notes: "2-layer, HASL finish, 1.6mm" },
    { id: "bom1-8", name: "USB-C Connector SMD", partNumber: "USB4105-GF-A", category: "Connector", qty: 1, unit: "pcs", price: 35, supplier: "Digi-Key", buyLink: "#" },
    { id: "bom1-9", name: "10kΩ 1% Resistor 0402", partNumber: "RC0402FR-0710KL", category: "Passive", qty: 5, unit: "pcs", price: 2, supplier: "Mouser", buyLink: "#" },
];

// BOM for Project 10: Open-Source Oscilloscope
export const bomProject10: BOMItem[] = [
    { id: "bom10-1", name: "STM32H750VBT6 MCU", partNumber: "STM32H750VBT6", category: "Microcontroller", qty: 1, unit: "pcs", price: 1200, supplier: "Digi-Key", buyLink: "#", notes: "480MHz Cortex-M7, 1MB Flash" },
    { id: "bom10-2", name: "AD9226 10-bit 65MSPS ADC", partNumber: "AD9226ARSZ-65", category: "ADC", qty: 2, unit: "pcs", price: 850, supplier: "Analog Devices", buyLink: "#" },
    { id: "bom10-3", name: "ILI9488 4\" TFT Display", partNumber: "TFT-4.0-480x320", category: "Display", qty: 1, unit: "pcs", price: 780, supplier: "AliExpress", buyLink: "#" },
    { id: "bom10-4", name: "OPA356AIDBVT Op-Amp", partNumber: "OPA356AIDBVT", category: "Analog IC", qty: 2, unit: "pcs", price: 120, supplier: "TI", buyLink: "#", notes: "200MHz GBWP, input stage" },
    { id: "bom10-5", name: "LM4040 2.048V Voltage Reference", partNumber: "LM4040A20IDBZR", category: "Voltage Ref", qty: 1, unit: "pcs", price: 65, supplier: "TI", buyLink: "#" },
    { id: "bom10-6", name: "BNC Connector PCB Mount", partNumber: "31-221-RFX", category: "Connector", qty: 2, unit: "pcs", price: 90, supplier: "Mouser", buyLink: "#" },
    { id: "bom10-7", name: "W25Q128 16MB Flash", partNumber: "W25Q128JVEIQ", category: "Memory", qty: 1, unit: "pcs", price: 95, supplier: "Mouser", buyLink: "#", notes: "SPI NOR Flash for waveform storage" },
    { id: "bom10-8", name: "Custom 4-Layer PCB", partNumber: "NL-OSC-PCB", category: "PCB", qty: 1, unit: "pcs", price: 1800, supplier: "JLCPCB", buyLink: "#", notes: "4-layer 2oz copper for analog sections" },
    { id: "bom10-9", name: "3.3V 2A Buck Converter Module", partNumber: "MP2307DN", category: "Power", qty: 1, unit: "pcs", price: 220, supplier: "Robocraze", buyLink: "#" },
    { id: "bom10-10", name: "12V 2A DC Barrel Jack", partNumber: "PJ-202A", category: "Connector", qty: 1, unit: "pcs", price: 20, supplier: "Robocraze", buyLink: "#" },
];

// Helper to get BOM by project id
export function getBOMByProjectId(projectId: number): BOMItem[] {
    if (projectId === 1) return bomProject1;
    if (projectId === 10) return bomProject10;
    // Fallback generic BOM for other projects
    return bomProject1;
}
