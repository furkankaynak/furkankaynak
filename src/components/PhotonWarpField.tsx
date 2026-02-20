import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PhotonState = {
  x: number;
  y: number;
  z: number;
  angle: number;
  radius: number;
  angularSpeed: number;
  speed: number;
  baseLength: number;
  twinkle: number;
  shadeBias: number;
};

const DESKTOP_PHOTON_LIMIT = 2000;
const MOBILE_PHOTON_LIMIT = 1000;
const FAR_DEPTH = 96;
const NEAR_DEPTH = 8.5;
const DESKTOP_MIN_SPEED = 22;
const DESKTOP_MAX_SPEED = 55;
const MOBILE_MIN_SPEED = 18;
const MOBILE_MAX_SPEED = 42;
const TUNNEL_RADIUS = 1.45;
const CENTER_CORRIDOR_RADIUS = 0.08;
const MIN_ANGULAR_SPEED = 0.4;
const MAX_ANGULAR_SPEED = 1.0;
const RADIAL_EXPANSION_STRENGTH = 0.45;
const TANGENT_STREAK_WEIGHT = 0.25;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function reseedPhoton(
  photon: PhotonState,
  minSpeed: number,
  maxSpeed: number,
  fillDepth: boolean
) {
  const angle = randomBetween(0, Math.PI * 2);
  const radialMix = Math.pow(Math.random(), 0.7);
  const radius =
    CENTER_CORRIDOR_RADIUS + radialMix * (TUNNEL_RADIUS - CENTER_CORRIDOR_RADIUS);

  photon.angle = angle;
  photon.radius = radius;
  photon.x = 0;
  photon.y = 0;
  photon.z = fillDepth
    ? randomBetween(-FAR_DEPTH, NEAR_DEPTH)
    : randomBetween(-FAR_DEPTH - 18, -FAR_DEPTH + 6);
  photon.speed = randomBetween(minSpeed, maxSpeed);
  photon.baseLength = randomBetween(0.4, 1.4);
  photon.twinkle = randomBetween(0, Math.PI * 2);
  photon.shadeBias = randomBetween(0.78, 1.04);

  const baseAngular = randomBetween(MIN_ANGULAR_SPEED, MAX_ANGULAR_SPEED);
  const normalizedRadius = (radius - CENTER_CORRIDOR_RADIUS) / (TUNNEL_RADIUS - CENTER_CORRIDOR_RADIUS);
  photon.angularSpeed = baseAngular * (1 + (1 - normalizedRadius) * 1.2);
}

