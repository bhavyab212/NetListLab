import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '../../stores/themeStore';

/**
 * CircuitBackground — Interactive WebGL PCB trace shader.
 *
 * Renders a living circuit board background with:
 *   • Broken PCB traces (horizontal/vertical lines with gaps & L-branches)
 *   • IC pad outlines at intersections that pulse with data flow
 *   • "Data packets" that travel along traces
 *   • Mouse-reactive "signal probe" glow that reveals hidden circuit detail
 *   • Dual-theme: vivid cyan/gold in dark mode, faint subtle traces in light mode
 */
export default function CircuitBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = useThemeStore(s => s.isDark);
  const themeRef = useRef(isDark ? 0.0 : 1.0);

  // Keep themeRef in sync
  useEffect(() => {
    themeRef.current = isDark ? 0.0 : 1.0;
  }, [isDark]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ─── Renderer, Scene, Camera ───────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    // ─── GLSL Shaders ──────────────────────────────────
    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform float uTheme; // 0.0 = dark, 1.0 = light

      // ── Utility ─────────────────────────────────────
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float hash2(vec2 p) {
        return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453123);
      }

      // ── PCB Trace Pattern ───────────────────────────
      // Creates broken traces with L-shaped branches
      float pcbTrace(vec2 uv, vec2 cellId, float gridScale) {
        vec2 cellUv = fract(uv * gridScale);
        float h = hash(cellId);
        float h2 = hash2(cellId);

        float line = 0.0;
        float lineWidth = 0.015;

        // Main horizontal trace (not all cells have one)
        if (h > 0.25) {
          float startX = h > 0.6 ? 0.0 : 0.3;
          float endX = h > 0.4 ? 1.0 : 0.7;
          if (cellUv.x > startX && cellUv.x < endX) {
            line += smoothstep(lineWidth, 0.0, abs(cellUv.y - 0.5));
          }
        }

        // Main vertical trace
        if (h2 > 0.35) {
          float startY = h2 > 0.55 ? 0.0 : 0.35;
          float endY = h2 > 0.5 ? 1.0 : 0.65;
          if (cellUv.y > startY && cellUv.y < endY) {
            line += smoothstep(lineWidth, 0.0, abs(cellUv.x - 0.5));
          }
        }

        // L-shaped branch (some cells get a corner turn)
        if (h > 0.7 && h2 > 0.5) {
          // Horizontal part of L
          if (cellUv.x > 0.5 && cellUv.y > 0.25 && cellUv.y < 0.35) {
            line += smoothstep(lineWidth, 0.0, abs(cellUv.y - 0.3));
          }
          // Vertical part of L
          if (cellUv.y > 0.3 && cellUv.y < 0.75 && cellUv.x > 0.75 && cellUv.x < 0.85) {
            line += smoothstep(lineWidth, 0.0, abs(cellUv.x - 0.8));
          }
        }

        // Short stub traces (resistor/capacitor pads)
        if (h > 0.85) {
          float stubY = 0.2 + h * 0.6;
          if (cellUv.x > 0.1 && cellUv.x < 0.35) {
            line += smoothstep(lineWidth * 0.8, 0.0, abs(cellUv.y - stubY)) * 0.6;
          }
        }

        return clamp(line, 0.0, 1.0);
      }

      // ── IC Chip Pad ─────────────────────────────────
      float icPad(vec2 cellUv, float h) {
        if (h < 0.82) return 0.0;

        // Draw a small rectangle outline (IC package)
        vec2 center = vec2(0.5, 0.5);
        vec2 size = vec2(0.12, 0.08);
        vec2 d = abs(cellUv - center) - size;
        float rect = smoothstep(0.015, 0.0, abs(max(d.x, d.y)));

        // Pin dots on top/bottom
        float pins = 0.0;
        for (float i = -1.0; i <= 1.0; i += 1.0) {
          vec2 pinPos = center + vec2(i * 0.06, size.y + 0.03);
          pins += smoothstep(0.015, 0.005, length(cellUv - pinPos));
          pinPos = center + vec2(i * 0.06, -size.y - 0.03);
          pins += smoothstep(0.015, 0.005, length(cellUv - pinPos));
        }

        return clamp(rect + pins, 0.0, 1.0);
      }

      // ── Solder Pad / Via ────────────────────────────
      float solderPad(vec2 cellUv, float h) {
        if (h < 0.4) return 0.0;
        float dotSize = 0.02 + h * 0.015;
        float pad = smoothstep(dotSize, dotSize * 0.3, length(cellUv - vec2(0.5)));
        // Annular ring (donut shape for via)
        float ring = smoothstep(dotSize + 0.008, dotSize + 0.003, length(cellUv - vec2(0.5)))
                   * smoothstep(dotSize * 0.4, dotSize * 0.6, length(cellUv - vec2(0.5)));
        return pad * 0.3 + ring * 0.5;
      }

      // ── Data Flow Animation ─────────────────────────
      float dataPacket(vec2 cellUv, vec2 cellId, float time) {
        float h = hash(cellId + 42.0);
        if (h < 0.6) return 0.0;

        float speed = 0.8 + h * 1.5;
        float progress = fract(time * speed * 0.15 + h * 6.28);

        // Packet travels along horizontal trace
        vec2 packetPos = vec2(progress, 0.5);
        float d = length(cellUv - packetPos);
        float pkt = smoothstep(0.04, 0.01, d) * (sin(time * 3.0 + h * 10.0) * 0.3 + 0.7);

        return pkt;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        vec2 mouse = iMouse / iResolution.xy;

        // Aspect ratio correction
        float aspect = iResolution.x / iResolution.y;
        uv.x *= aspect;
        mouse.x *= aspect;

        // ── Mouse interaction: "signal probe" ─────────
        float dist = distance(uv, mouse);
        float probeGlow = exp(-dist * 6.0) * 0.2;
        // Subtle warp near cursor
        float warp = exp(-dist * 10.0) * 0.08;
        uv += (uv - mouse) * warp;

        // ── Grid scales (two layers for depth) ────────
        float gridScale1 = 8.0;
        float gridScale2 = 16.0;

        vec2 cellId1 = floor(uv * gridScale1);
        vec2 cellUv1 = fract(uv * gridScale1);
        vec2 cellId2 = floor(uv * gridScale2);
        vec2 cellUv2 = fract(uv * gridScale2);

        float h1 = hash(cellId1);
        float h2 = hash(cellId2);

        // ── Traces ────────────────────────────────────
        float trace1 = pcbTrace(uv, cellId1, gridScale1);
        float trace2 = pcbTrace(uv, cellId2, gridScale2) * 0.3;

        // ── IC pads & solder points ───────────────────
        float ic = icPad(cellUv1, h1);
        float solder = solderPad(cellUv1, h1);

        // ── Data flow ─────────────────────────────────
        float data1 = dataPacket(cellUv1, cellId1, iTime);
        float data2 = dataPacket(cellUv2, cellId2, iTime + 3.0) * 0.4;

        // ── Pulsing at intersections ──────────────────
        float pulse = sin(iTime * 2.0 + h1 * 6.28) * 0.5 + 0.5;
        float nodePulse = smoothstep(0.08, 0.02, length(cellUv1 - 0.5))
                        * pulse * (h1 > 0.7 ? 1.0 : 0.0);

        // ── Compose colour ────────────────────────────
        // DARK MODE colours
        vec3 traceColorDark = vec3(0.0, 0.78, 0.94);       // Cyan — #00C8F0
        vec3 padColorDark = vec3(0.96, 0.65, 0.14);        // Gold — #F5A623
        vec3 dataColorDark = vec3(0.0, 0.91, 0.48);        // Green — #00E87A
        vec3 pulseColorDark = vec3(0.96, 0.25, 0.37);      // Coral — #F43F5E
        vec3 probeColorDark = vec3(0.0, 0.85, 1.0);        // Bright cyan

        // LIGHT MODE colours (visible but tasteful)
        vec3 traceColorLight = vec3(0.35, 0.55, 0.75);     // Steel blue — clearly visible
        vec3 padColorLight = vec3(0.45, 0.55, 0.70);       // Deeper steel
        vec3 dataColorLight = vec3(0.0, 0.55, 0.75);       // Teal blue
        vec3 pulseColorLight = vec3(0.0, 0.60, 0.80);      // Vibrant teal
        vec3 probeColorLight = vec3(0.0, 0.50, 0.80);      // Strong blue probe

        // Mix based on theme
        vec3 traceColor = mix(traceColorDark, traceColorLight, uTheme);
        vec3 padColor = mix(padColorDark, padColorLight, uTheme);
        vec3 dataColor = mix(dataColorDark, dataColorLight, uTheme);
        vec3 pulseColor = mix(pulseColorDark, pulseColorLight, uTheme);
        vec3 probeColor = mix(probeColorDark, probeColorLight, uTheme);

        // Intensity multiplier: bright in dark, clearly visible in light
        float intensity = mix(1.0, 0.45, uTheme);

        vec3 color = vec3(0.0);
        color += traceColor * (trace1 + trace2) * 0.45 * intensity;
        color += padColor * (ic + solder) * 0.8 * intensity;
        color += dataColor * (data1 + data2) * 1.2 * intensity;
        color += pulseColor * nodePulse * 0.7 * intensity;
        color += probeColor * probeGlow * 2.0 * intensity;

        // Mouse-proximity reveals more trace detail
        float revealRadius = smoothstep(0.35, 0.0, dist);
        color += traceColor * trace2 * revealRadius * 1.5 * intensity;

        // Subtle film grain for texture
        float grain = hash(uv + fract(iTime * 0.7)) * 0.02 * intensity;
        color += grain;

        // Alpha: transparent where nothing is drawn
        float alpha = clamp(
          (trace1 + trace2 * 0.5 + ic + solder + data1 + data2 +
           nodePulse * 0.5 + probeGlow * 3.0 + grain) * intensity,
          0.0, 1.0
        );

        gl_FragColor = vec4(color, alpha * 0.85);
      }
    `;

    // ─── Geometry & Material ───────────────────────────
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      iResolution: { value: new THREE.Vector2() },
      iTime: { value: 0 },
      iMouse: { value: new THREE.Vector2() },
      uTheme: { value: themeRef.current },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ─── Handlers ──────────────────────────────────────
    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      uniforms.iResolution.value.set(clientWidth, clientHeight);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      uniforms.iMouse.value.set(
        e.clientX - rect.left,
        rect.height - (e.clientY - rect.top)
      );
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    resize();

    // ─── Animation Loop ────────────────────────────────
    let animationId: number;
    const animate = () => {
      uniforms.iTime.value = clock.getElapsedTime();
      // Smoothly interpolate theme uniform
      uniforms.uTheme.value += (themeRef.current - uniforms.uTheme.value) * 0.05;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // ─── Cleanup ───────────────────────────────────────
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
}
