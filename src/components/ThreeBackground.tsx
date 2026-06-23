import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function ThreeBackgroundFallback() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.clientHeight || window.innerHeight);

    // Build floating panels simulating the monoliths
    const panels = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      w: 40 + Math.random() * 60,
      h: 120 + Math.random() * 150,
      speed: 0.15 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.02 + Math.random() * 0.04,
    }));

    // Particle nodes
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: 1.5 + Math.random() * 2.5,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = canvas.clientWidth || window.innerWidth;
        height = canvas.height = canvas.clientHeight || window.innerHeight;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    let tick = 0;
    const draw = () => {
      tick += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Inertia mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const offsetX = mouseRef.current.x * 30;
      const offsetY = -mouseRef.current.y * 30;

      // 1. Draw architectural grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      
      // Draw vertical lines
      const gridOffsetX = offsetX % gridSize;
      for (let x = gridOffsetX; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      // Draw horizontal lines
      const gridOffsetY = offsetY % gridSize;
      for (let y = gridOffsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw floating monolith card slices with subtle projections
      panels.forEach((p, i) => {
        const floatY = Math.sin(tick * p.speed + p.phase) * 30;
        const currentX = p.x + offsetX * (0.3 + i * 0.1);
        const currentY = p.y + floatY + offsetY * (0.3 + i * 0.1);

        // Solid translucent background
        ctx.fillStyle = `rgba(12, 12, 12, ${p.opacity})`;
        ctx.fillRect(currentX, currentY, p.w, p.h);

        // Elegant wireframe contour
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.strokeRect(currentX, currentY, p.w, p.h);

        // Isometric top projections to emphasize architectural depth
        ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
        ctx.beginPath();
        ctx.moveTo(currentX, currentY);
        ctx.lineTo(currentX + 10, currentY - 8);
        ctx.lineTo(currentX + p.w + 10, currentY - 8);
        ctx.lineTo(currentX + p.w, currentY);
        ctx.closePath();
        ctx.fillStyle = `rgba(12, 12, 12, ${p.opacity * 1.5})`;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(currentX + p.w, currentY);
        ctx.lineTo(currentX + p.w + 10, currentY - 8);
        ctx.lineTo(currentX + p.w + 10, currentY + p.h - 8);
        ctx.lineTo(currentX + p.w, currentY + p.h);
        ctx.closePath();
        ctx.fillStyle = `rgba(12, 12, 12, ${p.opacity * 0.8})`;
        ctx.fill();
        ctx.stroke();
      });

      // 3. Draw drafting particle nodes with coordinate lines
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const px = p.x + offsetX * 0.5;
        const py = p.y + offsetY * 0.5;

        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Crosshair node markers
        if (i % 6 === 0) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(px - 5, py); ctx.lineTo(px + 5, py);
          ctx.moveTo(px, py - 5); ctx.lineTo(px, py + 5);
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [webglError, setWebglError] = useState<boolean>(false);

  useEffect(() => {
    // Pre-flight check for WebGL support or sandbox blockages
    const testWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        return !!ctx;
      } catch (e) {
        return false;
      }
    };

    if (!testWebGL()) {
      console.warn("WebGL not supported or blocked by browser/sandbox. Activating structural 2D drafting fallback canvas.");
      setWebglError(true);
      return;
    }

    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    // 3. Renderer Setup with Try/Catch Block
    let renderer: THREE.WebGLRenderer;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("WebGL context lost dynamically in ThreeBackground. Switching to 2D drafting mode.");
      setWebglError(true);
    };

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false);
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn("WebGLRenderer failed to initialize. Activating structural 2D drafting fallback canvas.", e);
      setWebglError(true);
      return;
    }

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0); // Clean white backlight
    dirLight1.position.set(10, 20, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xcccccc, 0.8); // Muted silver keylight
    dirLight2.position.set(-10, -5, 10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.2, 30); // Quiet structural light pulse
    pointLight.position.set(0, 2, 5);
    scene.add(pointLight);

    // 5. Objects: Responsive Architectural Grid
    const gridHelper = new THREE.GridHelper(40, 40, 0x444444, 0x111111);
    gridHelper.position.y = -4;
    scene.add(gridHelper);

    // Floating Architectural Prisms (Monoliths representing structures)
    const monolithGroup = new THREE.Group();
    const monoliths: { mesh: THREE.Mesh; speed: number; phase: number; range: number }[] = [];

    const monolithCount = window.innerWidth < 768 ? 6 : 12; // Fewer on mobile for high fluid frame rates
    const geometries = [
      new THREE.BoxGeometry(1.5, 6, 1.5),
      new THREE.BoxGeometry(2, 4, 2),
      new THREE.BoxGeometry(1, 8, 1),
    ];

    // Minimal dark architectural concrete materials
    const concreteMaterial = new THREE.MeshStandardMaterial({
      color: 0x0c0c0c,
      roughness: 0.9,
      metalness: 0.2,
      wireframe: false,
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff, // White wireframe grid overlay
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });

    for (let i = 0; i < monolithCount; i++) {
      const geo = geometries[i % geometries.length];
      const mesh = new THREE.Mesh(geo, concreteMaterial);
      
      // Wireframe overlay to emphasize 3D wireframe modeling work
      const wireframeMesh = new THREE.Mesh(geo.clone(), wireframeMaterial);
      wireframeMesh.scale.multiplyScalar(1.01);
      mesh.add(wireframeMesh);

      // Random arrangement
      const angle = (i / monolithCount) * Math.PI * 2;
      const radius = 10 + Math.random() * 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -2 + Math.random() * 3;

      mesh.position.set(x, y, z);
      
      // Rotation
      mesh.rotation.x = Math.random() * 0.2;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * 0.2;

      monolithGroup.add(mesh);
      monoliths.push({
        mesh,
        speed: 0.2 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        range: 1 + Math.random() * 1.5,
      });
    }
    scene.add(monolithGroup);

    // Floating drafting particle nodes (architectural coordinate nodes)
    const particleCount = 60;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40; // X
      positions[i + 1] = (Math.random() - 0.5) * 20 + 2; // Y
      positions[i + 2] = (Math.random() - 0.5) * 40; // Z
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    
    // Tiny elegant squares representing crosshairs
    const canvasPoint = document.createElement("canvas");
    canvasPoint.width = 16;
    canvasPoint.height = 16;
    const ctx = canvasPoint.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(8, 2); ctx.lineTo(8, 14);
      ctx.moveTo(2, 8); ctx.lineTo(14, 8);
      ctx.stroke();
    }
    const particleTexture = new THREE.CanvasTexture(canvasPoint);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.5,
      map: particleTexture,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Handle Mouse Movement
    const handleMouseMove = (e: MouseEvent) => {
      // Map to -1 to 1 range
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 7. Handle Resize
    let resizeObserver: ResizeObserver | null = null;
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w && h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", handleResize);
    }

    // 8. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Fluidly interpolate mouse values for luxury inertia effect
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Camera responds to mouse for premium space tracking parallax
      camera.position.x = mouseRef.current.x * 5;
      camera.position.y = 5 + mouseRef.current.y * 3;
      camera.lookAt(0, 0, 0);

      // Rotate group around slightly
      monolithGroup.rotation.y = elapsedTime * 0.02 + mouseRef.current.x * 0.1;

      // Animate monolith floats (vertical organic breathing movement)
      monoliths.forEach((item) => {
        item.mesh.position.y = Math.sin(elapsedTime * item.speed + item.phase) * item.range;
      });

      // Subtle particle float
      const positionsArray = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positionsArray.length; i += 3) {
        positionsArray[i] += Math.sin(elapsedTime * 0.5 + i) * 0.005; // Ambient wave float
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.01;

      // Pulse direct light
      pointLight.position.x = Math.sin(elapsedTime * 0.8) * 8;
      pointLight.position.z = Math.cos(elapsedTime * 0.5) * 8;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }
      cancelAnimationFrame(animationFrameId);

      // Dispose Three assets helper
      scene.clear();
      geometries.forEach(geo => geo.dispose());
      concreteMaterial.dispose();
      wireframeMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      
      if (renderer) {
        if (renderer.domElement) {
          renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
        }
        renderer.dispose();
      }

      if (container && renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (webglError) {
    return <ThreeBackgroundFallback />;
  }

  return (
    <div
      ref={containerRef}
      id="three-bg-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
