'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SignalOrb — a particle shell around an ember wireframe core.
 *
 * The close's backdrop: a fibonacci shell of violet motes with ember packets
 * scattered through it, turning slowly and leaning toward the pointer.
 * Raw three.js (the same pattern as hero-gather-scene.ts) so it runs on
 * React 18 — no R3F. Ambient, not informational: loaded client-only via
 * `next/dynamic`, and sections render a static gradient in its place when
 * it is absent or when motion is reduced.
 */

const COUNT = 950;

export default function SignalOrb({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return;
    }
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 5.6;

    const group = new THREE.Group();
    scene.add(group);

    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const ember = new THREE.Color('#f04f26');
    const violet = new THREE.Color('#6c618c');
    for (let i = 0; i < COUNT; i++) {
      const t = (i + 0.5) / COUNT;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.15 + (Math.random() - 0.5) * 0.85;
      positions.set(
        [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)],
        i * 3,
      );
      const c = Math.random() < 0.2 ? ember : violet;
      colors.set([c.r, c.g, c.b], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
      depthWrite: false,
    });
    group.add(new THREE.Points(geo, mat));

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.15, 1),
      new THREE.MeshBasicMaterial({ color: '#f04f26', wireframe: true, transparent: true, opacity: 0.2 }),
    );
    group.add(core);

    let px = 0;
    let py = 0;
    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const clock = new THREE.Clock();
    const loop = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      group.rotation.y += dt * 0.09;
      group.rotation.x = THREE.MathUtils.damp(group.rotation.x, -py * 0.28, 2.4, dt);
      group.rotation.z = THREE.MathUtils.damp(group.rotation.z, px * 0.14, 2.4, dt);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      geo.dispose();
      mat.dispose();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div aria-hidden ref={host} className={className} />;
}
