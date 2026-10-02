'use client';

import { useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useEffect, useRef } from 'react';
import {
  Color,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';

/**
 * SurveyField — the page background, and the site's one authored moment.
 *
 * The sheet is surveyed rather than decorated. A single full-bleed quad runs
 * a topographic field: the elevation is contour density, minor contours are
 * hairline ink, every fourth is an index contour, and the spot colour only
 * appears on the highest ground (the peak rule of a survey sheet). The
 * visitor's scroll drags a **transect** — a cut line with distance ticks —
 * across the field from the head of the page to the foot of it.
 *
 * Why one shader instead of a particle system: the brief is measurement, and
 * a contour field is the world's own instrument. It costs one quad, one
 * fragment pass and no textures, so it stays smooth on the low-power devices
 * and constrained connections this audience actually reads on.
 *
 * Performance contract:
 * - DPR capped at 1.5; no lights, no shadows, no post-processing.
 * - 30fps while the page is settling, 12fps once idle, 0 when the tab is
 *   hidden or WebGL reports a lost context.
 * - `prefers-reduced-motion` renders exactly one static frame; the CSS
 *   ground beneath stays visible either way, so a failed context costs
 *   nothing but the contours.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Full-clip quad: no camera transform, no matrices, one vertex pass.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2  uRes;
  uniform float uTime;
  uniform float uScroll;
  uniform vec3  uInk;
  uniform vec3  uSpot;

  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      sum += amp * vnoise(p);
      p *= 2.03;
      amp *= 0.5;
    }
    return sum;
  }

  // A 1px-wide line at frequency f, antialiased with screen-space
  // derivatives so the contours hold their weight at any DPR or zoom.
  float lineAt(float f) {
    float d = abs(fract(f - 0.5) - 0.5) / max(fwidth(f), 0.0001);
    return 1.0 - min(d, 1.0);
  }

  void main() {
    vec2 res = uRes;
    float aspect = res.x / max(res.y, 1.0);
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);

    // Flying the survey: the field advances with the page, the way ground
    // passes under a low-flying aircraft, and drifts very slowly on its own.
    p.y += uScroll * 1.75;
    p.x += sin(uScroll * 3.14159) * 0.10;

    float n = fbm(p * 1.85 + vec2(uTime * 0.012, uTime * 0.004));

    // Ridged, so contours close into summits and valleys instead of noise.
    float ridge = 1.0 - abs(2.0 * n - 1.0);
    float h = ridge * 0.74 + n * 0.26;

    /* ---- contours -------------------------------------------------- */
    const float LEVELS = 13.0;
    float f = h * LEVELS;
    float minor = lineAt(f);
    float major = lineAt(f * 0.25) ;          // every fourth index contour
    float onHighGround = smoothstep(0.74, 0.93, h);

    vec3 col = mix(uInk, uSpot, onHighGround * 0.92);
    float a = minor * (0.055 + 0.085 * major) + major * 0.05;
    a *= 1.0 - 0.35 * smoothstep(0.55, 1.0, h) * (1.0 - major);

    /* ---- spot heights ---------------------------------------------- */
    // The survey's own summit marks: a scattered field of filled dots on
    // high ground, exactly as spot heights are stamped on a contour sheet.
    vec2 sp = p * 2.4;
    vec2 cell = floor(sp);
    vec2 local = fract(sp) - 0.5;
    float pick = hash21(cell + 17.3);
    float summit = step(0.60, pick);
    float dot = 1.0 - smoothstep(0.030, 0.052, length(local));
    float dotA = dot * summit * smoothstep(0.62, 0.86, h);

    /* ---- transect --------------------------------------------------- */
    // The cut line the reader drags down the sheet, with distance ticks
    // every 1/24th of the measure and longer ticks every third.
    float cy = mix(0.965, 0.035, uScroll);
    float px = 1.6 / max(res.y, 1.0);
    float cut = 1.0 - smoothstep(0.0, px * 1.4, abs(vUv.y - cy));

    float band = 1.0 - smoothstep(0.0, 0.014, abs(vUv.y - (cy - 0.016)));
    float tickX = lineAt(vUv.x * 24.0);
    float tickLong = lineAt(vUv.x * 8.0);
    float ticks = band * (tickX * 0.34 + tickLong * 0.5);

    // The bearing tick: a heavier mark every eighth of the measure, so the
    // eye can count progress across the sheet.
    float bearing = band * lineAt(vUv.x * 8.0 + 0.5) * step(0.5, vUv.x) * 0.18;

    vec3 transectCol = mix(uInk, uSpot, 0.55);
    float transectA = max(cut * 0.5, max(ticks, bearing));

    /* ---- compose ---------------------------------------------------- */
    col = mix(col, transectCol, step(transectA, 0.999) * clamp(transectA * 2.4, 0.0, 1.0));
    col = mix(col, uSpot, dotA);
    a = max(a, dotA * 0.5);
    a = max(a, transectA);

    if (a < 0.002) discard;
    gl_FragColor = vec4(col * a, a);
  }
