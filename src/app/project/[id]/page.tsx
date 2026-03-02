"use client";

import React, { use, useState, useEffect } from "react";
import {
  ArrowLeft, Download, GitFork, Star, Share2, ExternalLink,
  Cpu, Layers, Terminal as CodeIcon, MessageSquare, ChevronRight,
  ShoppingCart, Zap, ShieldCheck, AlertTriangle, Plus, Sun, Moon,
  ThumbsUp, Send, ChevronDown, Clock, Eye, Wrench, BookOpen,
  GitBranch, Award, Link2, Users, FlaskConical, CheckCircle2, Info,
  Search, Copy, Film, Youtube, Image as ImageIcon, X, Play,
  FileText, Package, Maximize2, Tv2, Cpu as ChipIcon, Globe
} from "lucide-react";
import { projects } from "@/mockData/projects";
import { getCommentsByProjectId, Comment } from "@/mockData/comments";
import { getBOMByProjectId } from "@/mockData/bom";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { motion, AnimatePresence } from "framer-motion";
import CircuitBackground from "@/components/ui/CircuitBackground";
import LiquidCursor from "@/components/ui/LiquidCursor";
import LiquidBlob from "@/components/ui/LiquidBlob";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ─── Comment Item ─── */
const CommentItem = ({ comment }: { comment: Comment }) => {
  const { isAuthenticated, user: authUser } = useAuthStore();
  const [upvotes, setUpvotes] = useState(comment.upvotes);
  const [upvoted, setUpvoted] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [localReplies, setLocalReplies] = useState(comment.replies);

  const timeAgo = (iso: string) => {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`;
  };

  const handleReplySubmit = () => {
    if (!isAuthenticated) {
      toast.error("Login Required", { description: "You need to be logged in to reply." });
      return;
    }
    if (!replyBody.trim()) return;

    const newReply = {
      id: `r-new-${Date.now()}`,
      authorId: authUser?.id ?? "guest",
      author: authUser?.username ?? "guest",
      avatar: authUser?.avatar ?? "https://i.pravatar.cc/100?u=guest",
      body: replyBody,
      createdAt: new Date().toISOString(),
      upvotes: 0
    };

    setLocalReplies(prev => [...prev, newReply]);
    setReplyBody("");
    setIsReplying(false);
    setShowReplies(true);
    toast.success("Reply posted");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="flex gap-5">
      <Link href={`/user/${comment.author}`} className="shrink-0">
        <img src={comment.avatar} alt={comment.author} className="w-10 h-10 rounded-full border-2 border-border hover:border-primary transition-all" />
      </Link>
      <div className="flex-1">
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-[20px] p-6">
          <div className="flex items-center gap-3 mb-3">
            <Link href={`/user/${comment.author}`} className="text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors">@{comment.author}</Link>
            <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">{comment.body}</p>
        </div>
        <div className="flex items-center gap-6 mt-3 ml-3">
          <button onClick={() => { setUpvoted(!upvoted); setUpvotes(p => upvoted ? p - 1 : p + 1); }}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${upvoted ? "text-primary scale-105" : "text-muted-foreground/50 hover:text-primary"}`}>
            <ThumbsUp size={13} className={upvoted ? "fill-primary" : ""} /> {upvotes}
          </button>

          <button onClick={() => setIsReplying(!isReplying)}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isReplying ? "text-primary" : "text-muted-foreground/50 hover:text-primary"}`}>
            <MessageSquare size={13} /> Reply
          </button>

          {localReplies.length > 0 && (
            <button onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-all">
              <ChevronDown size={12} className={`transition-transform ${showReplies ? "rotate-180" : ""}`} />
              {localReplies.length} {showReplies ? "Hide" : "Replies"}
            </button>
          )}
        </div>
        <AnimatePresence>
          {isReplying && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mt-4 pl-5 border-l-2 border-primary/20 overflow-hidden">
              <div className="flex gap-4 pt-2">
                <img src={authUser?.avatar ?? "https://i.pravatar.cc/100?u=guest"} className="w-8 h-8 rounded-full border border-border shrink-0" />
                <div className="flex-1 flex gap-2">
                  <input
                    autoFocus
                    value={replyBody}
                    onChange={e => setReplyBody(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 bg-card/40 border border-border rounded-xl px-4 text-sm outline-none focus:border-primary/50 transition-colors h-10"
                    onKeyDown={e => { if (e.key === 'Enter') handleReplySubmit(); }}
                  />
                  <Button variant="primary" onClick={handleReplySubmit} className="h-10 px-4 rounded-xl text-[10px] font-black uppercase"><Send size={14} /></Button>
                </div>
              </div>
            </motion.div>
          )}
          {showReplies && localReplies.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="mt-5 pl-5 border-l-2 border-primary/20 flex flex-col gap-5 overflow-hidden">
              {localReplies.map(r => (
                <div key={r.id} className="flex gap-4">
                  <Link href={`/user/${r.author}`} className="shrink-0">
                    <img src={r.avatar} alt={r.author} className="w-8 h-8 rounded-full border-2 border-border hover:border-primary transition-all" />
                  </Link>
                  <div className="flex-1 bg-card/40 border border-border/30 rounded-[16px] p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">@{r.author}</span>
                      <span className="text-[9px] text-muted-foreground/40 font-bold">{timeAgo(r.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">{r.body}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
// --- Build Steps Data (enriched) ---
type SafetyLevel = "ESD" | "Electrical" | "Thermal" | "Chemical" | "None";
interface BuildStep {
  step: number;
  phase: string;
  title: string;
  duration: string;
  difficulty: string;
  difficultyColor: string;
  status: string;
  text: string;
  substeps: string[];
  tips: string[];
  warnings: string[];
  testPoints: string[];
  images: string[];
  tools: string[];
  components: string[];
  safetyLevels: SafetyLevel[];
  timeBreakdown: { label: string; time: string }[];
  qualityChecks: string[];
  schematicRef: string;
  troubleshooting: { symptom: string; cause: string; fix: string }[];
}

const BUILD_STEPS: BuildStep[] = [
  {
    step: 1,
    phase: "Preparation",
    title: "Laboratory & Workspace Setup",
    duration: "15–30 min",
    difficulty: "Easy",
    difficultyColor: "text-emerald-500 bg-emerald-500/10",
    status: "required",
    text: "A clean, ESD-safe workspace is critical before any component handling. Electrostatic discharge is invisible but can permanently damage CMOS components — always ground yourself first.",
    substeps: [
      "Lay out anti-static mat and connect to ground via wrist strap",
      "Gather all BOM components and verify quantities against list",
      "Check component date codes — reject anything beyond shelf-life",
      "Prepare soldering station: tip tinned, temperature set per solder type",
      "Print or open the schematic on a second screen for reference",
      "Have isopropyl alcohol (≥99%) and flux remover ready",
    ],
    tips: [
      "Keep components in original ESD packaging until needed",
      "Use a dental mirror to verify hidden solder joints under ICs",
    ],
    warnings: ["Never work in socks on carpet — always ground yourself", "Do not use lead-free solder on components rated for leaded only"],
    testPoints: [],
    images: [
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    ],
    tools: ["ESD wrist strap", "Anti-static mat", "Tweezers (SS-SA)", "Magnifying glass / loupe", "Component organizer tray"],
    components: ["All BOM items — count & verify"],
    safetyLevels: ["ESD"],
    timeBreakdown: [{ label: "Workspace prep", time: "10 min" }, { label: "Component sort", time: "10 min" }, { label: "Tool calibration", time: "5 min" }],
    qualityChecks: [
      "Wrist strap continuity tests < 1 MΩ to ground",
      "All BOM quantities match — no missing parts",
      "Soldering iron at correct temperature for solder alloy",
      "Schematic available and legible on reference screen",
    ],
    schematicRef: "All sheets — full BOM cross-reference",
    troubleshooting: [
      { symptom: "Wrist strap continuity test fails", cause: "Broken snap socket or corroded contact", fix: "Replace strap; use temporary bench ground clip in the meantime" },
      { symptom: "Components missing from kit", cause: "Shipping damage or picking error", fix: "Cross-reference BOM, order replacements from Robu/Digi-Key; mark step incomplete" },
    ],
  },
  {
    step: 2,
    phase: "Power Stage",
    title: "Power Regulation & Decoupling",
    duration: "45–90 min",
    difficulty: "Intermediate",
    difficultyColor: "text-amber-500 bg-amber-500/10",
    status: "critical",
    text: "Always populate power stages first. A faulty supply rail will destroy every IC it powers. Take the extra time here — it saves hours of debugging later.",
    substeps: [
      "Solder all bulk capacitors (C1–C8) per silkscreen orientation",
      "Place voltage regulator IC(s) — observe thermal pad orientation",
      "Solder 100nF decoupling capacitors at each IC power pin",
      "Add ferrite beads on analog supply lines (see schematic notes)",
      "Install protection diodes (D1–D4) — double check cathode orientation",
      "Connect bench PSU (current-limited to 100mA) before any ICs",
      "Measure all supply rails: 3.3V ±1%, 5V ±2%, GND continuity",
    ],
    tips: [
      "Current-limit your bench PSU to ~100mA during first power-on to prevent catastrophic failure",
      "Add extra decoupling caps if you extend PCB traces beyond design",
    ],
    warnings: ["Reverse polarity on electrolytics WILL cause explosion — verify before soldering", "Do NOT power on with missing decoupling caps near high-switching ICs"],
    testPoints: ["TP1: 3.3V ±33mV", "TP2: 5.0V ±100mV", "TP3: GND < 0.1Ω to chassis"],
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80",
    ],
    tools: ["Soldering iron (Hakko FX-888D)", "Bench PSU (current-limited)", "Digital Multimeter (DMM)", "Tweezers", "Flux pen"],
    components: ["MCP1700-3302E LDO (U1)", "C1–C8 bulk caps", "100nF 0402 decoupling caps", "Protection diodes D1–D4", "Ferrite beads L1–L2"],
    safetyLevels: ["Electrical", "Thermal"],
    timeBreakdown: [{ label: "Cap placement", time: "20 min" }, { label: "LDO solder", time: "15 min" }, { label: "First power-on + measure", time: "15 min" }],
    qualityChecks: [
      "No electrolytic cap installed backwards (stripe = negative)",
      "3.3V rail: 3.267–3.333V under no load",
      "5V rail: 4.90–5.10V under no load",
      "GND continuity < 0.1Ω from PCB pad to banana jack",
      "PSU current draw < 30mA at idle (no ICs yet)",
    ],
    schematicRef: "Sheet 2 — Power Delivery Network (PDN)",
    troubleshooting: [
      { symptom: "3.3V rail reads 0V", cause: "LDO thermal pad not soldered or reverse polarity cap short", fix: "Reflow LDO pad; check electrolytic orientation with DMM diode mode" },
      { symptom: "Bench PSU hits current limit immediately", cause: "Short between VCC and GND — often a solder bridge on cap pads", fix: "Remove power, inspect under magnification; use solder wick to clear bridge" },
      { symptom: "3.3V rail oscillates / unstable", cause: "Missing or insufficient decoupling caps on LDO output", fix: "Add 10µF in parallel with existing output cap; keep leads as short as possible" },
    ],
  },
  {
    step: 3,
    phase: "Assembly",
    title: "Primary Component Placement",
    duration: "1–3 hrs",
    difficulty: "Advanced",
    difficultyColor: "text-orange-500 bg-orange-500/10",
    status: "critical",
    text: "Component placement order matters — work from smallest to tallest, and RF/analog-sensitive parts must go in last with minimal handling. Follow the placement notes in the schematic exactly.",
    substeps: [
      "Solder all 0402/0603 passive components using paste + hot air or iron",
      "Place main microcontroller / FPGA — use flux paste under QFP/BGA pads",
      "Reflow or hand-solder using the recommended temperature profile",
      "Inspect all joints under magnification — look for bridges and cold joints",
      "Solder connectors: USB, power jack, I/O headers (last — they take most heat)",
      "Attach any daughter boards or modules using the specified connectors",
      "Clean thoroughly with IPA + toothbrush; dry for 10 min",
    ],
    tips: [
      "Use a syringe with tacky flux for fine-pitch ICs — prevents bridges",
      "Hot air reflow: start at 150°C, ramp to 245°C at 2°C/sec, then cool slowly",
      "X-ray inspection is ideal for BGA packages — use a local PCB service if available",
    ],
    warnings: ["Never force connectors — inspect polarisation before insertion", "Chip-on-board components cannot withstand repeated reflow cycles"],
    testPoints: ["Check for shorts between adjacent pins on main IC using DMM continuity", "Verify no short between VCC and GND rails after full population"],
    images: [
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1601132359864-b6e73cec5e8e?auto=format&fit=crop&w=600&q=80",
    ],
    tools: ["Hot air rework station (858D)", "Soldering iron (fine tip)", "Solder paste (Sn63Pb37 or SAC305)", "Microscope / USB camera", "IPA + brush", "Vacuum pick tool"],
    components: ["ESP32-C3 SuperMini (U2)", "HLK-LD2410B Radar (U3)", "WS2812B LED (D6)", "USB-C Connector (J1)", "0.96\" OLED (J2)", "All 0402 passives (R1–R12, C9–C20)"],
    safetyLevels: ["ESD", "Thermal"],
    timeBreakdown: [{ label: "Passive 0402 placement", time: "45 min" }, { label: "Main IC reflow", time: "30 min" }, { label: "Inspection + clean", time: "20 min" }, { label: "Connectors", time: "15 min" }],
    qualityChecks: [
      "No solder bridges visible under 10× magnification on fine-pitch pads",
      "All passives sitting flat — no tombstoning",
      "ESP32 pin 1 dot aligned with PCB silkscreen indicator",
      "USB-C connector flush to PCB edge — no lifted pins",
      "Board cleaned — no flux residue under ICs",
      "Post-assembly short check: VCC-GND > 10Ω",
    ],
    schematicRef: "Sheet 1 — Main Logic Board (placement notes p.3)",
    troubleshooting: [
      { symptom: "IC pins bridged / shorted", cause: "Excess solder paste or hot air too close", fix: "Apply fresh flux, drag-solder with fine tip or use solder wick; re-inspect" },
      { symptom: "Component tombstoned (standing on end)", cause: "Uneven pad heating or unequal paste volumes", fix: "Apply flux, reflow with hot air; touch both pads simultaneously to re-level" },
      { symptom: "OLED not lighting after assembly", cause: "Reversed I2C SDA/SCL or power pin lifted", fix: "Check continuity from J2 to U2 GPIOs; reflow connector pins" },
    ],
  },
  {
    step: 4,
    phase: "Firmware",
    title: "Firmware Flash & Initial Boot",
    duration: "30–60 min",
    difficulty: "Intermediate",
    difficultyColor: "text-amber-500 bg-amber-500/10",
    status: "required",
    text: "With hardware verified, flash the firmware. The companion Python script handles dependency installation, port detection, and verification automatically.",
    substeps: [
      "Clone the firmware repo: git clone https://github.com/example/firmware",
      "Install dependencies: pip install -r requirements.txt",
      "Connect hardware via USB — verify device appears in port list",
      "Run flash script: python flash.py --port /dev/ttyUSB0 --verify",
      "Monitor serial output at 115200 baud for boot messages",
      "Confirm all peripherals enumerate in the startup log",
      "Run the built-in self-test: python test.py --full",
    ],
    tips: [
      "On Linux: add user to dialout group to avoid permission errors",
      "If flash fails, try pressing BOOT button while connecting USB",
      "Monitor power draw during boot — unexpected spikes indicate hardware faults",
    ],
    warnings: ["Never flash experimental firmware without a JTAG debug probe connected", "Bootloader corruption requires JTAG recovery — keep hardware debug access exposed"],
    testPoints: ["Serial console shows: [BOOT] All systems nominal", "LED heartbeat: 1 Hz blink indicates successful boot"],
    images: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80",
    ],
    tools: ["USB-C cable (data-capable)", "PC / laptop (Linux/macOS/Win WSL2)", "esptool.py v4.7+", "PlatformIO CLI 6.1+", "Serial terminal (minicom/screen/PuTTY)"],
    components: ["ESP32-C3 SuperMini (fully assembled board)"],
    safetyLevels: ["Electrical"],
    timeBreakdown: [{ label: "Env setup + clone", time: "10 min" }, { label: "Flash + verify", time: "5 min" }, { label: "Boot monitor + self-test", time: "15 min" }],
    qualityChecks: [
      "esptool detects chip: ESP32-C3 (revision v0.3+)",
      "Flash verify: 100% match — 0 errors",
      "Serial log: [BOOT] All systems nominal within 5s of power-on",
      "Wi-Fi association completes (SSID visible in router table)",
      "OLED shows startup splash within 3s",
      "LED heartbeat: steady 1 Hz blink",
    ],
    schematicRef: "GPIO Pinout Table — Appendix A",
    troubleshooting: [
      { symptom: "esptool: Failed to connect to ESP32", cause: "Device not in download mode or CH340 driver missing", fix: "Hold BOOT → press RESET → release BOOT; install CH340 driver if needed" },
      { symptom: "Flash verify errors", cause: "Unstable USB cable or insufficient 3.3V current", fix: "Try a different USB cable; ensure PSU supplies ≥500mA; slow --baud to 115200" },
      { symptom: "Serial monitor shows garbled output", cause: "Baud rate mismatch", fix: "Set terminal to 115200 8N1; ensure no hardware flow control enabled" },
    ],
  },
  {
    step: 5,
    phase: "Calibration",
    title: "Sensor Calibration & Tuning",
    duration: "20–45 min",
    difficulty: "Intermediate",
    difficultyColor: "text-amber-500 bg-amber-500/10",
    status: "required",
    text: "Sensor output varies by unit — calibration is not optional. The Python companion script guides you through a fully automated procedure with a reference standard.",
    substeps: [
      "Run calibration script: python calibrate.py --sensor all",
      "Follow on-screen prompts — position reference target as instructed",
      "Allow 3-minute thermal soak before recording baseline readings",
      "Adjust trim potentiometers (if any) to center readings in nominal range",
      "Record calibration constants — save to NVM: python calibrate.py --save",
      "Verify calibration by running the test suite against known inputs",
    ],
    tips: [
      "Perform calibration at operating temperature — cold calibration drifts significantly",
      "Store calibration constants in version control alongside firmware",
    ],
    warnings: ["Re-calibrate after any rework or component replacement", "Environmental drift: re-calibrate if ambient temp changes by >10°C"],
    testPoints: ["Sensor reading within ±2% of reference standard", "Noise floor < 3 LSB RMS at idle"],
    images: [
      "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    ],
    tools: ["Reference target (specified in calibration guide)", "Thermometer (ambient temp logging)", "Serial terminal", "Oscilloscope (optional — for ADC noise floor)"],
    components: ["HLK-LD2410B Radar (U3)", "Trim potentiometer RV1 (if populated)"],
    safetyLevels: ["None"],
    timeBreakdown: [{ label: "Thermal soak", time: "3 min" }, { label: "Baseline capture", time: "5 min" }, { label: "Reference cal + NVM save", time: "15 min" }, { label: "Verification suite", time: "10 min" }],
    qualityChecks: [
      "Baseline reading stable ±0.5% over 60-second window",
      "Full-scale reading within ±2% of reference target value",
      "Noise floor < 3 LSB RMS measured over 1000 samples",
      "NVM write confirmed: calibrate.py reports SAVED OK",
      "Calibration constants committed to git",
    ],
    schematicRef: "Sheet 1 — Radar sensor circuit (LD2410B, pins UART_TX, UART_RX)",
    troubleshooting: [
      { symptom: "Calibration script exits with 'sensor timeout'", cause: "UART baud mismatch or sensor not powered", fix: "Check 5V on VCC pin of LD2410B; verify UART baud matches firmware (256000)" },
      { symptom: "Reading drifts after thermal soak", cause: "Insufficient warm-up time or PCB layout issue", fix: "Extend soak to 10 min; check thermal coupling between LDO and sensor" },
      { symptom: "Noise floor > 3 LSB", cause: "ADC reference noise or missing decoupling cap", fix: "Add 100nF cap at AVDD pin; run calibration with motor/fan stopped" },
    ],
  },
  {
    step: 6,
    phase: "Validation",
    title: "Full System Test & Documentation",
    duration: "1–2 hrs",
    difficulty: "Advanced",
    difficultyColor: "text-orange-500 bg-orange-500/10",
    status: "required",
    text: "Systematic testing against documented acceptance criteria confirms the build is successful. Log all results — your build log becomes invaluable when troubleshooting or sharing with the community.",
    substeps: [
      "Run the full automated test suite: python test.py --report",
      "Manually test all physical interfaces (buttons, connectors, LEDs)",
      "Perform a 4-hour burn-in test at maximum operating load",
      "Measure and log current draw at idle, active, and peak",
      "Document any deviations from reference measurements",
      "Photograph finished assembly — submit to project gallery",
      "Post your build log as a comment to help future builders",
    ],
    tips: [
      "Run burn-in inside an enclosure at expected operating temperature",
      "Compare your measurements to the reference table in the project notes",
      "Share your results — every build data point helps improve the design",
    ],
    warnings: ["Do not skip burn-in — intermittent failures only surface under sustained load", "Report any consistent deviations in the project comments — could indicate a design errata"],
    testPoints: ["All automated tests: PASS", "Idle current: matches reference ±15%", "No errors in 4-hour burn-in log"],
    images: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581092780119-e9d7a4e69f7a?auto=format&fit=crop&w=600&q=80",
    ],
    tools: ["Bench PSU (current + voltage logging)", "Oscilloscope (signal integrity)", "Camera / phone (documentation)", "Thermal camera (optional — hotspot detection)", "Python test suite"],
    components: ["Fully assembled and calibrated board"],
    safetyLevels: ["Electrical", "Thermal"],
    timeBreakdown: [{ label: "Automated test suite", time: "15 min" }, { label: "Manual interface test", time: "20 min" }, { label: "Burn-in (4h)", time: "4 hrs" }, { label: "Current measurement + docs", time: "20 min" }],
    qualityChecks: [
      "test.py --report: 0 failures, 0 errors",
      "Idle current: 45–65mA @ 3.3V (reference: 52mA)",
      "Active current: 90–130mA @ 3.3V (reference: 112mA)",
      "Peak current: < 250mA @ 3.3V",
      "No component hotspot > 85°C under IR camera",
      "4-hour burn-in: 0 resets, 0 communication timeouts",
      "Build photos uploaded to project gallery",
    ],
    schematicRef: "Test Points Map — Appendix B (all TP1–TP8 locations)",
    troubleshooting: [
      { symptom: "Unit resets during burn-in", cause: "Overtemperature protection or watchdog triggered by task overrun", fix: "Log reset reason via Serial; check thermal imaging for hotspot; update stack size if needed" },
      { symptom: "Current draw 30%+ above reference", cause: "Floating GPIO pulling excess current or inefficient sleep mode", fix: "Audit GPIO configuration; ensure unused pins are set to INPUT_PULLDOWN" },
      { symptom: "Automated test reports UART timeout", cause: "Radar sensor not responding after 4h warm up", fix: "Implement UART retry in firmware; check cable strain between sensor and board" },
    ],
  },
];

// Safety badge styling
const SAFETY_COLORS: Record<SafetyLevel, string> = {
  ESD: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  Electrical: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  Thermal: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  Chemical: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  None: "bg-muted text-muted-foreground border-border",
};

function BuildStepsTab({ level, onPostBuildLog }: { level: string; onPostBuildLog: () => void }) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [completedSubsteps, setCompletedSubsteps] = useState<Record<number, Set<number>>>({});
  const [checkedQuality, setCheckedQuality] = useState<Record<number, Set<number>>>({});
  const [expandedTrouble, setExpandedTrouble] = useState<number | null>(null);
  const [phaseFilter, setPhaseFilter] = useState("All");

  const phases = ["All", ...Array.from(new Set(BUILD_STEPS.map(s => s.phase)))];
  const visibleSteps = phaseFilter === "All" ? BUILD_STEPS : BUILD_STEPS.filter(s => s.phase === phaseFilter);

  const toggleSubstep = (step: number, sub: number) => {
    setCompletedSubsteps(prev => {
      const set = new Set(prev[step] ?? []);
      set.has(sub) ? set.delete(sub) : set.add(sub);
      return { ...prev, [step]: set };
    });
  };

  const toggleQuality = (step: number, idx: number) => {
    setCheckedQuality(prev => {
      const set = new Set(prev[step] ?? []);
      set.has(idx) ? set.delete(idx) : set.add(idx);
      return { ...prev, [step]: set };
    });
  };

  const totalSubsteps = BUILD_STEPS.reduce((a, s) => a + s.substeps.length, 0);
  const doneSubsteps = Object.values(completedSubsteps).reduce((a, s) => a + s.size, 0);
  const progressPct = Math.round((doneSubsteps / totalSubsteps) * 100);

  const totalQuality = BUILD_STEPS.reduce((a, s) => a + s.qualityChecks.length, 0);
  const doneQuality = Object.values(checkedQuality).reduce((a, s) => a + s.size, 0);

  return (
    <div className="space-y-6">

      {/* ── Header Stats ── */}
      <div className="p-7 rounded-3xl bg-card border border-border shadow-md">
        <div className="flex flex-wrap items-center gap-8">
          {/* Progress bar */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Build Progress</span>
              <span className="text-sm font-black text-primary">{progressPct}%</span>
            </div>
            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 font-bold">{doneSubsteps} of {totalSubsteps} sub-tasks · {doneQuality} of {totalQuality} QC checks</p>
          </div>
          {/* Stats */}
          <div className="flex flex-wrap gap-8 text-center">
            {[
              { label: "Total Steps", value: BUILD_STEPS.length.toString() },
              { label: "Est. Time", value: "4–8 hrs" },
              { label: "Difficulty", value: level },
              { label: "QC Checks", value: totalQuality.toString() },
              { label: "Version", value: "v1.0.0" },
            ].map(m => (
              <div key={m.label}>
                <p className="text-lg font-black">{m.value}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 text-xs font-black uppercase tracking-widest transition-all">
            <Download size={14} /> Print Guide
          </button>
        </div>
      </div>

      {/* ── Phase Filter ── */}
      <div className="flex gap-2 flex-wrap">
        {phases.map(ph => (
          <button key={ph} onClick={() => setPhaseFilter(ph)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${phaseFilter === ph ? "bg-foreground text-background shadow" : "bg-muted/40 border border-border text-muted-foreground hover:text-foreground"}`}>
            {ph}
            {ph !== "All" && (
              <span className="ml-2 text-[9px] opacity-60">
                {BUILD_STEPS.filter(s => s.phase === ph).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Steps ── */}
      <div className="space-y-4">
        {visibleSteps.map(s => {
          const isOpen = expandedStep === s.step;
          const done = completedSteps.has(s.step);
          const subDone = completedSubsteps[s.step]?.size ?? 0;
          const subTotal = s.substeps.length;
          const qDone = checkedQuality[s.step]?.size ?? 0;
          const qTotal = s.qualityChecks.length;

          return (
            <div key={s.step} className={`rounded-3xl border transition-all duration-300 overflow-hidden ${done ? "border-emerald-500/40 bg-emerald-500/5" : "border-border bg-card"}`}>
              {/* Step header */}
              <button onClick={() => setExpandedStep(isOpen ? null : s.step)} className="w-full flex items-center gap-5 p-6 text-left group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 transition-all ${done ? "bg-emerald-500 text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"}`}>
                  {done ? <CheckCircle2 size={22} /> : s.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground">{s.phase}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${s.difficultyColor}`}>{s.difficulty}</span>
                    {s.status === "critical" && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500">Critical</span>}
                    {/* Safety badges */}
                    {s.safetyLevels.filter(sl => sl !== "None").map(sl => (
                      <span key={sl} className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${SAFETY_COLORS[sl]}`}>{sl}</span>
                    ))}
                  </div>
                  <h4 className="text-base font-black tracking-tight group-hover:text-primary transition-colors">{s.title}</h4>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold"><Clock size={11} /> {s.duration}</span>
                    <span className="text-[10px] text-muted-foreground font-bold">{subDone}/{subTotal} tasks</span>
                    <span className="text-[10px] text-muted-foreground font-bold">{qDone}/{qTotal} QC</span>
                    {subDone > 0 && (
                      <div className="flex-1 max-w-[80px] h-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(subDone / subTotal) * 100}%` }} />
                      </div>
                    )}
                  </div>
                </div>
                <ChevronDown size={18} className={`text-muted-foreground shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="px-6 pb-8 space-y-7 border-t border-border/60">

                  {/* Overview text */}
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed pt-6">{s.text}</p>

                  {/* ── Two-col: Tools + Time breakdown ── */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tools */}
                    <div className="p-5 rounded-2xl bg-muted/30 border border-border">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-3 flex items-center gap-2">
                        <Wrench size={12} /> Tools Required
                      </h5>
                      <ul className="space-y-1.5">
                        {s.tools.map((t, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Time breakdown */}
                    <div className="p-5 rounded-2xl bg-muted/30 border border-border">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-3 flex items-center gap-2">
                        <Clock size={12} /> Time Breakdown
                      </h5>
                      <div className="space-y-2">
                        {s.timeBreakdown.map((tb, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="flex-1 text-xs font-medium">{tb.label}</div>
                            <span className="text-xs font-black font-mono text-primary">{tb.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── Components involved + Schematic ref ── */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2"><ShoppingCart size={11} /> Components Used</h5>
                      <div className="flex flex-wrap gap-2">
                        {s.components.map((c, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-black text-primary">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-2 flex items-center gap-2"><Cpu size={11} /> Schematic Reference</h5>
                      <p className="text-xs font-medium text-muted-foreground">{s.schematicRef}</p>
                    </div>
                  </div>

                  {/* ── Sub-tasks ── */}
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 mb-3 flex items-center gap-2">
                      <div className="w-1 h-4 bg-primary rounded-full" /> Sub-tasks
                    </h5>
                    <div className="space-y-2">
                      {s.substeps.map((sub, i) => {
                        const isDone = completedSubsteps[s.step]?.has(i) ?? false;
                        return (
                          <label key={i} className={`flex items-start gap-3 p-3.5 rounded-2xl cursor-pointer transition-all border ${isDone ? "bg-emerald-500/5 border-emerald-500/30" : "border-border hover:border-primary/40 hover:bg-muted/40"}`}>
                            <input type="checkbox" checked={isDone} onChange={() => toggleSubstep(s.step, i)} className="mt-0.5 accent-emerald-500 shrink-0" />
                            <span className={`text-sm font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}>{sub}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── Tips & Warnings ── */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {s.tips.length > 0 && (
                      <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2"><Zap size={13} /> Pro Tips</h5>
                        <ul className="space-y-2">
                          {s.tips.map((t, i) => <li key={i} className="text-xs text-muted-foreground font-medium leading-relaxed flex gap-2"><span className="text-primary mt-0.5 shrink-0">›</span>{t}</li>)}
                        </ul>
                      </div>
                    )}
                    {s.warnings.length > 0 && (
                      <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2"><AlertTriangle size={13} /> Warnings</h5>
                        <ul className="space-y-2">
                          {s.warnings.map((w, i) => <li key={i} className="text-xs text-amber-600/80 dark:text-amber-400/80 font-medium leading-relaxed flex gap-2"><span className="shrink-0 mt-0.5">⚠</span>{w}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* ── Test Points ── */}
                  {s.testPoints.length > 0 && (
                    <div className="p-5 rounded-2xl bg-muted/50 border border-border">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground/60 mb-3 flex items-center gap-2"><FlaskConical size={13} /> Test Points / Acceptance Criteria</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {s.testPoints.map((tp, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-mono font-bold p-2 rounded-lg bg-card border border-border">
                            <span className="text-emerald-500">✓</span>{tp}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── QC Checklist ── */}
                  {s.qualityChecks.length > 0 && (
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 mb-3 flex items-center gap-2">
                        <CheckCircle2 size={12} /> Quality Checks
                        <span className="ml-auto text-primary font-black">{qDone}/{qTotal}</span>
                      </h5>
                      <div className="space-y-2">
                        {s.qualityChecks.map((qc, i) => {
                          const checked = checkedQuality[s.step]?.has(i) ?? false;
                          return (
                            <label key={i} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${checked ? "bg-emerald-500/5 border-emerald-500/30" : "border-border hover:bg-muted/30"}`}>
                              <input type="checkbox" checked={checked} onChange={() => toggleQuality(s.step, i)} className="mt-0.5 accent-emerald-500 shrink-0" />
                              <span className={`text-xs font-medium ${checked ? "line-through text-muted-foreground" : ""}`}>{qc}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── Troubleshooting ── */}
                  <div>
                    <button
                      onClick={() => setExpandedTrouble(expandedTrouble === s.step ? null : s.step)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500/80 hover:text-rose-500 transition-colors mb-3">
                      <AlertTriangle size={12} />
                      If Something Goes Wrong
                      <ChevronDown size={12} className={`transition-transform ${expandedTrouble === s.step ? "rotate-180" : ""}`} />
                    </button>
                    {expandedTrouble === s.step && (
                      <div className="space-y-3">
                        {s.troubleshooting.map((tr, i) => (
                          <div key={i} className="rounded-2xl border border-rose-500/20 bg-rose-500/5 overflow-hidden">
                            <div className="px-5 py-3 bg-rose-500/10 border-b border-rose-500/20">
                              <p className="text-xs font-black text-rose-500">⚡ {tr.symptom}</p>
                            </div>
                            <div className="px-5 py-3 grid sm:grid-cols-2 gap-3">
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">Likely Cause</p>
                                <p className="text-xs font-medium text-muted-foreground">{tr.cause}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500/70 mb-1">Fix</p>
                                <p className="text-xs font-medium">{tr.fix}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── Reference images ── */}
                  <div className="grid grid-cols-2 gap-4">
                    {s.images.map((img, i) => (
                      <div key={i} className="aspect-video rounded-2xl bg-muted border border-border overflow-hidden group/img">
                        <img src={img} alt={`Step ${s.step} ref ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" />
                      </div>
                    ))}
                  </div>

                  {/* ── Mark complete ── */}
                  <button
                    onClick={() => setCompletedSteps(prev => { const s2 = new Set(prev); s2.has(s.step) ? s2.delete(s.step) : s2.add(s.step); return s2; })}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border ${done ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500" : "border-border hover:border-primary/50 hover:text-primary"}`}>
                    <CheckCircle2 size={17} />
                    {done ? "Marked Complete — Click to Undo" : "Mark Step Complete"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer: Errata + Revision ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="p-6 rounded-3xl bg-card border border-border shadow-md">
          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 mb-4 flex items-center gap-2"><div className="w-1 h-4 bg-rose-500 rounded-full" /> Known Errata</h5>
          <div className="space-y-3">
            {[
              { id: "ERR-001", text: "R12 footprint silkscreen reversed — see BOM note", fixed: false },
              { id: "ERR-002", text: "Firmware v0.9.x: watchdog timer bug — update to v1.0+", fixed: true },
            ].map(e => (
              <div key={e.id} className={`flex items-start gap-3 p-3 rounded-xl border text-xs font-medium ${e.fixed ? "border-emerald-500/20 bg-emerald-500/5 text-muted-foreground line-through" : "border-rose-500/20 bg-rose-500/5"}`}>
                <span className={`font-black shrink-0 ${e.fixed ? "text-emerald-500" : "text-rose-500"}`}>{e.id}</span>
                {e.text}
                {e.fixed && <span className="ml-auto text-emerald-500 font-black no-underline">[Fixed]</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-card border border-border shadow-md">
          <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/60 mb-4 flex items-center gap-2"><div className="w-1 h-4 bg-primary rounded-full" /> Revision History</h5>
          <div className="space-y-3">
            {[
              { ver: "v1.0.0", date: "Jan 2026", note: "Initial public release" },
              { ver: "v0.9.0", date: "Dec 2025", note: "Beta — watchdog bug fixed" },
              { ver: "v0.8.0", date: "Nov 2025", note: "Internal prototype" },
            ].map(v => (
              <div key={v.ver} className="flex items-center gap-3 text-xs">
                <span className="font-black text-primary w-14 shrink-0">{v.ver}</span>
                <span className="text-muted-foreground">{v.note}</span>
                <span className="ml-auto text-muted-foreground/50 font-bold shrink-0">{v.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Community CTA ── */}
      <div className="p-6 rounded-3xl border border-primary/20 bg-primary/5 flex items-center gap-5">
        <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0"><Users size={22} /></div>
        <div className="flex-1">
          <h5 className="font-black text-sm mb-1">Finished your build?</h5>
          <p className="text-xs text-muted-foreground font-medium">Share your photos, measurements, and any deviations in the comments — every build log makes this project better for everyone.</p>
        </div>
        <button onClick={onPostBuildLog} className="shrink-0 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all">
          Post Build Log
        </button>
      </div>
    </div>
  );
}







/* ─── Main Page ─── */
export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = use(params);
  const router = useRouter();
  const { isDark, toggle } = useThemeStore();
  const { isAuthenticated, user: authUser } = useAuthStore();
  const project = projects.find(p => p.id === parseInt(id));
  const [activeTab, setActiveTab] = useState("overview");
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(project?.stars ?? 0);
  const [scrolled, setScrolled] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [comments, setComments] = useState(() => project ? getCommentsByProjectId(project.id) : []);
  const bom = project ? getBOMByProjectId(project.id) : [];

  // Tab-specific state variables moved to top level to comply with React Rules of Hooks
  const [bomFilter, setBomFilter] = useState("All");
  const [bomSearch, setBomSearch] = useState("");
  const [schTab, setSchTab] = useState<"diagrams" | "stackup" | "rules" | "downloads">("diagrams");
  const [codeFile, setCodeFile] = useState("main");
  const [codePanel, setCodePanel] = useState<"deps" | "build" | "env" | "tests">("deps");
  const [mediaSection, setMediaSection] = useState<"gallery" | "videos" | "simulation" | "buildlog" | "community" | "files">("gallery");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!project) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "dark bg-background" : "bg-background"}`}>
        <div className="text-center p-12 rounded-[32px] bg-card border border-border shadow-2xl max-w-md w-full">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-8 border border-border">
            <AlertTriangle size={40} className="text-amber-500" />
          </div>
          <h1 className="text-4xl font-black mb-4 font-display">404</h1>
          <p className="text-muted-foreground mb-10 font-medium">This artifact does not exist in our lab records.</p>
          <Button fullWidth variant="primary" onClick={() => router.push("/explore")} className="h-14 rounded-2xl font-black uppercase tracking-widest">Return to Explore</Button>
        </div>
      </div>
    );
  }

  const handleReplicate = () => {
    const tid = toast.loading("Connecting to Lab Node…");
    setTimeout(() => {
      toast.success("Artifacts Synced", { id: tid, description: `Build Guide for ${project.title} is ready.`, action: { label: "Download", onClick: () => { } } });
    }, 2000);
  };

  const handleStar = () => {
    setIsStarred(!isStarred);
    setStarCount(p => isStarred ? p - 1 : p + 1);
    toast.success(isStarred ? "Removed from Library" : "Project Starred!", {
      description: isStarred ? `Removed ${project.title}` : `Added to your library.`,
    });
  };

  const handleFork = () => toast.success("Workspace Created", { description: `Forked ${project.title} to your lab.` });
  const handleShare = () => toast.info("Link Copied", { description: "Sharing link copied to clipboard." });

  const handlePostComment = () => {
    if (!isAuthenticated) {
      toast.error("Login Required", { description: "You need to be logged in to post a comment.", action: { label: "Login", onClick: () => router.push("/login") } });
      return;
    }
    if (!commentBody.trim()) return;
    const newComment = {
      id: `c-new-${Date.now()}`,
      projectId: project.id,
      authorId: authUser?.id ?? "user-1",
      author: authUser?.username ?? "bhavya_dev",
      avatar: authUser?.avatar ?? "https://i.pravatar.cc/100?u=user1",
      body: commentBody.trim(),
      upvotes: 0,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    setComments(prev => [newComment, ...prev]);
    setCommentBody("");
    toast.success("Comment Posted", { description: "Your transmission has been added." });
  };

  const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
  const bomTotal = bom.reduce((sum, i) => sum + i.price * i.qty, 0);

  const tabs = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "bom", label: "Bill of Materials", icon: ShoppingCart },
    { id: "schematics", label: "Schematics", icon: Cpu },
    { id: "steps", label: "Build Steps", icon: Zap },
    { id: "code", label: "Code", icon: CodeIcon },
    { id: "media", label: "Media", icon: Film },
  ];

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden selection:bg-primary/30 transition-colors duration-700">
        <CircuitBackground />
        <LiquidBlob />
        <LiquidCursor />

        {/* Header */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 flex justify-center px-4 md:px-8 ${scrolled ? "py-4" : "py-8"}`}>
          <div className={`w-full max-w-7xl flex items-center justify-between px-6 md:px-10 transition-all duration-700 ${scrolled ? "h-16 rounded-full bg-card/80 backdrop-blur-3xl border border-border shadow-2xl" : "h-20 rounded-[32px] bg-card/40 backdrop-blur-xl border border-border/50"}`}>
            <div className="flex items-center gap-5">
              <button onClick={() => router.push("/explore")} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="hidden sm:block"><Logo size="sm" /></div>
            </div>
            <div className="flex-1 max-w-lg mx-8 hidden lg:flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">System ID: NL-LAB-{project.id.toString().padStart(4, "0")}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggle} className="p-3 rounded-full bg-muted/50 border border-border text-muted-foreground hover:text-primary transition-all group">
                {isDark ? <Sun size={17} className="group-hover:rotate-45 transition-transform" /> : <Moon size={17} className="group-hover:-rotate-12 transition-transform" />}
              </button>
              <div className="h-5 w-px bg-border/50 mx-1 hidden sm:block" />
              <Button variant="ghost" icon={<Share2 size={15} />} onClick={handleShare} className="h-11 rounded-full px-5 uppercase text-[10px] font-black tracking-widest hidden sm:flex border border-border bg-muted/30">Share</Button>
              <Button variant="primary" icon={<Download size={15} />} onClick={handleReplicate} className="h-11 rounded-full px-7 uppercase text-[10px] font-black tracking-widest shadow-lg shadow-primary/20">Replicate</Button>
            </div>
          </div>
        </header>

        <main className="relative z-10 pt-40 pb-32 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative aspect-[16/10] rounded-[48px] overflow-hidden border border-border shadow-3xl group">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 flex gap-3">
                  <span className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-2xl border border-white/10 ${project.categoryStyles}`}>{project.category}</span>
                  <span className="px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-2xl border border-white/10 bg-black/40 text-white">{project.level}</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col justify-center">
                <Link href={`/user/${project.author}`} className="inline-flex items-center gap-3 mb-8 p-3 pr-5 rounded-2xl bg-muted/30 border border-border w-fit hover:border-primary/50 transition-all group">
                  <div className="relative">
                    <img src={project.authorAvatar} className="w-11 h-11 rounded-full border-2 border-border group-hover:border-primary transition-all" alt={project.author} />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-foreground">@{project.author}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Core Contributor</p>
                  </div>
                </Link>

                <h1 className="text-4xl md:text-6xl font-black font-display text-foreground mb-6 leading-[1.1] tracking-tight">{project.title}</h1>
                <p className="text-lg text-muted-foreground mb-10 font-medium leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-10 mb-14">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Stars</span>
                    <span className={`text-3xl font-black flex items-center gap-2 ${isStarred ? "text-amber-500" : "text-foreground"}`}>
                      <Star size={22} className={isStarred ? "fill-amber-500" : ""} /> {fmt(starCount)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Forks</span>
                    <span className="text-3xl font-black flex items-center gap-2"><GitFork size={22} /> {fmt(project.forks)}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Views</span>
                    <span className="text-3xl font-black flex items-center gap-2"><Eye size={22} /> {fmt(project.views)}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Comments</span>
                    <span className="text-3xl font-black flex items-center gap-2"><MessageSquare size={22} /> {comments.length}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-5">
                  <Button variant={isStarred ? "secondary" : "primary"} onClick={handleStar} icon={<Star size={18} className={isStarred ? "fill-amber-500 text-amber-500" : ""} />} className="px-8 h-14 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/10">
                    {isStarred ? "Starred" : "Star Artifact"}
                  </Button>
                  <Button variant="ghost" icon={<GitFork size={18} />} onClick={handleFork} className="px-8 h-14 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] border border-border bg-muted/30 shadow-xl">
                    Fork
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Tab Navigation */}
            <div className="sticky top-24 z-40 mb-16 flex justify-center">
              <div className="p-2 bg-card border border-border/80 rounded-[32px] shadow-xl overflow-x-auto hide-scrollbar">
                <div className="flex gap-1.5">
                  {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-7 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.18em] transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                        ? "bg-foreground text-background shadow-lg scale-[1.03]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}>
                      <tab.icon size={16} /> {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="min-h-[500px]">

                {/* ── Overview ── */}
                {activeTab === "overview" && (() => {
                  const levelColors: Record<string, string> = {
                    Beginner: "bg-emerald-500", Intermediate: "bg-amber-500",
                    Advanced: "bg-orange-500", Expert: "bg-rose-500"
                  };
                  const levelWidth: Record<string, string> = {
                    Beginner: "25%", Intermediate: "50%", Advanced: "75%", Expert: "100%"
                  };
                  const buildTime: Record<string, string> = {
                    Beginner: "2–4 hrs", Intermediate: "8–16 hrs",
                    Advanced: "2–4 days", Expert: "1–2 weeks"
                  };
                  const prerequisites: Record<string, string[]> = {
                    Beginner: ["Basic soldering", "Breadboard familiarity"],
                    Intermediate: ["PCB design basics", "Firmware flashing", "Multimeter usage"],
                    Advanced: ["Embedded C/C++", "Oscilloscope proficiency", "Hardware debugging", "PCB layout"],
                    Expert: ["HDL design", "Signal integrity", "EDA tools", "Process technology", "Formal verification"]
                  };
                  const tools: Record<string, string[]> = {
                    Beginner: ["Soldering iron", "Wire strippers", "USB programmer"],
                    Intermediate: ["Soldering station", "Multimeter", "USB logic analyzer", "Hot air rework"],
                    Advanced: ["Oscilloscope", "SMD rework station", "Logic analyzer", "Bench PSU", "Spectrum analyzer"],
                    Expert: ["EDA workstation", "JTAG debugger", "Lab oscilloscope", "VNA", "Die prober"]
                  };
                  const lvl = project.level ?? "Intermediate";
                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                      {/* ── Left Column (main content) ── */}
                      <div className="lg:col-span-2 space-y-12">

                        {/* Project Mission */}
                        <section>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-primary rounded-full" />
                            <h3 className="text-2xl font-black font-display tracking-tight">Project Mission</h3>
                          </div>
                          <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-7">
                            {project.description}
                          </p>
                          <div className="p-7 rounded-3xl bg-muted/50 border border-border flex items-start gap-6">
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shrink-0">
                              <ShieldCheck size={24} />
                            </div>
                            <div>
                              <h5 className="text-base font-black mb-1.5">Lab Certified Design</h5>
                              <p className="text-sm text-muted-foreground font-medium leading-relaxed">Stress-tested across multiple revisions. All known errata documented in build steps.</p>
                            </div>
                          </div>
                        </section>

                        {/* Prerequisites */}
                        <section>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-accent rounded-full" />
                            <h3 className="text-2xl font-black font-display tracking-tight">Prerequisites</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-5 font-medium">Before starting this project, you should be comfortable with:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(prerequisites[lvl] ?? prerequisites.Intermediate).map(p => (
                              <div key={p} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all group">
                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                <span className="text-sm font-bold">{p}</span>
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* Tools Required */}
                        <section>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-primary rounded-full" />
                            <h3 className="text-2xl font-black font-display tracking-tight">Tools Required</h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {(tools[lvl] ?? tools.Intermediate).map(t => (
                              <div key={t} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
                                <Wrench size={15} className="text-primary shrink-0" />
                                <span className="text-sm font-bold">{t}</span>
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* Technical Objectives */}
                        <section>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-primary rounded-full" />
                            <h3 className="text-2xl font-black font-display tracking-tight">Technical Objectives</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              "Open-source hardware & firmware",
                              "Reproducible BOM-sourced build",
                              "Step-by-step documented assembly",
                              "Community-reviewed schematics",
                              "Modular & extensible architecture",
                              "Test coverage with pass/fail criteria"
                            ].map(obj => (
                              <div key={obj} className="p-4 rounded-2xl border border-border flex items-center gap-4 bg-card hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:scale-110 transition-transform">
                                  <ChevronRight size={15} />
                                </div>
                                <span className="text-sm font-black uppercase tracking-widest">{obj}</span>
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* Design Decisions */}
                        <section>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-accent rounded-full" />
                            <h3 className="text-2xl font-black font-display tracking-tight">Design Decisions</h3>
                          </div>
                          <div className="space-y-4">
                            {[
                              { q: "Why this architecture?", a: "Chosen for its balance of performance, availability, and community support. Alternatives were benchmarked and documented in the project logs." },
                              { q: "Component selection rationale", a: "All key components are sourced from at least two distributors. Drop-in alternatives are listed in the BOM for supply chain resilience." },
                              { q: "Known tradeoffs", a: "Higher power consumption vs. cheaper alternative considered acceptable for this use case. Future revision planned to address this." }
                            ].map(d => (
                              <details key={d.q} className="group border border-border rounded-2xl bg-card overflow-hidden">
                                <summary className="flex items-center justify-between p-5 cursor-pointer font-black text-sm uppercase tracking-widest list-none hover:bg-muted/40 transition-colors">
                                  <span className="flex items-center gap-3"><Info size={15} className="text-primary" />{d.q}</span>
                                  <ChevronDown size={15} className="text-muted-foreground group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="px-5 pb-5 pt-2 text-sm text-muted-foreground font-medium leading-relaxed border-t border-border">{d.a}</div>
                              </details>
                            ))}
                          </div>
                        </section>

                      </div>

                      {/* ── Right Sidebar ── */}
                      <div className="space-y-6">

                        {/* Project Vitals */}
                        <div className="p-7 rounded-3xl bg-card border border-border shadow-md">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.35em] text-foreground/60 mb-5 flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-primary rounded-full" /> Project Vitals
                          </h4>
                          <div className="space-y-4">
                            {/* Difficulty */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Difficulty</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${lvl === "Beginner" ? "bg-emerald-500/10 text-emerald-500" :
                                  lvl === "Intermediate" ? "bg-amber-500/10 text-amber-500" :
                                    lvl === "Advanced" ? "bg-orange-500/10 text-orange-500" :
                                      "bg-rose-500/10 text-rose-500"
                                  }`}>{lvl}</span>
                              </div>
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${levelColors[lvl] ?? "bg-primary"}`}
                                  style={{ width: levelWidth[lvl] ?? "50%" }} />
                              </div>
                            </div>
                            {/* Vitals grid */}
                            {[
                              { label: "Build Time", value: buildTime[lvl] ?? "~1 week", icon: Clock },
                              { label: "Category", value: project.category, icon: Cpu },
                              { label: "Stars", value: project.stars.toLocaleString(), icon: Star },
                              { label: "Forks", value: project.forks.toString(), icon: GitBranch },
                              { label: "Views", value: project.views.toLocaleString(), icon: Eye },
                              { label: "Version", value: "v1.0.0", icon: Award },
                              { label: "License", value: "MIT", icon: BookOpen },
                            ].map(({ label, value, icon: Icon }) => (
                              <div key={label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                  <Icon size={13} /> {label}
                                </span>
                                <span className="text-sm font-black">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="p-7 rounded-3xl bg-card border border-border shadow-md">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.35em] text-foreground/60 mb-5 flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-primary rounded-full" /> Tech Stack
                          </h4>
                          <div className="flex flex-wrap gap-2.5">
                            {project.tags.map(tag => (
                              <span key={tag} className="px-3.5 py-2 rounded-xl bg-foreground/[0.07] border border-foreground/20 text-[11px] font-black uppercase tracking-widest text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all cursor-default">{tag}</span>
                            ))}
                          </div>
                        </div>

                        {/* Author Card */}
                        <div className="p-7 rounded-3xl bg-card border border-border shadow-md">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.35em] text-foreground/60 mb-5 flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-accent rounded-full" /> Creator
                          </h4>
                          <Link href={`/user/${project.author}`} className="flex items-center gap-4 group">
                            <img src={project.authorAvatar} alt={project.author} className="w-12 h-12 rounded-full border-2 border-border group-hover:border-primary transition-all" />
                            <div>
                              <p className="font-black text-sm group-hover:text-primary transition-colors">@{project.author}</p>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">{project.category} builder</p>
                            </div>
                          </Link>
                        </div>

                        {/* Quick Links */}
                        <div className="p-7 rounded-3xl bg-card border border-border shadow-md">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.35em] text-foreground/60 mb-5 flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-primary rounded-full" /> Quick Links
                          </h4>
                          <div className="space-y-2">
                            {[
                              { label: "GitHub Repository", icon: GitBranch, href: "#" },
                              { label: "Datasheet / Docs", icon: BookOpen, href: "#" },
                              { label: "Purchase Components", icon: ShoppingCart, href: "#" },
                              { label: "Share Project", icon: Share2, href: "#" },
                            ].map(l => (
                              <a key={l.label} href={l.href}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 border border-transparent hover:border-border text-sm font-bold text-muted-foreground hover:text-foreground transition-all group">
                                <l.icon size={15} className="text-primary group-hover:scale-110 transition-transform" />
                                {l.label}
                                <ExternalLink size={12} className="ml-auto opacity-40" />
                              </a>
                            ))}
                          </div>
                        </div>

                        {/* Safety */}
                        <div className="p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5">
                          <div className="flex items-start gap-4">
                            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                            <div>
                              <h5 className="text-sm font-black text-amber-600 dark:text-amber-400 mb-1.5">Safety Notice</h5>
                              <p className="text-xs text-amber-600/80 dark:text-amber-400/80 font-medium leading-relaxed">Verify power supply specs before first power-on. Check all component ratings in the BOM.</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })()}

                {/* ── BOM ── */}
                {activeTab === "bom" && (() => {
                  const bomCategories = [...new Set(bom.map(i => i.category ?? "Other"))];
                  const categoryTotals = bomCategories.map(cat => ({
                    cat, total: bom.filter(i => (i.category ?? "Other") === cat).reduce((s, i) => s + i.price * i.qty, 0),
                    count: bom.filter(i => (i.category ?? "Other") === cat).length,
                  }));
                  const filteredBom = bom.filter(item => {
                    const matchCat = bomFilter === "All" || (item.category ?? "Other") === bomFilter;
                    const matchSearch = item.name.toLowerCase().includes(bomSearch.toLowerCase()) || (item.partNumber ?? "").toLowerCase().includes(bomSearch.toLowerCase());
                    return matchCat && matchSearch;
                  });
                  const stockColors: Record<string, string> = { "In Stock": "text-emerald-500", "Low Stock": "text-amber-500", "Out of Stock": "text-rose-500" };
                  const tocopperColor: Record<string, string> = { "SMD": "bg-blue-500/10 text-blue-400 border-blue-500/30", "THT": "bg-violet-500/10 text-violet-400 border-violet-500/30", "Module": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
                  return (
                    <div className="space-y-8">
                      {/* Header stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Total Components", value: bom.reduce((s, i) => s + i.qty, 0).toString(), sub: `${bom.length} unique parts`, color: "from-primary/20 to-primary/5", border: "border-primary/20", icon: ShoppingCart },
                          { label: "BOM Cost", value: `₹${bomTotal.toLocaleString()}`, sub: "excl. shipping", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", icon: Zap },
                          { label: "Categories", value: bomCategories.length.toString(), sub: "component types", color: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/20", icon: Layers },
                          { label: "Availability", value: `${Math.round(bom.filter(i => (i.stock ?? "In Stock") === "In Stock").length / bom.length * 100)}%`, sub: "parts in stock", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/20", icon: CheckCircle2 },
                        ].map(({ label, value, sub, color, border, icon: Icon }) => (
                          <div key={label} className={`p-5 rounded-2xl bg-gradient-to-br ${color} border ${border}`}>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/50">{label}</span>
                              <Icon size={14} className="text-foreground/30" />
                            </div>
                            <p className="text-2xl font-black font-display">{value}</p>
                            <p className="text-[10px] text-muted-foreground mt-1 font-medium">{sub}</p>
                          </div>
                        ))}
                      </div>

                      {/* Cost breakdown */}
                      <div className="p-6 rounded-2xl bg-card border border-border">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50 mb-4">Cost Breakdown by Category</h4>
                        <div className="space-y-3">
                          {categoryTotals.map(({ cat, total, count }) => (
                            <div key={cat} className="flex items-center gap-4">
                              <span className="text-xs font-bold w-28 shrink-0">{cat}</span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.round(total / bomTotal * 100)}%` }} />
                              </div>
                              <span className="text-xs font-black w-16 text-right">₹{total.toFixed(0)}</span>
                              <span className="text-[9px] text-muted-foreground w-10 text-right">{count}×</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Filters + search */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/40 border border-border">
                          <Search size={15} className="text-muted-foreground shrink-0" />
                          <input
                            value={bomSearch}
                            onChange={e => setBomSearch(e.target.value)}
                            placeholder="Search components or part #..."
                            className="bg-transparent text-sm font-medium outline-none w-full placeholder:text-muted-foreground/50"
                          />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {["All", ...bomCategories].map(cat => (
                            <button key={cat} onClick={() => setBomFilter(cat)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${bomFilter === cat ? "bg-foreground text-background" : "bg-muted/40 border border-border text-muted-foreground hover:text-foreground"}`}>
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Table */}
                      <div className="bg-card rounded-[32px] border border-border overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-border bg-muted/20">
                                {["Component / Part #", "Package", "Category", "Qty", "Unit ₹", "Total ₹", "Stock", "Alt Part", ""].map(h => (
                                  <th key={h} className={`px-5 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 ${h === "" ? "text-right" : ""}`}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {filteredBom.map(item => (
                                <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                                  <td className="px-5 py-5">
                                    <div>
                                      <p className="font-black text-sm group-hover:text-primary transition-colors">{item.name}</p>
                                      <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest mt-0.5">{item.partNumber ?? "—"}</p>
                                      {item.notes && <p className="text-[10px] text-muted-foreground/40 italic mt-1">{item.notes}</p>}
                                      {item.value && <p className="text-[9px] font-mono mt-1 text-primary/60">{item.value}</p>}
                                    </div>
                                  </td>
                                  <td className="px-5 py-5">
                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${tocopperColor[item.mounting ?? "SMD"] ?? "bg-muted text-muted-foreground border-border"}`}>
                                      {item.mounting ?? "SMD"}
                                    </span>
                                  </td>
                                  <td className="px-5 py-5">
                                    <span className="px-2.5 py-1 rounded-full bg-muted border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">{item.category ?? "Other"}</span>
                                  </td>
                                  <td className="px-5 py-5 text-center font-black">{item.qty}</td>
                                  <td className="px-5 py-5 font-black text-primary font-display">₹{item.price}</td>
                                  <td className="px-5 py-5 font-black">₹{(item.price * item.qty).toFixed(0)}</td>
                                  <td className="px-5 py-5">
                                    <span className={`text-xs font-black ${stockColors[item.stock ?? "In Stock"]}`}>● {item.stock ?? "In Stock"}</span>
                                  </td>
                                  <td className="px-5 py-5">
                                    <span className="text-[10px] text-muted-foreground font-medium">{item.altPart ?? "—"}</span>
                                  </td>
                                  <td className="px-5 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      {item.datasheet && (
                                        <a href={item.datasheet} target="_blank" rel="noopener noreferrer"
                                          className="p-2 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all" title="Datasheet">
                                          <BookOpen size={13} />
                                        </a>
                                      )}
                                      <button className="p-2 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all" title="Buy">
                                        <ExternalLink size={13} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-muted/10 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Legend</p>
                            <div className="flex gap-4 flex-wrap">
                              {[["SMD", "bg-blue-500/10 text-blue-400 border-blue-500/30"], ["THT", "bg-violet-500/10 text-violet-400 border-violet-500/30"], ["Module", "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"]].map(([l, cls]) => (
                                <span key={l} className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${cls}`}>{l}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-1">Total BOM Cost</p>
                              <p className="text-4xl font-black text-primary font-display tracking-tight">₹{bomTotal.toLocaleString()}</p>
                              <p className="text-[10px] text-muted-foreground/50 mt-1">Excludes shipping &amp; taxes</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button variant="primary" icon={<ShoppingCart size={15} />} className="px-7 h-12 rounded-[18px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">Procure All</Button>
                              <Button variant="ghost" icon={<Download size={15} />} className="px-7 h-10 rounded-[18px] text-[10px] font-black uppercase tracking-widest border border-border"
                                onClick={() => toast.success("BOM Exported", { description: "CSV downloaded to your device." })}>Export CSV</Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sourcing note */}
                      <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-4">
                        <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-black text-amber-600 dark:text-amber-400 mb-1">Sourcing Notes</p>
                          <p className="text-xs text-amber-600/80 dark:text-amber-400/80 font-medium leading-relaxed">Prices reflect IndiaMART/Robu data (Mar 2026). Always verify component ratings before placing bulk orders. SMD parts require a soldering station + hot air rework tool.</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ── Schematics ── */}
                {activeTab === "schematics" && (() => {
                  const schemDocs = [
                    {
                      name: "Main MCU + Sensor Interface", tag: "logic", tool: "KiCad 7.0", layers: "2-Layer",
                      nets: 42, erc: "0 Errors", rev: "v1.2", size: "80×60mm",
                      desc: "Core logic board: ESP32-C3 SuperMini, LD2410B radar sensor, status LEDs, UART debug header, I²C bus.",
                      img: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80",
                    },
                    {
                      name: "Power Delivery Network", tag: "power", tool: "KiCad 7.0", layers: "2-Layer",
                      nets: 18, erc: "0 Errors", rev: "v1.1", size: "60×40mm",
                      desc: "5V input → 3.3V LDO, decoupling network, bulk caps, reverse-polarity protection, LED power rail.",
                      img: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
                    },
                    {
                      name: "Wiring & Pinout Diagram", tag: "wiring", tool: "Fritzing", layers: "—",
                      nets: 12, erc: "N/A", rev: "v1.0", size: "A4",
                      desc: "Breadboard-compatible wiring diagram for prototyping. All GPIO assignments annotated.",
                      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
                    },
                    {
                      name: "System Block Diagram", tag: "arch", tool: "draw.io", layers: "—",
                      nets: "—", erc: "N/A", rev: "v1.3", size: "A3",
                      desc: "High-level architecture: data flow between radar, MCU, UART, cloud, and OLED display.",
                      img: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
                    },
                  ];
                  const tagColors: Record<string, string> = {
                    logic: "bg-blue-500/10 text-blue-400 border-blue-500/30",
                    power: "bg-rose-500/10 text-rose-400 border-rose-500/30",
                    wiring: "bg-amber-500/10 text-amber-400 border-amber-500/30",
                    arch: "bg-violet-500/10 text-violet-400 border-violet-500/30",
                  };
                  const pcbLayers = [
                    { num: "F.Cu", color: "#D94B4B", type: "Signal", weight: "0.25 mm" },
                    { num: "B.Cu", color: "#5B9CF5", type: "Signal + Ground Plane", weight: "0.25 mm" },
                    { num: "F.Mask", color: "#22c55e", type: "Solder Mask", weight: "—" },
                    { num: "B.Mask", color: "#22c55e", type: "Solder Mask", weight: "—" },
                    { num: "F.SilkS", color: "#EBEBEB", type: "Silkscreen", weight: "—" },
                  ];
                  const designRules = [
                    { rule: "Min track width", value: "0.2 mm", status: "pass" },
                    { rule: "Min clearance", value: "0.2 mm", status: "pass" },
                    { rule: "Min via drill", value: "0.3 mm", status: "pass" },
                    { rule: "Min annular ring", value: "0.15 mm", status: "pass" },
                    { rule: "Copper-to-edge", value: "0.3 mm", status: "pass" },
                    { rule: "Differential pair skew", value: "< 50 mil", status: "n/a" },
                  ];
                  return (
                    <div className="space-y-8">
                      {/* Sub-nav */}
                      <div className="flex gap-2 p-1.5 bg-muted/30 border border-border rounded-2xl w-fit">
                        {([["diagrams", "Diagrams"], ["stackup", "PCB Stackup"], ["rules", "Design Rules"], ["downloads", "Downloads"]] as const).map(([id, label]) => (
                          <button key={id} onClick={() => setSchTab(id)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${schTab === id ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground"}`}>
                            {label}
                          </button>
                        ))}
                      </div>

                      {schTab === "diagrams" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {schemDocs.map(doc => (
                            <div key={doc.name} className="group rounded-[28px] border border-border bg-card overflow-hidden hover:border-primary/40 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500">
                              {/* Image */}
                              <div className="relative aspect-[16/9] overflow-hidden">
                                <img src={doc.img} alt={doc.name} className="w-full h-full object-cover opacity-40 group-hover:opacity-20 group-hover:scale-105 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                                <div className="absolute top-4 left-4">
                                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${tagColors[doc.tag] ?? ""}`}>{doc.tag}</span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h4 className="text-lg font-black font-display leading-tight">{doc.name}</h4>
                                  <p className="text-xs text-muted-foreground font-medium mt-1">{doc.desc}</p>
                                </div>
                              </div>
                              {/* Meta */}
                              <div className="p-5 border-t border-border bg-muted/10">
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                  {[["Tool", doc.tool], ["Revision", doc.rev], ["Layers", doc.layers]].map(([k, v]) => (
                                    <div key={k}>
                                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-0.5">{k}</p>
                                      <p className="text-xs font-black">{v}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="grid grid-cols-3 gap-3 mb-5">
                                  {[["Nets", String(doc.nets)], ["ERC", doc.erc], ["Size", doc.size]].map(([k, v]) => (
                                    <div key={k}>
                                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-0.5">{k}</p>
                                      <p className={`text-xs font-black ${v.includes("0 Err") ? "text-emerald-500" : ""}`}>{v}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="secondary" icon={<ExternalLink size={13} />} className="flex-1 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest">View Full</Button>
                                  <Button variant="ghost" icon={<Download size={13} />} className="flex-1 h-9 rounded-xl text-[9px] font-black uppercase tracking-widest border border-border"
                                    onClick={() => toast.success("Downloading", { description: `${doc.name} PDF queued.` })}>Download</Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {schTab === "stackup" && (
                        <div className="space-y-6 max-w-3xl mx-auto">
                          <div className="p-7 rounded-2xl bg-card border border-border">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50 mb-6">2-Layer PCB Stackup</h4>
                            <div className="space-y-2">
                              {pcbLayers.map(l => (
                                <div key={l.num} className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors">
                                  <div className="w-5 h-5 rounded-sm shrink-0 border border-white/10" style={{ background: l.color }} />
                                  <div className="flex-1">
                                    <span className="text-sm font-black font-mono">{l.num}</span>
                                    <span className="ml-4 text-xs text-muted-foreground font-medium">{l.type}</span>
                                  </div>
                                  <span className="text-xs font-bold text-muted-foreground">{l.weight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {[["Board Material", "FR4 (Tg 130°C)"], ["Thickness", "1.6 mm"], ["Surface Finish", "HASL Lead-Free"], ["Silkscreen", "White (both sides)"], ["Solder Mask", "Green"], ["Min Trace/Space", "0.2 / 0.2 mm"]].map(([k, v]) => (
                              <div key={k} className="p-4 rounded-xl bg-muted/40 border border-border">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-1">{k}</p>
                                <p className="text-sm font-black">{v}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {schTab === "rules" && (
                        <div className="max-w-2xl mx-auto space-y-4">
                          <div className="p-6 rounded-2xl bg-card border border-border">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50 mb-5">DRC Summary — All rules passed</h4>
                            <div className="space-y-2">
                              {designRules.map(r => (
                                <div key={r.rule} className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-muted/30 transition-colors">
                                  <span className={`text-xs font-black ${r.status === "pass" ? "text-emerald-500" : "text-muted-foreground"}`}>{r.status === "pass" ? "✓" : "—"}</span>
                                  <span className="text-sm font-bold flex-1">{r.rule}</span>
                                  <span className="text-sm font-black font-mono text-primary">{r.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2"><Info size={13} /> Signal Integrity Notes</h5>
                            <ul className="space-y-2 text-xs text-muted-foreground font-medium">
                              <li className="flex gap-2"><span className="text-primary">›</span>UART TX/RX routed with 50Ω characteristic impedance target</li>
                              <li className="flex gap-2"><span className="text-primary">›</span>Decoupling caps placed within 2mm of every VCC pin</li>
                              <li className="flex gap-2"><span className="text-primary">›</span>Ground plane on B.Cu provides low-impedance return path</li>
                              <li className="flex gap-2"><span className="text-primary">›</span>Crystal traces shielded with guard ring</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {schTab === "downloads" && (
                        <div className="max-w-xl mx-auto space-y-3">
                          {[
                            { name: "Schematic PDF (Full)", size: "2.4 MB", fmt: "PDF", icon: BookOpen },
                            { name: "KiCad Project (.kicad_pro)", size: "1.1 MB", fmt: "KiCad", icon: Cpu },
                            { name: "Gerber Files (.zip)", size: "3.8 MB", fmt: "ZIP", icon: Layers },
                            { name: "BOM Export (.csv)", size: "12 KB", fmt: "CSV", icon: ShoppingCart },
                            { name: "Drill File (.drl)", size: "48 KB", fmt: "DRL", icon: FlaskConical },
                            { name: "3D Model (.step)", size: "8.2 MB", fmt: "STEP", icon: Award },
                            { name: "Assembly Drawing (.pdf)", size: "1.5 MB", fmt: "PDF", icon: BookOpen },
                          ].map(f => (
                            <button key={f.name} onClick={() => toast.success("Download Started", { description: `${f.name} queued.` })}
                              className="w-full flex items-center gap-5 p-5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:bg-muted/20 transition-all group">
                              <div className="p-3 rounded-xl bg-muted border border-border group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                                <f.icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-sm font-black group-hover:text-primary transition-colors">{f.name}</p>
                                <p className="text-xs text-muted-foreground font-medium mt-0.5">{f.size} · {f.fmt}</p>
                              </div>
                              <Download size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div />

                {/* Build Steps */}
                {
                  activeTab === "steps" && (
                    <BuildStepsTab level={project.level || "Beginner"} onPostBuildLog={() => setActiveTab("overview")} />
                  )
                }


                {/* ── Code ── */}
                {activeTab === "code" && (() => {
                  const ext = project.tags.includes("Python") ? "py" : project.tags.includes("Verilog") ? "v" : "cpp";

                  const files: Record<string, { name: string; lang: string; size: string; lines: number; code: string }> = {
                    main: {
                      name: `main.${ext}`, lang: ext === "py" ? "Python" : ext === "v" ? "Verilog" : "C++",
                      size: "4.2 KB", lines: 89,
                      code: `// NetListLab — ${project.title}
// Author: @${project.author}
// License: MIT  |  Tags: ${project.tags.join(", ")}
// Build: Arduino IDE 2.3.2 / PlatformIO 6.1

#include "config.h"
#include "sensor.h"
#include "comm.h"
#include <WiFi.h>
#include <ArduinoJson.h>

// ──────────────────────────────────────────────
//  Globals
// ──────────────────────────────────────────────
SensorData gSensor;
CommState  gComm;
uint32_t   gLastPublish = 0;

// ──────────────────────────────────────────────
//  Setup
// ──────────────────────────────────────────────
void setup() {
  Serial.begin(BAUD_RATE);
  pinMode(LED_STATUS, OUTPUT);
  pinMode(LED_ALERT,  OUTPUT);

  digitalWrite(LED_STATUS, HIGH);   // boot indicator

  // Sensor init with retry logic
  uint8_t retries = 3;
  while (!sensor_init(SENSOR_PIN) && retries--) {
    Serial.println("[WARN] sensor init failed, retrying...");
    delay(500);
  }
  if (retries == 0) { Serial.println("[ERR] sensor unreachable"); halt(); }

  sensor_calibrate(&gSensor);
  comm_init(&gComm, WIFI_SSID, WIFI_PASS, MQTT_BROKER);

  digitalWrite(LED_STATUS, LOW);
  Serial.printf("[OK] ${project.title} ready @ %lu ms\\n", millis());
}

// ──────────────────────────────────────────────
//  Main Loop
// ──────────────────────────────────────────────
void loop() {
  sensor_read(&gSensor);

  if (gSensor.value > THRESHOLD_HIGH) {
    trigger_alert(gSensor.value, ALERT_HIGH);
  } else if (gSensor.value < THRESHOLD_LOW) {
    trigger_alert(gSensor.value, ALERT_LOW);
  }

  // Publish telemetry at PUBLISH_INTERVAL ms
  if (millis() - gLastPublish >= PUBLISH_INTERVAL) {
    publish_telemetry(&gComm, &gSensor);
    gLastPublish = millis();
  }

  delay(1000 / SAMPLE_RATE_HZ);
}

// ──────────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────────
void trigger_alert(float val, AlertType type) {
  Serial.printf("[ALERT] val=%.2f type=%d @ %lu\\n", val, type, millis());
  digitalWrite(LED_ALERT, HIGH);
  delay(250);
  digitalWrite(LED_ALERT, LOW);
}

void halt() {
  while (1) { digitalWrite(LED_STATUS, !digitalRead(LED_STATUS)); delay(200); }
}`,
                    },
                    config: {
                      name: "config.h", lang: "C Header", size: "1.1 KB", lines: 32,
                      code: `// config.h — ${project.title}
// ──────────────────────────────────────────────
#pragma once

// Serial
#define BAUD_RATE       115200

// Pins
#define SENSOR_PIN      32
#define LED_STATUS       2
#define LED_ALERT        4

// Sampling
#define SAMPLE_RATE_HZ  10          // 10 Hz polling
#define PUBLISH_INTERVAL 5000       // ms between MQTT publishes

// Thresholds
#define THRESHOLD_HIGH  0.85f
#define THRESHOLD_LOW   0.10f

// WiFi / MQTT  — override in secrets.h
#ifndef WIFI_SSID
  #define WIFI_SSID     "YOUR_SSID"
#endif
#ifndef WIFI_PASS
  #define WIFI_PASS     "YOUR_PASSWORD"
#endif
#define MQTT_BROKER     "mqtt.netlistlab.io"
#define MQTT_PORT       1883
#define MQTT_TOPIC      "lab/${project.author}/sensors"

// Alert types
typedef enum { ALERT_HIGH = 0, ALERT_LOW = 1 } AlertType;`,
                    },
                    sensor: {
                      name: "lib/sensor.cpp", lang: "C++", size: "2.8 KB", lines: 64,
                      code: `// sensor.cpp — Sensor abstraction layer
#include "sensor.h"

bool sensor_init(uint8_t pin) {
  // Configure ADC
  analogReadResolution(12);              // 12-bit, 0–4095
  analogSetAttenuation(ADC_11db);       // 0–3.6V range
  delay(50);                             // settling time
  int probe = analogRead(pin);
  return (probe >= 0 && probe <= 4095);  // sanity check
}

void sensor_calibrate(SensorData* sd) {
  const int N = 32;
  float sum = 0;
  for (int i = 0; i < N; i++) {
    sum += analogRead(SENSOR_PIN) / 4095.0f;
    delay(10);
  }
  sd->baseline   = sum / N;
  sd->value      = sd->baseline;
  sd->valid      = true;
  sd->lastUpdate = millis();
  Serial.printf("[CAL] baseline=%.3f\\n", sd->baseline);
}

void sensor_read(SensorData* sd) {
  float raw  = analogRead(SENSOR_PIN) / 4095.0f;
  // 1st-order IIR low-pass, α=0.2
  sd->value  = 0.8f * sd->value + 0.2f * raw;
  sd->delta  = sd->value - sd->baseline;
  sd->lastUpdate = millis();
}`,
                    },
                    comm: {
                      name: "lib/comm.cpp", lang: "C++", size: "3.5 KB", lines: 78,
                      code: `// comm.cpp — WiFi + MQTT communication layer
#include "comm.h"
#include <ArduinoJson.h>

void comm_init(CommState* c, const char* ssid, const char* pass, const char* broker) {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);
  Serial.print("[NET] connecting");
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries++ < 20) {
    delay(500); Serial.print(".");
  }
  Serial.printf("\\n[NET] IP: %s\\n", WiFi.localIP().toString().c_str());

  c->client.setServer(broker, MQTT_PORT);
  c->client.connect("NL_NODE");
  c->connected = c->client.connected();
}

void publish_telemetry(CommState* c, SensorData* sd) {
  if (!c->connected) { comm_reconnect(c); return; }
  StaticJsonDocument<256> doc;
  doc["v"]  = sd->value;
  doc["d"]  = sd->delta;
  doc["ts"] = millis();
  doc["id"] = "NL_NODE_01";

  char buf[256];
  serializeJson(doc, buf);
  c->client.publish(MQTT_TOPIC, buf);
  Serial.printf("[PUB] %s\\n", buf);
}`,
                    },
                    tests: {
                      name: "tests/unit_test.cpp", lang: "C++", size: "1.9 KB", lines: 45,
                      code: `// unit_test.cpp — Unity test suite
// Run: pio test -e native
#include <unity.h>
#include "sensor.h"

SensorData sd;

void setUp(void) {
  sd.baseline = 0.5f; sd.value = 0.5f; sd.valid = true;
}

void test_sensor_read_range(void) {
  sensor_read(&sd);
  TEST_ASSERT_FLOAT_WITHIN(0.5f, 0.5f, sd.value);
}

void test_threshold_high(void) {
  sd.value = 0.9f;
  TEST_ASSERT_GREATER_THAN_FLOAT(THRESHOLD_HIGH, sd.value);
}

void test_threshold_low(void) {
  sd.value = 0.05f;
  TEST_ASSERT_LESS_THAN_FLOAT(THRESHOLD_LOW, sd.value);
}

void test_delta_calculation(void) {
  sd.baseline = 0.5f; sd.value = 0.7f;
  sd.delta = sd.value - sd.baseline;
  TEST_ASSERT_FLOAT_WITHIN(0.001f, 0.2f, sd.delta);
}

int main(void) {
  UNITY_BEGIN();
  RUN_TEST(test_sensor_read_range);
  RUN_TEST(test_threshold_high);
  RUN_TEST(test_threshold_low);
  RUN_TEST(test_delta_calculation);
  return UNITY_END();
}`,
                    },
                    readme: {
                      name: "README.md", lang: "Markdown", size: "3.1 KB", lines: 71,
                      code: `# ${project.title}

> ${project.description}

## Quick Start
\`\`\`bash
git clone https://github.com/netlistlab/${project.title.toLowerCase().replace(/\s+/g, '-')}.git
cd ${project.title.toLowerCase().replace(/\s+/g, '-')}
cp secrets.example.h secrets.h   # fill in WiFi creds
pio run --target upload
pio device monitor
\`\`\`

## Project Structure
\`\`\`
├── main.cpp          Core firmware
├── config.h          Pin + threshold constants
├── secrets.h         WiFi / MQTT credentials (gitignored)
├── lib/
│   ├── sensor.h/.cpp Sensor abstraction
│   └── comm.h/.cpp   WiFi + MQTT layer
├── tests/            PlatformIO Unity test suite
└── kicad/            Hardware design files
\`\`\`

## Hardware Requirements
See BOM tab for full component list and sourcing.

## License
MIT — fork freely, credit appreciated.`,
                    },
                  };

                  const currentFile = files[codeFile];
                  const codeLines = currentFile.code.split("\n");

                  const deps = [
                    { name: "ArduinoJson", ver: "7.1.0", license: "MIT", desc: "JSON serialization for telemetry payloads" },
                    { name: "PubSubClient", ver: "2.8.0", license: "MIT", desc: "MQTT client (publish/subscribe)" },
                    { name: "WiFi (ESP32)", ver: "2.0.14", license: "LGPL-2.1", desc: "Built-in WiFi stack for ESP32-C3" },
                    { name: "Unity (test)", ver: "2.5.2", license: "MIT", desc: "Lightweight C unit testing framework" },
                    { name: "esp32 Arduino core", ver: "3.0.3", license: "Apache-2.0", desc: "Board support package for PlatformIO" },
                  ];

                  return (
                    <div className="space-y-6">
                      {/* IDE wrapper */}
                      <div className="rounded-[32px] border border-white/10 overflow-hidden shadow-3xl bg-[#0D0D0D]">
                        {/* Title bar */}
                        <div className="px-7 py-4 border-b border-white/[0.08] bg-white/[0.03] flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            </div>
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.35em] ml-2">{project.title} — VSCode · PlatformIO</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">{currentFile.lang}</span>
                            <span className="text-[9px] text-white/20 font-mono">{currentFile.lines} lines · {currentFile.size}</span>
                          </div>
                        </div>

                        <div className="flex">
                          {/* File tree sidebar */}
                          <div className="w-52 shrink-0 border-r border-white/[0.08] bg-white/[0.02] py-4">
                            <p className="px-4 text-[8px] font-black uppercase tracking-[0.35em] text-white/20 mb-3">Explorer</p>
                            <p className="px-4 text-[9px] font-bold text-white/30 mb-2 uppercase tracking-widest">{project.title.substring(0, 18)}</p>
                            {Object.entries(files).map(([key, f]) => (
                              <button key={key} onClick={() => setCodeFile(key)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all group ${codeFile === key ? "bg-white/[0.08] border-r-2 border-primary" : "hover:bg-white/[0.04]"}`}>
                                <CodeIcon size={12} className={codeFile === key ? "text-primary" : "text-white/30"} />
                                <span className={`text-[11px] font-mono truncate ${codeFile === key ? "text-white" : "text-white/40"}`}>{f.name}</span>
                              </button>
                            ))}
                          </div>

                          {/* Code view */}
                          <div className="flex-1 overflow-auto max-h-[520px]">
                            <div className="flex">
                              {/* Line numbers */}
                              <div className="select-none shrink-0 px-4 py-4 text-right border-r border-white/[0.05]">
                                {codeLines.map((_, i) => (
                                  <div key={i} className="text-[11px] font-mono text-white/15 leading-6">{i + 1}</div>
                                ))}
                              </div>
                              {/* Code */}
                              <div className="flex-1 p-4 overflow-x-auto">
                                <pre className="text-[12px] font-mono leading-6">
                                  {codeLines.map((line, i) => {
                                    // Minimal token colour pass
                                    const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
                                    const isPreproc = line.trim().startsWith("#define") || line.trim().startsWith("#include") || line.trim().startsWith("#pragma");
                                    const isKeyword = /\b(void|int|float|bool|const|if|else|while|for|return|true|false|uint8_t|uint32_t|char)\b/.test(line);
                                    return (
                                      <div key={i} className={`${isComment && !isPreproc ? "text-white/30 italic" : isPreproc ? "text-violet-400/90" : "text-emerald-400/90"} hover:bg-white/[0.03] transition-colors`}>
                                        {line || " "}
                                      </div>
                                    );
                                  })}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action bar */}
                        <div className="px-7 py-3 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <span className="text-[9px] text-white/20 font-mono">UTF-8 · LF · {currentFile.lang}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" icon={<Download size={13} />}
                              className="h-8 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/5 hover:bg-white/10 text-white/60"
                              onClick={() => toast.success("Downloaded", { description: `${currentFile.name} saved.` })}>Download</Button>
                            <Button variant="ghost" icon={<Copy size={13} />}
                              className="h-8 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest border border-white/10 bg-white/5 hover:bg-white/10 text-white/60"
                              onClick={() => { navigator.clipboard?.writeText(currentFile.code); toast.success("Copied", { description: "Code copied to clipboard." }); }}>Copy</Button>
                          </div>
                        </div>
                      </div>

                      {/* Bottom info panels */}
                      <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="flex border-b border-border">
                          {([["deps", "Dependencies"], ["build", "Build Instructions"], ["env", "Environment Setup"], ["tests", "Test Suite"]] as const).map(([id, label]) => (
                            <button key={id} onClick={() => setCodePanel(id)}
                              className={`px-6 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${codePanel === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                              {label}
                            </button>
                          ))}
                        </div>

                        <div className="p-6">
                          {codePanel === "deps" && (
                            <div className="space-y-2">
                              {deps.map(d => (
                                <div key={d.name} className="flex items-center gap-5 p-3.5 rounded-xl hover:bg-muted/30 transition-colors">
                                  <span className="font-mono font-black text-sm text-primary w-36 shrink-0">{d.name}</span>
                                  <span className="text-xs text-muted-foreground font-mono w-20 shrink-0">{d.ver}</span>
                                  <span className="px-2 py-0.5 rounded text-[9px] font-black border border-border text-muted-foreground w-24 text-center shrink-0">{d.license}</span>
                                  <span className="text-xs text-muted-foreground flex-1">{d.desc}</span>
                                </div>
                              ))}
                              <p className="text-[10px] text-muted-foreground/50 mt-4 font-medium">Install via: <span className="font-mono">pio pkg update</span> or Arduino Library Manager</p>
                            </div>
                          )}

                          {codePanel === "build" && (
                            <div className="space-y-4">
                              {[
                                { step: "1. Clone repository", cmd: `git clone https://github.com/netlistlab/${project.title.toLowerCase().replace(/\s+/g, '-')}`, note: "HTTPS or SSH" },
                                { step: "2. Copy secrets template", cmd: "cp secrets.example.h secrets.h", note: "Fill in WiFi SSID/password + MQTT broker" },
                                { step: "3. Select target board", cmd: "pio boards | grep esp32c3", note: "espressif32 @ 3.0.3 recommended" },
                                { step: "4. Compile & flash", cmd: "pio run --target upload -e esp32c3", note: "Hold BOOT button if device not detected" },
                                { step: "5. Open serial monitor", cmd: "pio device monitor --baud 115200", note: "Ctrl+C to exit" },
                                { step: "6. (Optional) Run tests", cmd: "pio test -e native", note: "Requires native env in platformio.ini" },
                              ].map(({ step, cmd, note }) => (
                                <div key={step} className="flex gap-5 items-start p-4 rounded-xl hover:bg-muted/20 transition-colors">
                                  <div className="shrink-0 mt-0.5">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                      <span className="text-[9px] font-black text-primary">{step[0]}</span>
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs font-black mb-1.5">{step}</p>
                                    <code className="block text-xs font-mono px-3 py-2 bg-[#0D0D0D] text-emerald-400 rounded-lg border border-white/10">{cmd}</code>
                                    <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">ℹ️ {note}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {codePanel === "env" && (
                            <div className="grid md:grid-cols-2 gap-4">
                              {[
                                { title: "Toolchain", items: ["PlatformIO Core 6.1+", "Python 3.10+", "GCC arm-none-eabi 12.2", "esptool.py 4.7"] },
                                { title: "IDE", items: ["VS Code + PlatformIO IDE ext", "Arduino IDE 2.3.2 (alternative)", "Atmel Studio (not recommended)"] },
                                { title: "Host OS", items: ["Linux (tested: Ubuntu 22.04)", "macOS 13+ (tested)", "Windows 10/11 via WSL2"] },
                                { title: "Serial / Debug", items: ["CH340/CP2102 USB-UART driver", "115200 baud, 8N1", "OpenOCD for JTAG debug (optional)"] },
                              ].map(({ title, items }) => (
                                <div key={title} className="p-5 rounded-xl bg-muted/30 border border-border">
                                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 mb-3">{title}</p>
                                  <ul className="space-y-1.5">
                                    {items.map(item => (
                                      <li key={item} className="flex items-center gap-2 text-xs font-medium">
                                        <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}

                          {codePanel === "tests" && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 mb-4 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">All 4 tests passing · 0 failures · 0 skipped</span>
                                <span className="ml-auto text-xs text-muted-foreground font-mono">~12 ms</span>
                              </div>
                              {[
                                { name: "test_sensor_read_range", file: "unit_test.cpp:12", status: "PASS", ms: "2ms", desc: "Sensor output stays within [0, 1] range" },
                                { name: "test_threshold_high", file: "unit_test.cpp:17", status: "PASS", ms: "1ms", desc: "Alert fires when value > THRESHOLD_HIGH" },
                                { name: "test_threshold_low", file: "unit_test.cpp:22", status: "PASS", ms: "1ms", desc: "Alert fires when value < THRESHOLD_LOW" },
                                { name: "test_delta_calculation", file: "unit_test.cpp:27", status: "PASS", ms: "1ms", desc: "Delta = value − baseline within ±0.001 tolerance" },
                              ].map(t => (
                                <div key={t.name} className="flex items-center gap-5 p-4 rounded-xl hover:bg-muted/20 transition-colors border border-border">
                                  <span className="text-emerald-500 font-black text-xs">✓</span>
                                  <div className="flex-1">
                                    <p className="text-xs font-black font-mono">{t.name}</p>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground/50 font-mono">{t.file}</span>
                                  <span className="text-[10px] font-black text-emerald-500 w-12 text-right">{t.status}</span>
                                  <span className="text-[10px] text-muted-foreground font-mono w-10 text-right">{t.ms}</span>
                                </div>
                              ))}
                              <p className="text-[10px] text-muted-foreground/50 font-medium mt-2">Run locally: <code className="font-mono text-primary">pio test -e native -v</code></p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ── Media Tab ── */}
                {activeTab === "media" && (() => {
                  const galleryImages = [
                    { url: project.image, caption: "Final assembled unit — top view", label: "Hero" },
                    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80", caption: "PCB close-up showing radar module placement", label: "PCB" },
                    { url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=900&q=80", caption: "Wiring harness and connectors", label: "Wiring" },
                    { url: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=900&q=80", caption: "Soldering the SMD components under magnification", label: "Solder" },
                    { url: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&w=900&q=80", caption: "Testing on breadboard before PCB spin", label: "Test" },
                    { url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80", caption: "OLED display showing live radar readings", label: "Display" },
                    { url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=900&q=80", caption: "3D-printed enclosure halves before painting", label: "3D Print" },
                    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80", caption: "Serial monitor output during firmware calibration", label: "Firmware" },
                  ];

                  const videos = [
                    { id: "dQw4w9WgXcQ", title: "ESP32 Radar Detection — Full Demo", channel: "TechLabBuild", views: "42K", duration: "8:24", desc: "Complete walkthrough of the device detecting presence in a room, including sensitivity tuning and serial output analysis." },
                    { id: "VID_001", title: "Soldering SMD Components — Step-by-Step", channel: "PCB_Wizard", views: "18K", duration: "12:07", desc: "Detailed soldering tutorial for the MCP1700 LDO and 0402 passives on this specific board." },
                    { id: "VID_002", title: "FreeRTOS Task Setup on ESP32-C3", channel: "EmbeddedPro", views: "31K", duration: "15:50", desc: "How to structure dual-core RTOS tasks for the radar polling loop and MQTT publishing." },
                    { id: "VID_003", title: "Flashing Firmware with esptool.py", channel: "NetListLab", views: "9.2K", duration: "5:13", desc: "Quick guide to flashing via USB-C and verifying CRC on the partition table." },
                  ];

                  const simulations = [
                    { title: "Wokwi Circuit Simulation", desc: "Interactive ESP32 + LD2410B wiring simulation. Edit components live in your browser.", url: "https://wokwi.com", icon: "⚡", badge: "Online Simulator", color: "border-emerald-500/30 bg-emerald-500/5" },
                    { title: "Falstad Circuit Simulator", desc: "Analog front-end power supply — LDO regulator with bypass caps visualized in real-time.", url: "https://www.falstad.com/circuit/", icon: "🔌", badge: "Analog Sim", color: "border-blue-500/30 bg-blue-500/5" },
                    { title: "Tinkercad Circuits", desc: "Breadboard prototype schematic for initial validation. Fork and edit the wiring online.", url: "https://www.tinkercad.com", icon: "🏗️", badge: "3D + Circuit", color: "border-violet-500/30 bg-violet-500/5" },
                    { title: "EasyEDA PCB Viewer", desc: "View the 2-layer PCB layout including copper pours, ground plane, and trace routing.", url: "https://easyeda.com", icon: "🖥️", badge: "PCB Viewer", color: "border-amber-500/30 bg-amber-500/5" },
                    { title: "Antenna Radiation Pattern", desc: "24GHz mmWave radar antenna radiation pattern modeled in HFSS. Download report PDF.", url: "#", icon: "📡", badge: "RF Sim (PDF)", color: "border-rose-500/30 bg-rose-500/5" },
                  ];

                  const buildLogs = [
                    { date: "Jan 28 2026", author: "tech_wizard", avatar: project.authorAvatar, title: "Initial PCB Spin — Rev 1.0", body: "Received the boards from JLCPCB. All 5 passed visual inspection. The LD2410B radar module footprint is spot on — no rework needed. LDO measures 3.287V under no load, well within spec. Starting SMD population now.", images: [project.image], tag: "Progress" },
                    { date: "Feb 3 2026", author: "tech_wizard", avatar: project.authorAvatar, title: "Firmware v0.9.0 — Watchdog Bug Found", body: "Firmware flashed using esptool.py. Discovered a watchdog timer reset occurring every ~4 minutes when WiFi reconnects. Traced to the RTOS idle task not being fed during MQTT reconnect loop. Patch committed, testing in progress.", images: [], tag: "Bug" },
                    { date: "Feb 15 2026", author: "tech_wizard", avatar: project.authorAvatar, title: "v1.0.0 Public Release — All Tests Passed", body: "62 hours of burn-in complete. Zero watchdog resets with v1.0.0 firmware. Proximity detection range: 4.8m confirmed (spec is 5m). False positive rate: 0.3% in controlled environment. Uploading final files now.", images: [], tag: "Release" },
                  ];

                  const communityBuilds = [
                    { user: "akshat_dev", avatar: "https://i.pravatar.cc/100?u=akshat", caption: "Added a case from PETG — fits perfectly!", images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80"], stars: 14 },
                    { user: "priya_builds", avatar: "https://i.pravatar.cc/100?u=priya", caption: "Integrated mine with Home Assistant via MQTT. Works 🔥", images: ["https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&w=400&q=80"], stars: 28 },
                    { user: "robocraze_in", avatar: "https://i.pravatar.cc/100?u=robo", caption: "Dual-unit install for a 10×8m warehouse zone.", images: ["https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=400&q=80"], stars: 9 },
                  ];

                  const fileAttachments = [
                    { name: "ESP32_Radar_v1.0_Source.zip", type: "Source Code", size: "1.2 MB", icon: "📦", desc: "PlatformIO project folder with all C++ source files" },
                    { name: "ESP32_Radar_Schematic_v1.0.pdf", type: "Schematic", size: "840 KB", icon: "📄", desc: "Full KiCad-exported schematic in PDF format" },
                    { name: "PCB_Gerbers_v1.0.zip", type: "Gerber Files", size: "2.1 MB", icon: "🗜️", desc: "Ready to upload to JLCPCB or PCBWay" },
                    { name: "Enclosure_v2.stl", type: "3D Print", size: "3.4 MB", icon: "🖨️", desc: "Top + bottom shell. Print at 0.2mm, 40% infill, PETG" },
                    { name: "BOM_Export_v1.0.csv", type: "BOM", size: "12 KB", icon: "📊", desc: "Full bill of materials with part numbers and Mouser links" },
                    { name: "Firmware_v1.0.0.bin", type: "Binary", size: "320 KB", icon: "💾", desc: "Pre-compiled firmware — flash directly with esptool.py" },
                  ];

                  const mediaSections = [
                    { id: "gallery", label: "Photo Gallery", icon: ImageIcon },
                    { id: "videos", label: "Videos", icon: Youtube },
                    { id: "simulation", label: "Simulations", icon: Tv2 },
                    { id: "buildlog", label: "Build Log", icon: FileText },
                    { id: "community", label: "Community Builds", icon: Users },
                    { id: "files", label: "Downloads", icon: Package },
                  ];

                  return (
                    <div className="space-y-8">
                      {/* Lightbox */}
                      {lightboxImg && (
                        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
                          <button className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all" onClick={() => setLightboxImg(null)}><X size={22} /></button>
                          <img src={lightboxImg} className="max-w-5xl max-h-[88vh] w-full object-contain rounded-3xl shadow-2xl" onClick={e => e.stopPropagation()} />
                        </div>
                      )}

                      {/* Header */}
                      <div className="p-7 rounded-3xl bg-card border border-border shadow-md flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-black font-display tracking-tight mb-1">Media & Documentation</h3>
                          <p className="text-sm text-muted-foreground font-medium">Photos, videos, simulations, build logs, community builds & downloads</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-widest">{galleryImages.length} Photos</span>
                          <span className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-black uppercase tracking-widest">{videos.length} Videos</span>
                        </div>
                      </div>

                      {/* Media sub-nav */}
                      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                        {mediaSections.map(s => (
                          <button key={s.id} onClick={() => setMediaSection(s.id as typeof mediaSection)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${mediaSection === s.id
                                ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                                : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                              }`}>
                            <s.icon size={14} />{s.label}
                          </button>
                        ))}
                      </div>

                      {/* ── Photo Gallery ── */}
                      {mediaSection === "gallery" && (
                        <div className="space-y-6">
                          {/* Featured image */}
                          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-border cursor-pointer group" onClick={() => setLightboxImg(galleryImages[0].url)}>
                            <img src={galleryImages[0].url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-6 left-6 flex items-center gap-3">
                              <span className="px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/10">{galleryImages[0].label}</span>
                              <p className="text-white/90 text-sm font-medium">{galleryImages[0].caption}</p>
                            </div>
                            <div className="absolute top-5 right-5 p-2 rounded-xl bg-black/40 text-white backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all">
                              <Maximize2 size={16} />
                            </div>
                          </div>
                          {/* Thumbnail grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {galleryImages.slice(1).map((img, i) => (
                              <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-border cursor-pointer hover:border-primary/40 transition-all" onClick={() => setLightboxImg(img.url)}>
                                <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                                <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                  <span className="text-[9px] text-white font-black uppercase tracking-widest">{img.label}</span>
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all bg-black/50 p-1.5 rounded-lg">
                                  <Maximize2 size={12} className="text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-center text-xs text-muted-foreground/50 font-medium">Click any image to view full-screen · {galleryImages.length} photos total</p>
                        </div>
                      )}

                      {/* ── Videos ── */}
                      {mediaSection === "videos" && (
                        <div className="space-y-6">
                          {/* Active video */}
                          <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-lg">
                            <div className="relative aspect-video bg-black flex items-center justify-center">
                              {videos[activeVideoIdx].id.startsWith("VID") ? (
                                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                  <div className="w-20 h-20 rounded-full bg-muted/50 border border-border flex items-center justify-center">
                                    <Play size={30} className="text-primary ml-1" />
                                  </div>
                                  <p className="text-sm font-bold">Video preview not available in demo</p>
                                  <a href="https://youtube.com" target="_blank" rel="noopener" className="flex items-center gap-2 px-5 py-2 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all">
                                    <Youtube size={14} /> Watch on YouTube
                                  </a>
                                </div>
                              ) : (
                                <iframe
                                  className="w-full h-full"
                                  src={`https://www.youtube.com/embed/${videos[activeVideoIdx].id}`}
                                  allowFullScreen
                                  title={videos[activeVideoIdx].title}
                                />
                              )}
                            </div>
                            <div className="p-6">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h4 className="text-lg font-black mb-1">{videos[activeVideoIdx].title}</h4>
                                  <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                                    <span className="text-primary">@{videos[activeVideoIdx].channel}</span>
                                    <span>·</span><Eye size={11} /><span>{videos[activeVideoIdx].views} views</span>
                                    <span>·</span><Clock size={11} /><span>{videos[activeVideoIdx].duration}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{videos[activeVideoIdx].desc}</p>
                                </div>
                                <a href={`https://www.youtube.com/watch?v=${videos[activeVideoIdx].id}`} target="_blank" rel="noopener"
                                  className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600/10 border border-rose-600/30 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">
                                  <Youtube size={14} /> YouTube
                                </a>
                              </div>
                            </div>
                          </div>
                          {/* Video list */}
                          <div className="space-y-3">
                            {videos.map((v, i) => (
                              <button key={i} onClick={() => setActiveVideoIdx(i)} className={`w-full flex items-start gap-4 p-5 rounded-2xl border text-left transition-all ${activeVideoIdx === i ? "border-primary/40 bg-primary/5" : "border-border/50 bg-card hover:border-border"
                                }`}>
                                <div className="relative w-24 aspect-video rounded-xl overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
                                  {v.id.startsWith("VID") ? (
                                    <Play size={18} className="text-muted-foreground" />
                                  ) : (
                                    <img src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`} className="w-full h-full object-cover" />
                                  )}
                                  <span className="absolute bottom-1 right-1 text-[8px] font-black bg-black/80 text-white px-1.5 py-0.5 rounded">{v.duration}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-black mb-1 line-clamp-1">{v.title}</p>
                                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">@{v.channel}</p>
                                  <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">{v.desc}</p>
                                </div>
                                {activeVideoIdx === i && <div className="w-1.5 h-full rounded-full bg-primary shrink-0 self-stretch" />}
                              </button>
                            ))}
                          </div>
                          {/* Add video CTA */}
                          <div className="p-5 rounded-2xl border border-dashed border-border text-center">
                            <p className="text-sm text-muted-foreground font-medium mb-3">Know a great video covering this build?</p>
                            <button className="px-5 py-2 rounded-xl bg-muted border border-border text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/30 transition-all" onClick={() => toast.info("Feature coming in Tier 3", { description: "Video submission will require authentication." })}>
                              + Suggest a Video
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── Simulations ── */}
                      {mediaSection === "simulation" && (
                        <div className="space-y-5">
                          <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
                            <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-medium text-muted-foreground">These simulations open in a new browser tab. Some require free account sign-up on the host platform. Wokwi is recommended for the full interactive experience.</p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-5">
                            {simulations.map(sim => (
                              <a key={sim.title} href={sim.url} target="_blank" rel="noopener"
                                className={`group flex flex-col gap-4 p-6 rounded-3xl border ${sim.color} hover:scale-[1.02] transition-all duration-300 cursor-pointer`}>
                                <div className="flex items-start justify-between">
                                  <div className="text-3xl">{sim.icon}</div>
                                  <span className="px-3 py-1 rounded-full bg-card/60 border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">{sim.badge}</span>
                                </div>
                                <div>
                                  <h4 className="text-base font-black mb-2 group-hover:text-primary transition-colors">{sim.title}</h4>
                                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">{sim.desc}</p>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                                  <Globe size={12} /> Open Simulation <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                              </a>
                            ))}
                          </div>
                          {/* 3D viewer placeholder */}
                          <div className="p-8 rounded-3xl border border-violet-500/20 bg-violet-500/5 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
                              <ChipIcon size={28} className="text-violet-400" />
                            </div>
                            <h4 className="text-base font-black mb-2">Interactive 3D PCB Viewer</h4>
                            <p className="text-sm text-muted-foreground font-medium mb-5 max-w-lg mx-auto">Rotate and inspect the assembled PCB in 3D. View component placement, trace routing, and copper pours from any angle.</p>
                            <a href="https://kicanvas.org" target="_blank" rel="noopener"
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 text-[11px] font-black uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all">
                              <Globe size={14} /> Open in KiCanvas
                            </a>
                          </div>
                        </div>
                      )}

                      {/* ── Build Log ── */}
                      {mediaSection === "buildlog" && (
                        <div className="space-y-6">
                          <div className="relative pl-8 border-l-2 border-primary/20 space-y-8">
                            {buildLogs.map((log, i) => (
                              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="relative">
                                <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-glow-cyan" />
                                <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-7">
                                  <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                      <img src={log.avatar} className="w-9 h-9 rounded-full border-2 border-border" />
                                      <div>
                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">@{log.author}</span>
                                        <p className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-widest mt-0.5">{log.date}</p>
                                      </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${log.tag === "Release" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                                        log.tag === "Bug" ? "bg-rose-500/10 border-rose-500/30 text-rose-400" :
                                          "bg-primary/10 border-primary/30 text-primary"
                                      }`}>{log.tag}</span>
                                  </div>
                                  <h4 className="text-base font-black mb-3">{log.title}</h4>
                                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{log.body}</p>
                                  {log.images.length > 0 && (
                                    <div className="flex gap-3 mt-5">
                                      {log.images.map((img, j) => (
                                        <div key={j} className="w-28 aspect-video rounded-xl overflow-hidden border border-border cursor-pointer hover:border-primary/40 transition-all" onClick={() => setLightboxImg(img)}>
                                          <img src={img} className="w-full h-full object-cover" />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <div className="p-5 rounded-2xl border border-dashed border-border text-center">
                            <p className="text-sm text-muted-foreground font-medium mb-3">Built this project? Share your experience and photos.</p>
                            <button className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                              onClick={() => toast.success("Coming Soon", { description: "Build log submission coming in Tier 3." })}>
                              + Add Build Log
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── Community Builds ── */}
                      {mediaSection === "community" && (
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-3 gap-6">
                            {communityBuilds.map((build, i) => (
                              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                                className="bg-card/60 border border-border/50 rounded-3xl overflow-hidden hover:border-primary/30 transition-all group">
                                <div className="aspect-video relative overflow-hidden cursor-pointer" onClick={() => build.images[0] && setLightboxImg(build.images[0])}>
                                  <img src={build.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                                </div>
                                <div className="p-5">
                                  <div className="flex items-center gap-3 mb-3">
                                    <img src={build.avatar} className="w-8 h-8 rounded-full border border-border" />
                                    <span className="text-[11px] font-black text-primary">@{build.user}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground font-medium mb-4">{build.caption}</p>
                                  <div className="flex items-center justify-between">
                                    <button className="flex items-center gap-2 text-[10px] font-black text-muted-foreground/60 hover:text-amber-500 transition-colors uppercase tracking-widest">
                                      <Star size={13} /> {build.stars} Helpful
                                    </button>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">I Made It!</span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <div className="p-6 rounded-2xl border border-dashed border-border text-center">
                            <p className="text-base font-black mb-2">Finished your Build? 🎉</p>
                            <p className="text-sm text-muted-foreground font-medium mb-5">Share photos, modifications, and tips to help other builders.</p>
                            <Button variant="primary" onClick={() => toast.success("Coming Soon", { description: "Community photo submissions in Tier 3." })} className="px-8 h-11 rounded-2xl text-[11px] font-black uppercase tracking-widest">
                              I Made It!
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* ── Files / Downloads ── */}
                      {mediaSection === "files" && (
                        <div className="space-y-4">
                          <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 flex items-center gap-4">
                            <Download size={18} className="text-primary shrink-0" />
                            <div>
                              <p className="text-sm font-black">All project files are free to download</p>
                              <p className="text-xs text-muted-foreground font-medium">Licensed under CC BY-SA 4.0 — share with attribution, commercial use allowed with credit</p>
                            </div>
                          </div>
                          {fileAttachments.map((file, i) => (
                            <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group">
                              <div className="text-3xl shrink-0">{file.icon}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-sm mb-0.5 truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground font-medium">{file.desc}</p>
                              </div>
                              <div className="flex items-center gap-4 shrink-0">
                                <div className="text-right">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">{file.type}</p>
                                  <p className="text-[10px] text-muted-foreground font-bold">{file.size}</p>
                                </div>
                                <button onClick={() => toast.success("Download started", { description: file.name })}
                                  className="p-3 rounded-xl bg-muted/50 border border-border text-muted-foreground hover:bg-primary hover:text-white hover:border-primary transition-all group-hover:scale-105">
                                  <Download size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="p-5 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
                            <p className="text-sm font-bold text-muted-foreground">{fileAttachments.length} files · {fileAttachments.reduce((a, f) => a + parseFloat(f.size), 0).toFixed(1)} MB total</p>
                            <button onClick={() => toast.success("Preparing download...", { description: "All files packaged as a .zip" })}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                              <Download size={14} /> Download All
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

              </motion.div>
            </AnimatePresence>

            {/* ─── Comments Section ─── */}
            <section className="mt-32 pt-20 border-t border-border">
              <div className="flex items-center gap-4 mb-14">
                <div className="w-2 h-10 bg-primary rounded-full shadow-glow-cyan" />
                <h3 className="text-3xl font-black font-display tracking-tight">Transmissions</h3>
                <span className="px-4 py-1.5 rounded-full bg-muted border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">{comments.length}</span>
              </div>

              {/* Post Comment */}
              <div className="flex gap-4 mb-14">
                <img src={authUser?.avatar ?? "https://i.pravatar.cc/100?u=guest"} alt="you" className="w-11 h-11 rounded-full border-2 border-border shrink-0 mt-1" />
                <div className="flex-1 bg-card/60 border border-border rounded-[20px] p-5 flex flex-col gap-4">
                  <textarea
                    value={commentBody}
                    onChange={e => setCommentBody(e.target.value)}
                    placeholder={isAuthenticated ? "Add your transmission…" : "Login to post a comment…"}
                    disabled={!isAuthenticated}
                    rows={3}
                    className="w-full bg-transparent outline-none resize-none text-sm font-medium text-foreground placeholder:text-muted-foreground/40 disabled:cursor-not-allowed"
                  />
                  <div className="flex justify-end">
                    <Button variant="primary" icon={<Send size={14} />} onClick={handlePostComment} className="h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                      Post
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comment List */}
              <div className="flex flex-col gap-10">
                {comments.length === 0 ? (
                  <div className="py-20 text-center">
                    <MessageSquare size={40} className="text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No transmissions yet. Be the first.</p>
                  </div>
                ) : (
                  comments.map(c => <CommentItem key={c.id} comment={c} />)
                )}
              </div>
            </section>
          </div>
        </main>

        {/* Mobile Actions */}
        <div className="fixed bottom-8 left-0 right-0 z-50 px-5 lg:hidden">
          <div className="w-full max-w-md mx-auto h-18 bg-card/90 backdrop-blur-3xl border border-border rounded-[28px] flex items-center justify-between px-7 py-4 shadow-3xl">
            <div className="flex gap-5">
              <button onClick={handleStar} className={`p-2 transition-all ${isStarred ? "text-amber-500 scale-110" : "text-muted-foreground"}`}>
                <Star size={26} className={isStarred ? "fill-amber-500" : ""} />
              </button>
              <button onClick={handleFork} className="p-2 text-muted-foreground hover:text-primary transition-all"><GitFork size={26} /></button>
            </div>
            <Button variant="primary" className="h-12 px-8 rounded-[18px] text-[11px] font-black tracking-widest uppercase shadow-xl shadow-primary/20" onClick={handleReplicate}>Replicate</Button>
          </div>
        </div>

        <footer className="relative z-10 py-20 border-t border-border bg-card/80 backdrop-blur-3xl">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <Logo size="md" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30 mt-8">SECURED REPOSITORY // LAB_DOCS_v1.0</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
