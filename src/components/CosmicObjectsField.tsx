import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  COSMIC_SPRITES,
  PIXEL_PALETTE,
  type CosmicSpriteKind,
} from "../data/cosmicSprites";
import { scrollProgressRef } from "../context/scrollRef";

type CosmicObjectState = {
  x: number;
  y: number;
  z: number;
  speed: number;
  driftX: number;
  driftY: number;
  baseScale: number;
  spriteIndex: number;
  spin: number;
  spinSpeed: number;
  pointTwinkle: number;
};

const MOBILE_OBJECT_LIMIT = 4;
const DESKTOP_OBJECT_LIMIT = 6;
const FAR_DEPTH = 140;
const NEAR_DEPTH = 8.5;
const DESKTOP_MIN_SPEED = 18;
const DESKTOP_MAX_SPEED = 28;
const MOBILE_MIN_SPEED = 14;
const MOBILE_MAX_SPEED = 22;
const CENTER_CORRIDOR_RADIUS = 0.72;
const OUTER_CORRIDOR_RADIUS = 1.42;

const PLANET_SPRITE_INDICES = COSMIC_SPRITES.reduce<number[]>((indices, sprite, index) => {
  if (sprite.kind === "planet") {
    indices.push(index);
  }
  return indices;
}, []);

const GALAXY_SPRITE_INDICES = COSMIC_SPRITES.reduce<number[]>((indices, sprite, index) => {
  if (sprite.kind === "galaxy") {
    indices.push(index);
  }
  return indices;
}, []);

const COMET_SPRITE_INDICES = COSMIC_SPRITES.reduce<number[]>((indices, sprite, index) => {
  if (sprite.kind === "comet") {
    indices.push(index);
  }
  return indices;
}, []);

const BLACK_HOLE_SPRITE_INDICES = COSMIC_SPRITES.reduce<number[]>((indices, sprite, index) => {
  if (sprite.kind === "black-hole") {
    indices.push(index);
  }
  return indices;
}, []);

