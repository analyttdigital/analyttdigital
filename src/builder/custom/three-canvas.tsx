import { useEffect, useRef } from "react";

/**
 * Procedural three.js canvas (M8 inner). Imported only through
 * `next/dynamic(ssr:false)` from `three-scene.tsx`, with `three` itself
 * lazy-imported inside the effect — no WebGL code runs on the server and the
 * library splits into its own client chunk. Resize is handled with a
 * ResizeObserver; the animation loop, geometry, material, and renderer are
 * all disposed on unmount.
 */

export interface ThreeCanvasProps {
  color: string;
  speed: number;
  autoRotate: boolean;
}

export function ThreeCanvas({ color, speed, autoRotate }: ThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const liveProps = useRef({ color, speed, autoRotate });

  useEffect(() => {
    liveProps.current = { color, speed, autoRotate };
  });

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      const THREE = await import("three");
      if (cancelled || !mountRef.current) return;
      const mount = mountRef.current;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.style.display = "block";
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 5);
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const key = new THREE.DirectionalLight(0xffffff, 1.2);
      key.position.set(4, 4, 4);
      scene.add(key);

      const geometry = new THREE.TorusKnotGeometry(1, 0.32, 128, 32);
      const material = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.1 });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const resize = () => {
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(mount);

      const clock = new THREE.Clock();
      let frame = 0;
      const tick = () => {
        frame = requestAnimationFrame(tick);
        const props = liveProps.current;
        material.color.set(props.color);
        const delta = Math.min(clock.getDelta(), 0.05);
        if (props.autoRotate) {
          mesh.rotation.x += delta * props.speed * 0.4;
          mesh.rotation.y += delta * props.speed;
        }
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (renderer.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    })();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
