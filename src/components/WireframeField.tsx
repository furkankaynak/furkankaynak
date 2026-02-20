import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type NodeState = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  age: number;
  life: number;
  active: boolean;
};

const DESKTOP_NODE_LIMIT = 120;
const MOBILE_NODE_LIMIT = 68;
const DESKTOP_SPAWN_RATE = 14;
const MOBILE_SPAWN_RATE = 8;
const DESKTOP_MAX_LINE_SEGMENTS = 520;
const MOBILE_MAX_LINE_SEGMENTS = 220;
const MAX_CONNECTIONS_PER_NODE = 5;
const CONNECTION_DISTANCE = 1.8;
const POINTER_RADIUS = 2.5;
const POINTER_STRENGTH = 1.75;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function WireframeField() {
  const { viewport, pointer, size } = useThree();
  const pointsGeometryRef = useRef<THREE.BufferGeometry>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry>(null);
  const spawnBudgetRef = useRef(0);
  const lowFpsBudgetRef = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const isMobile = size.width < 768;
  const nodeLimit = isMobile ? MOBILE_NODE_LIMIT : DESKTOP_NODE_LIMIT;
  const spawnRate = isMobile ? MOBILE_SPAWN_RATE : DESKTOP_SPAWN_RATE;
  const maxLineSegments = isMobile
    ? MOBILE_MAX_LINE_SEGMENTS
    : DESKTOP_MAX_LINE_SEGMENTS;

  const nodesRef = useRef<NodeState[]>([]);
  if (nodesRef.current.length !== nodeLimit) {
    nodesRef.current = Array.from({ length: nodeLimit }, () => ({
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      age: 0,
      life: 0,
      active: false
    }));
  }

  const pointPositions = useMemo(() => new Float32Array(nodeLimit * 3), [nodeLimit]);
  const pointColors = useMemo(() => new Float32Array(nodeLimit * 3), [nodeLimit]);
  const linePositions = useMemo(
    () => new Float32Array(maxLineSegments * 6),
    [maxLineSegments]
  );
  const lineColors = useMemo(
    () => new Float32Array(maxLineSegments * 6),
    [maxLineSegments]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => {
      mediaQuery.removeEventListener("change", syncPreference);
    };
  }, []);

  useFrame((_, delta) => {
    if (prefersReducedMotion) {
      lowFpsBudgetRef.current += delta;
      if (lowFpsBudgetRef.current < 1 / 12) {
        return;
      }
      delta = lowFpsBudgetRef.current;
      lowFpsBudgetRef.current = 0;
    }

    const halfWidth = viewport.width * 0.5;
    const halfHeight = viewport.height * 0.5;
    const activeNodeIndexes: number[] = [];
    let activeCount = 0;
    let lineCursor = 0;

    spawnBudgetRef.current += spawnRate * delta;
    while (spawnBudgetRef.current >= 1) {
      spawnBudgetRef.current -= 1;
      const availableNode = nodesRef.current.find((node) => !node.active);
      if (!availableNode) {
        break;
      }

      availableNode.x = randomBetween(-halfWidth, halfWidth);
      availableNode.y = randomBetween(-halfHeight, halfHeight);
      availableNode.z = randomBetween(-0.25, 0.25);
      availableNode.vx = randomBetween(-0.13, 0.13);
      availableNode.vy = randomBetween(-0.13, 0.13);
      availableNode.vz = randomBetween(-0.035, 0.035);
      availableNode.age = 0;
      availableNode.life = randomBetween(2.8, 5.8);
      availableNode.active = true;
    }

    const pointerX = pointer.x * halfWidth;
    const pointerY = pointer.y * halfHeight;

    for (let i = 0; i < nodesRef.current.length; i += 1) {
      const node = nodesRef.current[i];
      if (!node.active) {
        continue;
      }

      node.age += delta;
      if (node.age >= node.life) {
        node.active = false;
        continue;
      }

      node.x += node.vx * delta;
      node.y += node.vy * delta;
      node.z += node.vz * delta;

      if (node.x > halfWidth) node.x = -halfWidth;
      if (node.x < -halfWidth) node.x = halfWidth;
      if (node.y > halfHeight) node.y = -halfHeight;
      if (node.y < -halfHeight) node.y = halfHeight;

      const dx = node.x - pointerX;
      const dy = node.y - pointerY;
      const distSq = dx * dx + dy * dy;
      const pointerRadiusSq = POINTER_RADIUS * POINTER_RADIUS;
      if (distSq > 0.0001 && distSq < pointerRadiusSq) {
        const dist = Math.sqrt(distSq);
        const strength = ((POINTER_RADIUS - dist) / POINTER_RADIUS) * POINTER_STRENGTH;
        node.x += (dx / dist) * strength * delta;
        node.y += (dy / dist) * strength * delta;
      }

      const normalizedAge = node.age / node.life;
      const fadeIn = Math.min(1, normalizedAge * 4);
      const fadeOut = Math.min(1, (1 - normalizedAge) * 1.25);
      const alpha = Math.max(0, Math.min(fadeIn, fadeOut));

      pointPositions[activeCount * 3] = node.x;
      pointPositions[activeCount * 3 + 1] = node.y;
      pointPositions[activeCount * 3 + 2] = node.z;

      pointColors[activeCount * 3] = alpha;
      pointColors[activeCount * 3 + 1] = alpha;
      pointColors[activeCount * 3 + 2] = alpha;

      activeNodeIndexes.push(i);
      activeCount += 1;
    }

    const activeLength = activeNodeIndexes.length;

    for (let i = 0; i < activeLength; i += 1) {
      if (lineCursor >= maxLineSegments) {
        break;
      }

      const nodeA = nodesRef.current[activeNodeIndexes[i]];
      let nodeConnectionCount = 0;

      for (let j = i + 1; j < activeLength; j += 1) {
        if (
          lineCursor >= maxLineSegments ||
          nodeConnectionCount >= MAX_CONNECTIONS_PER_NODE
        ) {
          break;
        }

        const nodeB = nodesRef.current[activeNodeIndexes[j]];
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dz = nodeA.z - nodeB.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance > CONNECTION_DISTANCE) {
          continue;
        }

        const alpha = (1 - distance / CONNECTION_DISTANCE) * 0.35;

        linePositions[lineCursor * 6] = nodeA.x;
        linePositions[lineCursor * 6 + 1] = nodeA.y;
        linePositions[lineCursor * 6 + 2] = nodeA.z;
        linePositions[lineCursor * 6 + 3] = nodeB.x;
        linePositions[lineCursor * 6 + 4] = nodeB.y;
        linePositions[lineCursor * 6 + 5] = nodeB.z;

        lineColors[lineCursor * 6] = alpha;
        lineColors[lineCursor * 6 + 1] = alpha;
        lineColors[lineCursor * 6 + 2] = alpha;
        lineColors[lineCursor * 6 + 3] = alpha;
        lineColors[lineCursor * 6 + 4] = alpha;
        lineColors[lineCursor * 6 + 5] = alpha;

        nodeConnectionCount += 1;
        lineCursor += 1;
      }
    }

    if (pointsGeometryRef.current) {
      pointsGeometryRef.current.setDrawRange(0, activeCount);
      pointsGeometryRef.current.attributes.position.needsUpdate = true;
      pointsGeometryRef.current.attributes.color.needsUpdate = true;
    }

    if (linesGeometryRef.current) {
      linesGeometryRef.current.setDrawRange(0, lineCursor * 2);
      linesGeometryRef.current.attributes.position.needsUpdate = true;
      linesGeometryRef.current.attributes.color.needsUpdate = true;
    }
  });

  return (
    <>
      <points>
        <bufferGeometry ref={pointsGeometryRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[pointPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[pointColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={1}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>

      <lineSegments>
        <bufferGeometry ref={linesGeometryRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.45}
          vertexColors
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}