const MOBILE_KIND_SEQUENCE: CosmicSpriteKind[] = ["planet", "galaxy", "comet", "black-hole"];
const DESKTOP_KIND_SEQUENCE: CosmicSpriteKind[] = [
  "planet",
  "galaxy",
  "planet",
  "comet",
  "planet",
  "black-hole",
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function spritePoolForKind(kind: CosmicSpriteKind) {
  if (kind === "planet") {
    return PLANET_SPRITE_INDICES;
  }

  if (kind === "galaxy") {
    return GALAXY_SPRITE_INDICES;
  }

  if (kind === "comet") {
    return COMET_SPRITE_INDICES;
  }

  return BLACK_HOLE_SPRITE_INDICES;
}

function pickSpriteIndex(slotIndex: number, slotCount: number) {
  const kindSequence = slotCount <= MOBILE_OBJECT_LIMIT ? MOBILE_KIND_SEQUENCE : DESKTOP_KIND_SEQUENCE;
  const preferredKind = kindSequence[slotIndex % kindSequence.length];
  const pool = spritePoolForKind(preferredKind);

  if (pool.length === 0) {
    const fallbackPool = [
      ...PLANET_SPRITE_INDICES,
      ...GALAXY_SPRITE_INDICES,
      ...COMET_SPRITE_INDICES,
      ...BLACK_HOLE_SPRITE_INDICES,
    ];

    if (fallbackPool.length === 0) {
      return 0;
    }

    return fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

function createSpriteTexture(rows: readonly string[]) {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = rows[0].length;
  textureCanvas.height = rows.length;

  const context = textureCanvas.getContext("2d");
  if (context) {
    context.clearRect(0, 0, textureCanvas.width, textureCanvas.height);

    for (let y = 0; y < rows.length; y += 1) {
      const row = rows[y];
      for (let x = 0; x < row.length; x += 1) {
        const token = row[x];
        if (token === ".") {
          continue;
        }

        const color = PIXEL_PALETTE[token];
        if (!color) {
          continue;
        }

        context.fillStyle = color;
        context.fillRect(x, y, 1, 1);
      }
    }
  }

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function reseedCosmicObject(
  cosmicObject: CosmicObjectState,
  slotIndex: number,
  slotCount: number,
  halfWidth: number,
  halfHeight: number,
  minSpeed: number,
  maxSpeed: number,
  fillDepth: boolean
) {
  const angle = randomBetween(0, Math.PI * 2);
  const radialMix = Math.pow(Math.random(), 0.32);
  const radius =
    CENTER_CORRIDOR_RADIUS + radialMix * (OUTER_CORRIDOR_RADIUS - CENTER_CORRIDOR_RADIUS);
  const spriteIndex = pickSpriteIndex(slotIndex, slotCount);
  const sprite = COSMIC_SPRITES[spriteIndex];
  const [minScale, maxScale] = sprite.baseScale;

  cosmicObject.x = Math.cos(angle) * halfWidth * radius;
  cosmicObject.y = Math.sin(angle) * halfHeight * radius;
  if (fillDepth) {
    const segmentLength = (FAR_DEPTH + NEAR_DEPTH - 10) / Math.max(1, slotCount);
    const baseZ = -FAR_DEPTH + segmentLength * slotIndex;
    cosmicObject.z = baseZ + randomBetween(0, segmentLength * 0.72);
  } else {
    cosmicObject.z = randomBetween(-FAR_DEPTH - 12, -FAR_DEPTH + 18);
  }
  cosmicObject.speed = randomBetween(minSpeed, maxSpeed);
  cosmicObject.driftX = cosmicObject.x * randomBetween(-0.0018, 0.0018);
  cosmicObject.driftY = cosmicObject.y * randomBetween(-0.0018, 0.0018);
  cosmicObject.baseScale = randomBetween(minScale, maxScale);
  cosmicObject.spriteIndex = spriteIndex;
  cosmicObject.spin = randomBetween(0, Math.PI * 2);
  cosmicObject.spinSpeed =
    sprite.kind === "galaxy"
      ? randomBetween(-0.32, 0.32)
      : sprite.kind === "black-hole"
        ? randomBetween(-0.26, 0.26)
        : sprite.kind === "comet"
          ? randomBetween(-0.08, 0.08)
          : randomBetween(-0.14, 0.14);
  cosmicObject.pointTwinkle = randomBetween(0, Math.PI * 2);
}

export function CosmicObjectsField() {
  const { viewport, size } = useThree();
  const initializedRef = useRef(false);
  const lowFpsBudgetRef = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const isMobile = size.width < 768;
  const objectLimit = isMobile ? MOBILE_OBJECT_LIMIT : DESKTOP_OBJECT_LIMIT;
  const minSpeed = isMobile ? MOBILE_MIN_SPEED : DESKTOP_MIN_SPEED;
  const maxSpeed = isMobile ? MOBILE_MAX_SPEED : DESKTOP_MAX_SPEED;

  const spriteTextures = useMemo(
    () => COSMIC_SPRITES.map((sprite) => createSpriteTexture(sprite.rows)),
    []
  );

  useEffect(() => {
    return () => {
      for (let i = 0; i < spriteTextures.length; i += 1) {
        spriteTextures[i].dispose();
      }
    };
  }, [spriteTextures]);

  const cosmicObjectsRef = useRef<CosmicObjectState[]>([]);
  if (cosmicObjectsRef.current.length !== objectLimit) {
    cosmicObjectsRef.current = Array.from({ length: objectLimit }, () => ({
      x: 0,
      y: 0,
      z: 0,
      speed: 0,
      driftX: 0,
      driftY: 0,
      baseScale: 1,
      spriteIndex: 0,
      spin: 0,
      spinSpeed: 0,
      pointTwinkle: 0,
    }));
    initializedRef.current = false;
  }

  const pointRefs = useRef<Array<THREE.Mesh | null>>([]);
  const spriteRefs = useRef<Array<THREE.Sprite | null>>([]);

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
      if (lowFpsBudgetRef.current < 1 / 14) {
        return;
      }
      delta = lowFpsBudgetRef.current;
      lowFpsBudgetRef.current = 0;
    }

    const halfWidth = viewport.width * 0.5;
    const halfHeight = viewport.height * 0.5;

    if (!initializedRef.current) {
      for (let i = 0; i < cosmicObjectsRef.current.length; i += 1) {
        reseedCosmicObject(
          cosmicObjectsRef.current[i],
          i,
          objectLimit,
          halfWidth,
          halfHeight,
          minSpeed,
          maxSpeed,
          true
        );
      }
      initializedRef.current = true;
    }

    const elapsedTime = clock.elapsedTime;
    const motionScale = prefersReducedMotion ? 0.4 : 1;
    const activeCount = prefersReducedMotion
      ? Math.max(2, Math.floor(objectLimit * 0.75))
      : objectLimit;

    for (let i = 0; i < activeCount; i += 1) {
      const cosmicObject = cosmicObjectsRef.current[i];
      const depthProgress = THREE.MathUtils.clamp(
        (cosmicObject.z + FAR_DEPTH) / (FAR_DEPTH + NEAR_DEPTH),
        0,
        1
      );

      const distanceSlowdown = 0.18 + depthProgress * depthProgress * 1.12;
      const rushBoost = 1 + scrollProgressRef.current * 1.8;
      cosmicObject.z += cosmicObject.speed * delta * motionScale * distanceSlowdown * rushBoost;
      cosmicObject.x += cosmicObject.driftX * delta * (0.32 + depthProgress * 0.5);
      cosmicObject.y += cosmicObject.driftY * delta * (0.32 + depthProgress * 0.5);
      cosmicObject.spin += cosmicObject.spinSpeed * delta * (0.25 + depthProgress * 0.9);

      if (
        cosmicObject.z > NEAR_DEPTH ||
        Math.abs(cosmicObject.x) > halfWidth * OUTER_CORRIDOR_RADIUS * 1.22 ||
        Math.abs(cosmicObject.y) > halfHeight * OUTER_CORRIDOR_RADIUS * 1.22
      ) {
        reseedCosmicObject(
          cosmicObject,
          i,
          objectLimit,
          halfWidth,
          halfHeight,
          minSpeed,
          maxSpeed,
          false
        );
      }

      const refreshedDepthProgress = THREE.MathUtils.clamp(
        (cosmicObject.z + FAR_DEPTH) / (FAR_DEPTH + NEAR_DEPTH),
        0,
        1
      );
      const spriteVisibility = THREE.MathUtils.smoothstep(refreshedDepthProgress, 0.18, 0.66);
      const pointVisibility = 1 - THREE.MathUtils.smoothstep(refreshedDepthProgress, 0.16, 0.58);
      const twinkle = 0.68 + Math.sin(cosmicObject.pointTwinkle + elapsedTime * 3.1) * 0.32;
      const sprite = COSMIC_SPRITES[cosmicObject.spriteIndex];
      const spriteTexture = spriteTextures[cosmicObject.spriteIndex];
      const pointBoost =
        sprite.kind === "galaxy"
          ? 1.25
          : sprite.kind === "black-hole"
            ? 1.3
            : sprite.kind === "comet"
              ? 1.12
              : 1;
      const spriteBoost =
        sprite.kind === "galaxy"
          ? 1.15
          : sprite.kind === "black-hole"
            ? 1.18
            : sprite.kind === "comet"
              ? 1.06
              : 1;

      const point = pointRefs.current[i];
      if (point) {
        point.position.set(cosmicObject.x, cosmicObject.y, cosmicObject.z);
        point.scale.setScalar(THREE.MathUtils.lerp(0.026, 0.18, refreshedDepthProgress));

        const pointMaterial = point.material as THREE.MeshBasicMaterial;
        pointMaterial.color.set(sprite.beaconColor);
        pointMaterial.opacity = Math.min(1, pointVisibility * twinkle * pointBoost);
      }

      const objectSprite = spriteRefs.current[i];
      if (objectSprite) {
        objectSprite.position.set(cosmicObject.x, cosmicObject.y, cosmicObject.z);
        objectSprite.scale.setScalar(
          cosmicObject.baseScale * (0.22 + refreshedDepthProgress * 1.08)
        );

        const objectSpriteMaterial = objectSprite.material as THREE.SpriteMaterial;
        if (objectSpriteMaterial.map !== spriteTexture) {
          objectSpriteMaterial.map = spriteTexture;
          objectSpriteMaterial.needsUpdate = true;
        }
        objectSpriteMaterial.opacity = Math.min(
          1,
          spriteVisibility * (0.64 + refreshedDepthProgress * 0.36) * spriteBoost
        );
        objectSpriteMaterial.rotation = cosmicObject.spin;
      }
    }

    for (let i = activeCount; i < objectLimit; i += 1) {
      const point = pointRefs.current[i];
      if (point) {
        point.position.set(0, 0, -FAR_DEPTH - 16);
        point.scale.setScalar(0.01);
        const pointMaterial = point.material as THREE.MeshBasicMaterial;
        pointMaterial.opacity = 0;
      }

      const objectSprite = spriteRefs.current[i];
      if (objectSprite) {
        objectSprite.position.set(0, 0, -FAR_DEPTH - 16);
        objectSprite.scale.setScalar(0.01);
        const objectSpriteMaterial = objectSprite.material as THREE.SpriteMaterial;
        objectSpriteMaterial.opacity = 0;
      }
    }
  });

  return (
    <group>
      {Array.from({ length: objectLimit }, (_, index) => (
        <group key={`cosmic-object-${index}`}>
          <mesh
            ref={(mesh) => {
              pointRefs.current[index] = mesh;
            }}
            renderOrder={2}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <sprite
            ref={(sprite) => {
              spriteRefs.current[index] = sprite;
            }}
            renderOrder={3}
          >
            <spriteMaterial
              map={spriteTextures[0]}
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
            />
          </sprite>
        </group>
      ))}
    </group>
  );
}
