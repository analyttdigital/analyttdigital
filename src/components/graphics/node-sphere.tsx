'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * NodeSphere — the sectors' globe.
 *
 * An ink wireframe sphere with a ring of ember nodes, turning idly and
 * taking spin from a drag: press and pull to rotate it, and it keeps the
 * momentum you give it before settling back to its idle turn. Raw three.js
 * (the same pattern as hero-gather-scene.ts) so it runs on React 18 — no
 * R3F. Ambient, not informational — the sector index itself is read from
 * the DOM chips beside it. Loaded client-only via `next/dynamic`.
 */

const RING = 14;

export default function NodeSphere({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const velocity = useRef(0);
  const drag = useRef<number | null>(null);

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
    camera.position.z = 5.2;

    const group = new THREE.Group();
    group.rotation.x = 0.35;
    scene.add(group);

    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 18, 14),
      new THREE.MeshBasicMaterial({ color: '#6c618c', wireframe: true, transparent: true, opacity: 0.3 }),
    );
    group.add(wire);

    const skin = new THREE.Mesh(
      new THREE.SphereGeometry(1.52, 48, 32),
      new THREE.MeshBasicMaterial({ color: '#4f4b63', transparent: true, opacity: 0.06, depthWrite: false }),
    );
    group.add(skin);

    const ember = new THREE.MeshBasicMaterial({ color: '#f04f26' });
    const violet = new THREE.MeshBasicMaterial({ color: '#4f4b63' });
    const dotBig = new THREE.SphereGeometry(0.075, 12, 12);
    const dotSmall = new THREE.SphereGeometry(0.05, 12, 12);
    for (let i = 0; i < RING; i++) {
      const a = (i / RING) * Math.PI * 2;
      const node = new THREE.Mesh(i % 4 === 0 ? dotBig : dotSmall, i % 4 === 0 ? ember : violet);
      node.position.set(Math.cos(a) * 1.9, i % 2 === 0 ? 0.55 : -0.55, Math.sin(a) * 1.9);
      group.add(node);
    }

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
      velocity.current = THREE.MathUtils.damp(velocity.current, 0, 1.6, dt);
      group.rotation.y += dt * (0.16 + velocity.current);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      wire.geometry.dispose();
      skin.geometry.dispose();
      dotBig.dispose();
      dotSmall.dispose();
      ember.dispose();
      violet.dispose();
      (wire.material as THREE.Material).dispose();
      (skin.material as THREE.Material).dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      aria-hidden
      ref={host}
      className={`cursor-grab touch-pan-y active:cursor-grabbing ${className ?? ''}`}
      onPointerDown={(e) => {
        drag.current = e.clientX;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (drag.current === null) return;
        const dx = e.clientX - drag.current;
        drag.current = e.clientX;
        velocity.current = THREE.MathUtils.clamp(velocity.current + dx * 0.02, -6, 6);
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    />
  );
}