export function PhotonWarpField() {
  const { viewport, size } = useThree();
  const linesGeometryRef = useRef<THREE.BufferGeometry>(null);
  const lowFpsBudgetRef = useRef(0);
  const initializedRef = useRef(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const isMobile = size.width < 768;
  const photonLimit = isMobile ? MOBILE_PHOTON_LIMIT : DESKTOP_PHOTON_LIMIT;
  const minSpeed = isMobile ? MOBILE_MIN_SPEED : DESKTOP_MIN_SPEED;
  const maxSpeed = isMobile ? MOBILE_MAX_SPEED : DESKTOP_MAX_SPEED;

  const photonsRef = useRef<PhotonState[]>([]);
  if (photonsRef.current.length !== photonLimit) {
    photonsRef.current = Array.from({ length: photonLimit }, () => ({
      x: 0,
      y: 0,
      z: 0,
      angle: 0,
      radius: 0,
      angularSpeed: 0,
      speed: 0,
      baseLength: 0,
      twinkle: 0,
      shadeBias: 1
    }));
    initializedRef.current = false;
  }

  const linePositions = useMemo(() => new Float32Array(photonLimit * 6), [photonLimit]);
  const lineColors = useMemo(() => new Float32Array(photonLimit * 6), [photonLimit]);

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

  useFrame(({ clock }, delta) => {
    delta = Math.min(delta, 1 / 30);

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

    if (!initializedRef.current) {
      for (let i = 0; i < photonsRef.current.length; i += 1) {
        reseedPhoton(photonsRef.current[i], minSpeed, maxSpeed, true);
      }
      initializedRef.current = true;
    }

    const elapsedTime = clock.elapsedTime;
    const motionScale = prefersReducedMotion ? 0.45 : 1;
    const activeCount = prefersReducedMotion
      ? Math.floor(photonLimit * 0.5)
      : photonLimit;

    for (let i = 0; i < activeCount; i += 1) {
      const photon = photonsRef.current[i];

      photon.z += photon.speed * delta * motionScale;
      photon.angle += photon.angularSpeed * delta * motionScale;

      if (photon.z > NEAR_DEPTH) {
        reseedPhoton(photon, minSpeed, maxSpeed, false);
      }

      const depthProgress = THREE.MathUtils.clamp(
        (photon.z + FAR_DEPTH) / (FAR_DEPTH + NEAR_DEPTH),
        0,
        1
      );

      const radialExpansion =
        1 + depthProgress * depthProgress * RADIAL_EXPANSION_STRENGTH;
      const effectiveRadius = photon.radius * radialExpansion;

      photon.x = Math.cos(photon.angle) * effectiveRadius * halfWidth;
      photon.y = Math.sin(photon.angle) * effectiveRadius * halfHeight;

      const pulse = 0.72 + Math.sin(photon.twinkle + elapsedTime * 2.5) * 0.28;
      const intensity = (0.16 + depthProgress * 0.84) * pulse;
      const headShade = Math.max(0.03, 1 - intensity * photon.shadeBias);
      const tailShade = Math.min(1, headShade + 0.2 + (1 - depthProgress) * 0.16);
      const streakLength = photon.baseLength * (0.5 + depthProgress * 3.5);

      const tangentX = -Math.sin(photon.angle) * effectiveRadius * halfWidth;
      const tangentY = Math.cos(photon.angle) * effectiveRadius * halfHeight;
      const tangentLen = Math.sqrt(tangentX * tangentX + tangentY * tangentY) || 1;

      linePositions[i * 6] = photon.x;
      linePositions[i * 6 + 1] = photon.y;
      linePositions[i * 6 + 2] = photon.z;
      linePositions[i * 6 + 3] = photon.x - (tangentX / tangentLen) * streakLength * TANGENT_STREAK_WEIGHT;
      linePositions[i * 6 + 4] = photon.y - (tangentY / tangentLen) * streakLength * TANGENT_STREAK_WEIGHT;
      linePositions[i * 6 + 5] = photon.z - streakLength;

      lineColors[i * 6] = headShade;
      lineColors[i * 6 + 1] = headShade;
      lineColors[i * 6 + 2] = headShade;
      lineColors[i * 6 + 3] = tailShade;
      lineColors[i * 6 + 4] = tailShade;
      lineColors[i * 6 + 5] = tailShade;
    }

    for (let i = activeCount; i < photonLimit; i += 1) {
      linePositions[i * 6] = 0;
      linePositions[i * 6 + 1] = 0;
      linePositions[i * 6 + 2] = -FAR_DEPTH;
      linePositions[i * 6 + 3] = 0;
      linePositions[i * 6 + 4] = 0;
      linePositions[i * 6 + 5] = -FAR_DEPTH;

      lineColors[i * 6] = 1;
      lineColors[i * 6 + 1] = 1;
      lineColors[i * 6 + 2] = 1;
      lineColors[i * 6 + 3] = 1;
      lineColors[i * 6 + 4] = 1;
      lineColors[i * 6 + 5] = 1;
    }

    if (linesGeometryRef.current) {
      linesGeometryRef.current.setDrawRange(0, activeCount * 2);
      linesGeometryRef.current.attributes.position.needsUpdate = true;
      linesGeometryRef.current.attributes.color.needsUpdate = true;
    }
  });

  return (
    <>
      <lineSegments>
        <bufferGeometry ref={linesGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.9}
          vertexColors
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}
