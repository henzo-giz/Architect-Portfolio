import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Maximize2, RotateCcw } from "lucide-react";

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}

interface PortfolioViewer2DFallbackProps {
  threeDType: "pavilion" | "tower" | "observatory" | "canopy";
  color?: string;
  className?: string;
}

function PortfolioViewer2DFallback({ threeDType, color = "#06b6d4", className = "" }: PortfolioViewer2DFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wireframeMode, setWireframeMode] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const rotationRef = useRef({ x: -0.3, y: 0.4 });
  const isDragging = useRef<boolean>(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.clientWidth || 300);
    let height = (canvas.height = canvas.clientHeight || 300);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = canvas.clientWidth || 300;
        height = canvas.height = canvas.clientHeight || 300;
      }
    };
    window.addEventListener("resize", handleResize);

    let tick = 0;
    const renderLoop = () => {
      tick += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Auto rotation when idle
      if (!isDragging.current) {
        const spinSpeed = isHovered ? 0.015 : 0.005;
        rotationRef.current.y += spinSpeed;
        rotationRef.current.x = -0.3 + Math.sin(tick * 0.4) * 0.05;
      }

      const vertices: { x: number; y: number; z: number }[] = [];
      const edges: { a: number; b: number }[] = [];

      function addBox(cx: number, cy: number, cz: number, w: number, h: number, d: number) {
        const startIdx = vertices.length;
        const dx = w / 2;
        const dy = h / 2;
        const dz = d / 2;
        // vertices
        for (let x of [-1, 1]) {
          for (let y of [-1, 1]) {
            for (let z of [-1, 1]) {
              vertices.push({ x: cx + dx * x, y: cy + dy * y, z: cz + dz * z });
            }
          }
        }
        // edges
        const boxEdges = [
          [0, 1], [1, 3], [3, 2], [2, 0],
          [4, 5], [5, 7], [7, 6], [6, 4],
          [0, 4], [1, 5], [2, 6], [3, 7]
        ];
        boxEdges.forEach(([a, b]) => edges.push({ a: startIdx + a, b: startIdx + b }));
      }

      function addCylinder(cx: number, cy: number, cz: number, r: number, h: number, segments = 6) {
        const startIdx = vertices.length;
        const halfH = h / 2;
        for (let j = 0; j < segments; j++) {
          const angle = (j / segments) * Math.PI * 2;
          const sx = Math.cos(angle) * r;
          const sz = Math.sin(angle) * r;
          vertices.push({ x: cx + sx, y: cy - halfH, z: cz + sz });
          vertices.push({ x: cx + sx, y: cy + halfH, z: cz + sz });
        }
        for (let j = 0; j < segments; j++) {
          const nextJ = (j + 1) % segments;
          edges.push({ a: startIdx + j * 2, b: startIdx + nextJ * 2 });
          edges.push({ a: startIdx + j * 2 + 1, b: startIdx + nextJ * 2 + 1 });
          edges.push({ a: startIdx + j * 2, b: startIdx + j * 2 + 1 });
        }
      }

      // Populate based on 3D Type
      if (threeDType === "pavilion") {
        // Plates
        addBox(0, -1.2, 0, 3.2, 0.15, 3.2);
        addBox(0, 0, 0, 3.2, 0.15, 3.2);
        addBox(0, 1.2, 0, 3.2, 0.15, 3.2);

        // Columns
        const cols = [
          [-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]
        ];
        cols.forEach(([colX, colZ]) => {
          // Bottom column layer
          addCylinder(colX, -0.6, colZ, 0.1, 1.1, 5);
          // Top column layer
          addCylinder(colX * 0.8, 0.6, colZ * 0.8, 0.08, 1.1, 5);
        });

      } else if (threeDType === "tower") {
        // Twisted Hex Slices
        const slices = 14;
        const segments = 6;
        for (let j = 0; j < slices; j++) {
          const progress = j / slices;
          const r = 1.1 - progress * 0.6;
          const cy = -1.8 + progress * 3.6;
          const twist = progress * Math.PI * 1.5;

          const startIdx = vertices.length;
          for (let s = 0; s < segments; s++) {
            const angle = (s / segments) * Math.PI * 2 + twist;
            vertices.push({
              x: Math.cos(angle) * r,
              y: cy,
              z: Math.sin(angle) * r
            });
          }

          for (let s = 0; s < segments; s++) {
            edges.push({ a: startIdx + s, b: startIdx + ((s + 1) % segments) });
          }

          if (j > 0) {
            const prevStart = startIdx - segments;
            for (let s = 0; s < segments; s++) {
              edges.push({ a: prevStart + s, b: startIdx + s });
            }
          }
        }

      } else if (threeDType === "observatory") {
        // Concretecone Cliff Platform base
        addCylinder(0, -1.6, 0, 1.5, 0.8, 5);

        // Geodesic Dome hemisphere
        const domeR = 1.2;
        const layers = 4;
        const segments = 8;
        for (let l = 0; l <= layers; l++) {
          const latAngle = (l / layers) * (Math.PI / 2);
          const cy = -0.5 + Math.sin(latAngle) * domeR;
          const ringR = Math.cos(latAngle) * domeR;

          const startIdx = vertices.length;
          for (let s = 0; s < segments; s++) {
            const lonAngle = (s / segments) * Math.PI * 2;
            vertices.push({
              x: Math.cos(lonAngle) * ringR,
              y: cy,
              z: Math.sin(lonAngle) * ringR
            });
          }

          for (let s = 0; s < segments; s++) {
            edges.push({ a: startIdx + s, b: startIdx + ((s + 1) % segments) });
          }

          if (l > 0) {
            const prevStart = startIdx - segments;
            for (let s = 0; s < segments; s++) {
              edges.push({ a: prevStart + s, b: startIdx + s });
            }
          }
        }

        // Telescope column
        addCylinder(0.2, 0.6, -0.3, 0.12, 1.0, 4);

      } else if (threeDType === "canopy") {
        // Supportive Legs
        const legH = 1.4;
        const lxz = 1.3;
        addCylinder(-lxz, -0.7, -lxz, 0.08, legH, 4);
        addCylinder(lxz, -0.7, -lxz, 0.08, legH, 4);
        addCylinder(-lxz, -0.7, lxz, 0.08, legH, 4);
        addCylinder(lxz, -0.7, lxz, 0.08, legH, 4);

        // Canopy wavy surface grid
        const gridCount = 7;
        const size = 3.6;
        const startIdx = vertices.length;

        for (let r = 0; r < gridCount; r++) {
          for (let c = 0; c < gridCount; c++) {
            const x = -size / 2 + (c / (gridCount - 1)) * size;
            const z = -size / 2 + (r / (gridCount - 1)) * size;
            const y = Math.sin(x * 1.4 + tick) * Math.cos(z * 1.4 + tick) * 0.35 + 0.9;
            vertices.push({ x, y, z });
          }
        }

        for (let r = 0; r < gridCount; r++) {
          for (let c = 0; c < gridCount; c++) {
            const idx = startIdx + r * gridCount + c;
            if (c < gridCount - 1) edges.push({ a: idx, b: idx + 1 });
            if (r < gridCount - 1) edges.push({ a: idx, b: idx + gridCount });
          }
        }
      }

      // 3D Rotations and Perspective Projection
      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      const projected = vertices.map(v => {
        // Rotate around Y
        const x1 = v.x * cosY - v.z * sinY;
        const z1 = v.x * sinY + v.z * cosY;
        // Rotate around X
        const y2 = v.y * cosX - z1 * sinX;
        const z2 = v.y * sinX + z1 * cosX;

        const d = 5;
        const sc = 50;
        const factor = d / (d + z2);

        return {
          sx: width / 2 + x1 * sc * factor,
          sy: height / 2 - y2 * sc * factor,
          depth: z2
        };
      });

      // Render solid base outlines (if not wireframeMode)
      if (!wireframeMode) {
        ctx.fillStyle = "rgba(24, 24, 27, 0.35)";
        if (threeDType === "pavilion") {
          // Draw translucent filled circles/quads for the plates
          for (let plate = 0; plate < 3; plate++) {
            const offset = plate * 8;
            ctx.beginPath();
            ctx.moveTo(projected[offset + 0].sx, projected[offset + 0].sy);
            ctx.lineTo(projected[offset + 2].sx, projected[offset + 2].sy);
            ctx.lineTo(projected[offset + 6].sx, projected[offset + 6].sy);
            ctx.lineTo(projected[offset + 4].sx, projected[offset + 4].sy);
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(projected[offset + 1].sx, projected[offset + 1].sy);
            ctx.lineTo(projected[offset + 3].sx, projected[offset + 3].sy);
            ctx.lineTo(projected[offset + 7].sx, projected[offset + 7].sy);
            ctx.lineTo(projected[offset + 5].sx, projected[offset + 5].sy);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      // Draw Edges
      edges.forEach(e => {
        const p1 = projected[e.a];
        const p2 = projected[e.b];
        if (!p1 || !p2) return;

        ctx.strokeStyle = wireframeMode 
          ? `rgba(${hexToRgb(color)}, 0.45)` 
          : `rgba(${hexToRgb(color)}, 0.25)`;
        ctx.lineWidth = wireframeMode ? 1.0 : 0.8;
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.stroke();
      });

      // Draw Vertex Dots
      projected.forEach(p => {
        ctx.fillStyle = `rgba(${hexToRgb(color)}, 0.8)`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 3.5, 0, Math.PI * 2);
        ctx.stroke();
      });

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [threeDType, color, wireframeMode, isHovered]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMouse.current.x;
    const deltaY = e.clientY - previousMouse.current.y;
    rotationRef.current.y += deltaX * 0.01;
    rotationRef.current.x += deltaY * 0.01;
    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMouse.current.x;
    const deltaY = e.touches[0].clientY - previousMouse.current.y;
    rotationRef.current.y += deltaX * 0.015;
    rotationRef.current.x += deltaY * 0.015;
    previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const resetRotation = () => {
    rotationRef.current = { x: -0.3, y: 0.4 };
  };

  return (
    <div 
      className={`relative rounded-none border border-white/5 bg-zinc-900/10 overflow-hidden flex flex-col items-center justify-center p-3 group transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 2D Projected Canvas Container */}
      <canvas 
        ref={canvasRef} 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="w-full h-64 md:h-72 cursor-grab active:cursor-grabbing select-none"
        title="Click and drag to rotate the 3D computational mock"
      />

      {/* Control Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          id={`toggle-wireframe-${threeDType}`}
          className="p-1.5 rounded-none bg-black border border-white/10 text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
          title={wireframeMode ? "Render structural solids" : "Render algorithmic wireframe"}
        >
          {wireframeMode ? "Show Solid" : "Show Wire"}
        </button>
        <button
          onClick={resetRotation}
          id={`reset-rotation-${threeDType}`}
          className="p-1.5 rounded-none bg-black border border-white/10 text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
          title="Reset orientation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5" style={{ backgroundColor: color }} />
        <span className="text-[9px] font-mono tracking-wider uppercase text-white/30">
          VECTOR SPEC: {threeDType}
        </span>
      </div>

      <div className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-mono text-white/40 bg-black px-2 py-0.5 rounded-none border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <Maximize2 className="w-3 h-3" />
        Drag to Orbit (2D)
      </div>
    </div>
  );
}

interface PortfolioViewer3DProps {
  threeDType: "pavilion" | "tower" | "observatory" | "canopy";
  color?: string;
  className?: string;
}

export default function PortfolioViewer3D({ threeDType, color = "#06b6d4", className = "" }: PortfolioViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const [wireframeMode, setWireframeMode] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [webglError, setWebglError] = useState<boolean>(false);
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

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
      console.warn("WebGL not supported or blocked by browser/sandbox in PortfolioViewer3D. Activating 2D drafting fallback canvas.");
      setWebglError(true);
      return;
    }

    if (webglError) return;
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // 1. Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 0, 0);

    // 3. Renderer Setup with Try/Catch
    let renderer: THREE.WebGLRenderer;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("WebGL context lost dynamically in PortfolioViewer3D. Switching to 2D drafting mode.");
      setWebglError(true);
    };

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.warn("PortfolioViewer3D WebGL renderer creation failed. Activating 2D draft wireframe fallback canvas.", e);
      setWebglError(true);
      return;
    }

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(color, 2, 20);
    pointLight.position.set(4, 5, 4);
    scene.add(pointLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(-5, 8, -2);
    scene.add(dirLight);

    // 5. Creating Geometry and Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    groupRef.current = mainGroup;

    // Mesh solid & wireframe materials
    const projectColorNum = parseInt(color.replace("#", "0x"));
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.5,
      metalness: 0.8,
      flatShading: true,
      side: THREE.DoubleSide
    });

    const activeWireMat = new THREE.MeshBasicMaterial({
      color: projectColorNum,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });

    // Helper to generate the specific 3D mesh based on project type
    const constructGeometry = () => {
      // Clear current children
      while (mainGroup.children.length > 0) {
        mainGroup.remove(mainGroup.children[0]);
      }

      if (threeDType === "pavilion") {
        // Brutalist Pavilion: Stacked modular plates with cylinder columns
        const pavilionGroup = new THREE.Group();

        // Plates
        const plateGeo = new THREE.BoxGeometry(4, 0.2, 4);
        const p1 = new THREE.Mesh(plateGeo, solidMat);
        p1.position.y = -1.5;
        const p2 = new THREE.Mesh(plateGeo, solidMat);
        p2.position.y = 0;
        const p3 = new THREE.Mesh(plateGeo, solidMat);
        p3.position.y = 1.5;

        pavilionGroup.add(p1, p2, p3);

        // Columns
        const colGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 8);
        const colPositions = [
          [-1.5, -0.75, -1.5], [1.5, -0.75, -1.5], [-1.5, -0.75, 1.5], [1.5, -0.75, 1.5],
          [-1.2, 0.75, -1.2], [1.2, 0.75, 1.2], [0, 0.75, -1.5], [0, 0.75, 1.5]
        ];

        colPositions.forEach(([cx, cy, cz]) => {
          const col = new THREE.Mesh(colGeo, solidMat);
          col.position.set(cx, cy, cz);
          pavilionGroup.add(col);
        });

        // Add matching wireframe replica
        pavilionGroup.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            const wireMesh = new THREE.Mesh(child.geometry.clone(), activeWireMat);
            wireMesh.position.copy(child.position);
            wireMesh.rotation.copy(child.rotation);
            wireMesh.scale.copy(child.scale).multiplyScalar(1.01);
            pavilionGroup.add(wireMesh);
          }
        });

        mainGroup.add(pavilionGroup);

      } else if (threeDType === "tower") {
        // Twisting Parametric Tower: stack of concentric geometric rings
        const towerGroup = new THREE.Group();
        const ringsCount = 20;
        const ringGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 6); // hexagonal ring slices

        for (let j = 0; j < ringsCount; j++) {
          const progress = j / ringsCount;
          const scale = 1.2 - progress * 0.7; // tapper near top
          const rotationAngle = progress * Math.PI * 1.5; // twist

          const sliceMesh = new THREE.Mesh(ringGeo, solidMat);
          sliceMesh.position.y = -2 + progress * 4;
          sliceMesh.scale.set(scale, 1, scale);
          sliceMesh.rotation.y = rotationAngle;

          const wireMesh = new THREE.Mesh(ringGeo.clone(), activeWireMat);
          wireMesh.position.copy(sliceMesh.position);
          wireMesh.scale.copy(sliceMesh.scale).multiplyScalar(1.02);
          wireMesh.rotation.copy(sliceMesh.rotation);

          towerGroup.add(sliceMesh, wireMesh);
        }

        mainGroup.add(towerGroup);

      } else if (threeDType === "observatory") {
        // Cliff Observatory: crystalline geodesic dome on rough landscape base
        const observatoryGroup = new THREE.Group();

        // Cliff platform
        const cliffGeo = new THREE.ConeGeometry(3, 2, 5);
        const cliff = new THREE.Mesh(cliffGeo, solidMat);
        cliff.position.y = -1.8;
        cliff.rotation.x = Math.PI; // upside down cone
        observatoryGroup.add(cliff);

        // Geodesic crystalline dome
        const domeGeo = new THREE.IcosahedronGeometry(1.5, 1);
        const dome = new THREE.Mesh(domeGeo, solidMat);
        dome.position.y = -0.5;
        observatoryGroup.add(dome);

        // Telescope/Scope column
        const scopeGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.4, 8);
        const scope = new THREE.Mesh(scopeGeo, solidMat);
        scope.position.set(0, 0.8, -0.3);
        scope.rotation.x = -Math.PI / 4;
        observatoryGroup.add(scope);

        observatoryGroup.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            const wireMesh = new THREE.Mesh(child.geometry.clone(), activeWireMat);
            wireMesh.position.copy(child.position);
            wireMesh.rotation.copy(child.rotation);
            wireMesh.scale.copy(child.scale).multiplyScalar(1.015);
            observatoryGroup.add(wireMesh);
          }
        });

        mainGroup.add(observatoryGroup);

      } else if (threeDType === "canopy") {
        // Kinetic Canopy: organic double curved mesh lattice that ripples
        const canopyGroup = new THREE.Group();

        // Create parametric columns
        const legGeo = new THREE.CylinderGeometry(0.08, 0.2, 2.5, 6);
        const legs = [
          [-1.5, -1, -1.5], [1.5, -1, -1.5], [-1.5, -1, 1.5], [1.5, -1, 1.5]
        ];
        legs.forEach(([lx, ly, lz]) => {
          const leg = new THREE.Mesh(legGeo, solidMat);
          leg.position.set(lx, ly, lz);
          leg.rotation.z = lx > 0 ? -0.1 : 0.1;
          canopyGroup.add(leg);
        });

        // Lattice shell grid surface (dynamic waves)
        const planeGeo = new THREE.PlaneGeometry(4.5, 4.5, 12, 12);
        planeGeo.rotateX(-Math.PI / 2);

        // Pre-displace vertices so the initial shape matches our beautiful double-curved grid!
        const posAttr = planeGeo.attributes.position;
        const count = posAttr.count;
        for (let i = 0; i < count; i++) {
          const x = posAttr.getX(i);
          const z = posAttr.getZ(i);
          // Wave factor
          const y = Math.sin((x / 4.5 + 0.5) * Math.PI) * Math.cos((z / 4.5 + 0.5) * Math.PI) * 0.8 + 1.2;
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
        planeGeo.computeVertexNormals();

        const shellSolid = new THREE.Mesh(planeGeo, solidMat);
        shellSolid.name = "canopy-lattice";
        const shellWire = new THREE.Mesh(planeGeo, activeWireMat);
        shellWire.name = "canopy-lattice";
        shellWire.scale.multiplyScalar(1.01);

        canopyGroup.add(shellSolid, shellWire);

        mainGroup.add(canopyGroup);
      }
    };

    // Construct the items
    constructGeometry();

    // Toggle solid vs pure wireframe visibility
    const updateMaterials = () => {
      mainGroup.children.forEach(groupItem => {
        groupItem.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            const isWireframe = child.material === activeWireMat;
            if (isWireframe) {
              child.visible = true; // Always show wireframes representing raw computation
            } else {
              child.visible = !wireframeMode; // Solid structure toggle
            }
          }
        });
      });
    };

    updateMaterials();

    // 6. Handle Interaction Input (Drag-to-Rotate)
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.current.x,
        y: e.clientY - previousMousePosition.current.y,
      };

      if (mainGroup) {
        mainGroup.rotation.y += deltaMove.x * 0.01;
        mainGroup.rotation.x += deltaMove.y * 0.01;
      }

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // Touch support for mobiles
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;

      const deltaMove = {
        x: e.touches[0].clientX - previousMousePosition.current.x,
        y: e.touches[0].clientY - previousMousePosition.current.y,
      };

      if (mainGroup) {
        mainGroup.rotation.y += deltaMove.x * 0.015;
        mainGroup.rotation.x += deltaMove.y * 0.015;
      }

      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleMouseUp);

    // 7. Handle Resize Observer
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
    let animFrameId: number;
    const clock = new THREE.Clock();

    const renderLoop = () => {
      animFrameId = requestAnimationFrame(renderLoop);

      const elapsed = clock.getElapsedTime();

      // If not dragging, animate simple floating/spinning rotations
      if (!isDragging.current && mainGroup) {
        // Slow constant rotate
        const spinSpeed = isHovered ? 0.6 : 0.25;
        mainGroup.rotation.y += 0.01 * spinSpeed;

        // Subtle vertical float
        mainGroup.position.y = Math.sin(elapsed * 1.5) * 0.15;

        // Oscillate x rotation slightly
        mainGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.05;
      }

      // Canopy kinetic waving effect for the grid surface
      if (threeDType === "canopy" && mainGroup) {
        // Look for the shell wireframe and solid
        mainGroup.children.forEach(item => {
          item.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.name === "canopy-lattice") {
              const geom = child.geometry;
              const posAttr = geom.attributes.position;
              const count = posAttr.count;

              for (let i = 0; i < count; i++) {
                const x = posAttr.getX(i);
                const z = posAttr.getZ(i);
                // Dynamic wave ripple equation mapped mathematically using time elapsed!
                const y = Math.sin(x * 1.5 + elapsed) * Math.cos(z * 1.5 + elapsed) * 0.4 + 1.2;
                posAttr.setY(i, y);
              }
              posAttr.needsUpdate = true;
              geom.computeVertexNormals();
            }
          });
        });
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    // 9. Cleanup
    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }
      cancelAnimationFrame(animFrameId);

      scene.clear();
      solidMat.dispose();
      activeWireMat.dispose();
      
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
  }, [threeDType, color, wireframeMode, isHovered, webglError]);

  const resetRotation = () => {
    if (groupRef.current) {
      groupRef.current.rotation.set(0, 0, 0);
      groupRef.current.position.set(0, 0, 0);
    }
  };

  if (webglError) {
    return (
      <PortfolioViewer2DFallback 
        threeDType={threeDType} 
        color={color} 
        className={className} 
      />
    );
  }

  return (
    <div 
      className={`relative rounded-none border border-white/5 bg-zinc-900/10 overflow-hidden flex flex-col items-center justify-center p-3 group transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* GL Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-64 md:h-72 cursor-grab active:cursor-grabbing select-none"
        title="Click and drag to rotate the 3D computational mock"
      />

      {/* Control Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={() => setWireframeMode(!wireframeMode)}
          id={`toggle-wireframe-${threeDType}`}
          className="p-1.5 rounded-none bg-black border border-white/10 text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
          title={wireframeMode ? "Render structural solids" : "Render algorithmic wireframe"}
        >
          {wireframeMode ? "Show Solid" : "Show Wire"}
        </button>
        <button
          onClick={resetRotation}
          id={`reset-rotation-${threeDType}`}
          className="p-1.5 rounded-none bg-black border border-white/10 text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
          title="Reset orientation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5" style={{ backgroundColor: color }} />
        <span className="text-[9px] font-mono tracking-wider uppercase text-white/30">
          WebGL SPEC: {threeDType}
        </span>
      </div>

      <div className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-mono text-white/40 bg-black px-2 py-0.5 rounded-none border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <Maximize2 className="w-3 h-3" />
        Drag to Orbit
      </div>
    </div>
  );
}