`;

function rgbChannels(raw: string, fallback: [number, number, number]) {
  const parts = raw
    .trim()
    .split(/[\s,]+/)
    .map((part) => Number.parseFloat(part));
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return fallback;
  return [parts[0] / 255, parts[1] / 255, parts[2] / 255] as [number, number, number];
}

export function SurveyField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scrollTarget = useRef(0);
  const lastScrollAt = useRef(0);

  // Scroll position comes from Framer's scroll value, never a scroll
  // listener, so it stays in step with Lenis without extra work.
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    scrollTarget.current = value;
    lastScrollAt.current = performance.now();
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return; // No WebGL: the CSS ground beneath is the whole background.
    }
    if (!renderer.getContext()) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const ink = rgbChannels(rootStyle.getPropertyValue('--color-ink-900'), [0.1, 0.1, 0.13]);
    const spot = rgbChannels(rootStyle.getPropertyValue('--color-accent-500'), [0.94, 0.31, 0.15]);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uRes: { value: new Vector2(1, 1) },
        uTime: { value: reduce ? 12 : 0 },
        uScroll: { value: reduce ? 0.34 : 0 },
        uInk: { value: new Color(ink[0], ink[1], ink[2]) },
        uSpot: { value: new Color(spot[0], spot[1], spot[2]) },
      },
    });
    const quad = new Mesh(new PlaneGeometry(2, 2), material);
    quad.frustumCulled = false;
    scene.add(quad);

    const size = new Vector2();
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(dpr);
      renderer.getSize(size);
      renderer.setSize(size.x || window.innerWidth, size.y || window.innerHeight, false);
      material.uniforms.uRes.value.set(size.x * dpr, size.y * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    let scrollNow = reduce ? 0.34 : 0;
    let raf = 0;
    let lastDraw = 0;
    let alive = true;

    const draw = (now: number) => {
      if (!alive) return;
      raf = window.requestAnimationFrame(draw);
      if (document.hidden) return;

      // 30fps while the page is settling under the reader, 12fps once it
      // has stopped. The field is slow; nobody can see the difference.
      const settling = now - lastScrollAt.current < 900;
      const interval = settling ? 33 : 84;
      if (now - lastDraw < interval) return;
      lastDraw = now;

      const target = reduce ? 0.34 : scrollTarget.current;
      scrollNow += (target - scrollNow) * 0.14;
      material.uniforms.uScroll.value = scrollNow;
      if (!reduce) material.uniforms.uTime.value = now / 1000;
      renderer.render(scene, camera);
    };

    if (reduce) {
      // One static frame: the sheet still has its contours, they never move.
      material.uniforms.uScroll.value = 0.34;
      material.uniforms.uTime.value = 12;
      renderer.render(scene, camera);
    } else {
      raf = window.requestAnimationFrame(draw);
    }

    const onVisibility = () => {
      if (!document.hidden && !reduce && alive && !raf) raf = window.requestAnimationFrame(draw);
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      alive = false;
      cancelAnimationFrame(raf);
    };
    document.addEventListener('visibilitychange', onVisibility);
    canvas.addEventListener('webglcontextlost', onContextLost);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reduce]);

  return (
    <>
      {/* Static ground: always present, so a lost context or a blocked GPU
          costs the contours and nothing else. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundColor: 'rgb(var(--color-mist-100))',
          backgroundImage:
            'radial-gradient(60rem 40rem at 78% -8%, rgb(var(--color-accent-100) / 0.5), transparent 62%), radial-gradient(52rem 38rem at 4% 108%, rgb(var(--color-ink-100) / 0.65), transparent 60%)',
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        style={{ filter: 'blur(0.001px)' }}
      />
    </>
  );
}
