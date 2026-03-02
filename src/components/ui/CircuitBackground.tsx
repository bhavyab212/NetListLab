"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '../../stores/themeStore';

export default function CircuitBackground({ opacity }: { opacity?: number } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = useThemeStore(s => s.isDark);
  const themeRef = useRef(isDark ? 0.0 : 1.0);

  useEffect(() => {
    themeRef.current = isDark ? 0.0 : 1.0;
  }, [isDark]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

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
      uniform float uTheme;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float hash2(vec2 p) {
        return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453123);
      }

      float pcbTrace(vec2 uv, vec2 cellId, float gridScale) {
        vec2 cellUv = fract(uv * gridScale);
        float h = hash(cellId);
        float h2 = hash2(cellId);
        float line = 0.0;
        float lineWidth = 0.015;
        if (h > 0.25) {
          float startX = h > 0.6 ? 0.0 : 0.3;
          float endX = h > 0.4 ? 1.0 : 0.7;
          if (cellUv.x > startX && cellUv.x < endX)
            line += smoothstep(lineWidth, 0.0, abs(cellUv.y - 0.5));
        }
        if (h2 > 0.35) {
          float startY = h2 > 0.55 ? 0.0 : 0.35;
          float endY = h2 > 0.5 ? 1.0 : 0.65;
          if (cellUv.y > startY && cellUv.y < endY)
            line += smoothstep(lineWidth, 0.0, abs(cellUv.x - 0.5));
        }
        if (h > 0.7 && h2 > 0.5) {
          if (cellUv.x > 0.5 && cellUv.y > 0.25 && cellUv.y < 0.35)
            line += smoothstep(lineWidth, 0.0, abs(cellUv.y - 0.3));
          if (cellUv.y > 0.3 && cellUv.y < 0.75 && cellUv.x > 0.75 && cellUv.x < 0.85)
            line += smoothstep(lineWidth, 0.0, abs(cellUv.x - 0.8));
        }
        return clamp(line, 0.0, 1.0);
      }

      float icPad(vec2 cellUv, float h) {
        if (h < 0.82) return 0.0;
        vec2 center = vec2(0.5, 0.5);
        vec2 size = vec2(0.12, 0.08);
        vec2 d = abs(cellUv - center) - size;
        float rect = smoothstep(0.015, 0.0, abs(max(d.x, d.y)));
        float pins = 0.0;
        for (float i = -1.0; i <= 1.0; i += 1.0) {
          vec2 pinPos = center + vec2(i * 0.06, size.y + 0.03);
          pins += smoothstep(0.015, 0.005, length(cellUv - pinPos));
          pinPos = center + vec2(i * 0.06, -size.y - 0.03);
          pins += smoothstep(0.015, 0.005, length(cellUv - pinPos));
        }
        return clamp(rect + pins, 0.0, 1.0);
      }

      float solderPad(vec2 cellUv, float h) {
        if (h < 0.4) return 0.0;
        float dotSize = 0.02 + h * 0.015;
        float pad = smoothstep(dotSize, dotSize * 0.3, length(cellUv - vec2(0.5)));
        float ring = smoothstep(dotSize + 0.008, dotSize + 0.003, length(cellUv - vec2(0.5)))
                   * smoothstep(dotSize * 0.4, dotSize * 0.6, length(cellUv - vec2(0.5)));
        return pad * 0.3 + ring * 0.5;
      }

      float dataPacket(vec2 cellUv, vec2 cellId, float time) {
        float h = hash(cellId + 42.0);
        if (h < 0.6) return 0.0;
        float speed = 0.8 + h * 1.5;
        float progress = fract(time * speed * 0.15 + h * 6.28);
        vec2 packetPos = vec2(progress, 0.5);
        float d = length(cellUv - packetPos);
        return smoothstep(0.04, 0.01, d) * (sin(time * 3.0 + h * 10.0) * 0.3 + 0.7);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        vec2 mouse = iMouse / iResolution.xy;
        float aspect = iResolution.x / iResolution.y;
        uv.x *= aspect;
        mouse.x *= aspect;

        float dist = distance(uv, mouse);
        float probeGlow = exp(-dist * 6.0) * 0.2;
        float warp = exp(-dist * 10.0) * 0.08;
        uv += (uv - mouse) * warp;

        float gridScale1 = 8.0;
        float gridScale2 = 16.0;
        vec2 cellId1 = floor(uv * gridScale1);
        vec2 cellUv1 = fract(uv * gridScale1);
        vec2 cellId2 = floor(uv * gridScale2);
        vec2 cellUv2 = fract(uv * gridScale2);
        float h1 = hash(cellId1);

        float trace1 = pcbTrace(uv, cellId1, gridScale1);
        float trace2 = pcbTrace(uv, cellId2, gridScale2) * 0.3;
        float ic = icPad(cellUv1, h1);
        float solder = solderPad(cellUv1, h1);
        float data1 = dataPacket(cellUv1, cellId1, iTime);
        float data2 = dataPacket(cellUv2, cellId2, iTime + 3.0) * 0.4;
        float pulse = sin(iTime * 2.0 + h1 * 6.28) * 0.5 + 0.5;
        float nodePulse = smoothstep(0.08, 0.02, length(cellUv1 - 0.5)) * pulse * (h1 > 0.7 ? 1.0 : 0.0);

        vec3 traceColorDark = vec3(0.0, 0.78, 0.94);
        vec3 padColorDark = vec3(0.96, 0.65, 0.14);
        vec3 dataColorDark = vec3(0.0, 0.91, 0.48);
        vec3 pulseColorDark = vec3(0.96, 0.25, 0.37);
        vec3 probeColorDark = vec3(0.0, 0.85, 1.0);
        vec3 traceColorLight = vec3(0.35, 0.55, 0.75);
        vec3 padColorLight = vec3(0.45, 0.55, 0.70);
        vec3 dataColorLight = vec3(0.0, 0.55, 0.75);
        vec3 pulseColorLight = vec3(0.0, 0.60, 0.80);
        vec3 probeColorLight = vec3(0.0, 0.50, 0.80);

        vec3 traceColor = mix(traceColorDark, traceColorLight, uTheme);
        vec3 padColor = mix(padColorDark, padColorLight, uTheme);
        vec3 dataColor = mix(dataColorDark, dataColorLight, uTheme);
        vec3 pulseColor = mix(pulseColorDark, pulseColorLight, uTheme);
        vec3 probeColor = mix(probeColorDark, probeColorLight, uTheme);

        float intensity = mix(1.0, 0.45, uTheme);
        vec3 color = vec3(0.0);
        color += traceColor * (trace1 + trace2) * 0.45 * intensity;
        color += padColor * (ic + solder) * 0.8 * intensity;
        color += dataColor * (data1 + data2) * 1.2 * intensity;
        color += pulseColor * nodePulse * 0.7 * intensity;
        color += probeColor * probeGlow * 2.0 * intensity;
        float revealRadius = smoothstep(0.35, 0.0, dist);
        color += traceColor * trace2 * revealRadius * 1.5 * intensity;
        float grain = hash(uv + fract(iTime * 0.7)) * 0.02 * intensity;
        color += grain;

        float alpha = clamp(
          (trace1 + trace2 * 0.5 + ic + solder + data1 + data2 +
           nodePulse * 0.5 + probeGlow * 3.0 + grain) * intensity,
          0.0, 1.0
        );
        gl_FragColor = vec4(color, alpha * 0.85);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      iResolution: { value: new THREE.Vector2() },
      iTime: { value: 0 },
      iMouse: { value: new THREE.Vector2() },
      uTheme: { value: themeRef.current },
    };

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      uniforms.iResolution.value.set(clientWidth, clientHeight);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      uniforms.iMouse.value.set(e.clientX - rect.left, rect.height - (e.clientY - rect.top));
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    resize();

    let animationId: number;
    const animate = () => {
      uniforms.iTime.value = clock.getElapsedTime();
      uniforms.uTheme.value += (themeRef.current - uniforms.uTheme.value) * 0.05;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
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
        opacity: opacity !== undefined ? opacity : (isDark ? 0.20 : 0.30),
        transition: 'opacity 0.3s ease',
      }}
    />
  );
}
