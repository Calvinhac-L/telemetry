"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Html, RoundedBox, useCursor } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import type { Vector3Tuple } from "three";

interface Dice3DSceneProps {
  values: number[];
  locked: number[];
  onToggleLock: (index: number) => void;
  disabled?: boolean;
  isRolling: boolean;
  rollIteration: number;
}

const DICE_SIZE = 0.9;
const BASE_HEIGHT = DICE_SIZE / 2 + 0.02;
const valueToRotation: Record<number, Vector3Tuple> = {
  1: [0, 0, 0],
  2: [-Math.PI / 2, 0, 0],
  3: [0, 0, Math.PI / 2],
  4: [0, 0, -Math.PI / 2],
  5: [Math.PI / 2, 0, 0],
  6: [Math.PI, 0, 0],
};

type FaceAxis = "x" | "y" | "z";

interface FaceConfig {
  axis: FaceAxis;
  dir: 1 | -1;
  value: number;
}

const faceMap: FaceConfig[] = [
  { axis: "y", dir: 1, value: 1 },
  { axis: "y", dir: -1, value: 6 },
  { axis: "z", dir: 1, value: 2 },
  { axis: "z", dir: -1, value: 5 },
  { axis: "x", dir: 1, value: 3 },
  { axis: "x", dir: -1, value: 4 },
];

const pipPatterns: Record<number, [number, number][]> = (() => {
  const o = 0.25;
  return {
    1: [[0, 0]],
    2: [
      [-o, -o],
      [o, o],
    ],
    3: [
      [-o, -o],
      [0, 0],
      [o, o],
    ],
    4: [
      [-o, -o],
      [-o, o],
      [o, -o],
      [o, o],
    ],
    5: [
      [-o, -o],
      [-o, o],
      [0, 0],
      [o, -o],
      [o, o],
    ],
    6: [
      [-o, -o],
      [-o, 0],
      [-o, o],
      [o, -o],
      [o, 0],
      [o, o],
    ],
  };
})();

const createPipPositions = () => {
  const positions: Vector3Tuple[] = [];
  const faceOffset = DICE_SIZE / 2 + 0.01;

  faceMap.forEach(({ axis, dir, value }) => {
    const pattern = pipPatterns[value];
    pattern.forEach(([a, b]) => {
      if (axis === "x") {
        positions.push([dir * faceOffset, a, b]);
      } else if (axis === "y") {
        positions.push([a, dir * faceOffset, b]);
      } else {
        positions.push([a, b, dir * faceOffset]);
      }
    });
  });

  return positions;
};

const pipPositions = createPipPositions();

const DiceGeometry = () => {
  return (
    <group>
      <RoundedBox args={[DICE_SIZE, DICE_SIZE, DICE_SIZE]} radius={0.08} smoothness={6} castShadow>
        <meshStandardMaterial color="#fff7ed" />
      </RoundedBox>
      {pipPositions.map((pos, idx) => (
        <mesh key={idx} position={pos} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
    </group>
  );
};

interface DiceBodyProps {
  index: number;
  value: number;
  locked: boolean;
  disabled: boolean;
  isRolling: boolean;
  rollIteration: number;
  onToggleLock: (index: number) => void;
  position: Vector3Tuple;
}

const DiceBody = ({
  index,
  value,
  locked,
  disabled,
  isRolling,
  rollIteration,
  onToggleLock,
  position,
}: DiceBodyProps) => {
  const [hovered, setHovered] = useState(false);
  const [ref, api] = useBox(() => ({
    args: [DICE_SIZE, DICE_SIZE, DICE_SIZE],
    mass: 1,
    position,
    allowSleep: true,
  }));

  useCursor(hovered && !disabled, "pointer");

  const resetToValue = useCallback(
    (faceValue: number) => {
      if (!faceValue || faceValue < 1 || faceValue > 6) return;
      const rotation = valueToRotation[faceValue] || [0, 0, 0];
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
      api.position.set(position[0], BASE_HEIGHT, position[2]);
      api.rotation.set(rotation[0], rotation[1], rotation[2]);
    },
    [api, position]
  );

  const throwDice = useCallback(() => {
    const startY = 1.8 + Math.random() * 1.5;
    const jitter = () => (Math.random() - 0.5) * 0.4;
    api.velocity.set(0, 0, 0);
    api.angularVelocity.set(0, 0, 0);
    api.position.set(position[0] + jitter(), startY, position[2] + jitter());
    api.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const impulse: Vector3Tuple = [(Math.random() - 0.5) * 2.5, 0, (Math.random() - 0.5) * 2.5];
    api.applyImpulse(impulse, [0, 0, 0]);
  }, [api, position]);

  useEffect(() => {
    api.mass.set(locked || disabled ? 0 : 1);
  }, [api, disabled, locked]);

  useEffect(() => {
    if (rollIteration === 0) {
      resetToValue(value || 1);
      return;
    }
    if (locked || disabled) return;
    throwDice();
  }, [disabled, locked, resetToValue, rollIteration, throwDice, value]);

  useEffect(() => {
    if (!isRolling && value > 0) {
      resetToValue(value);
    }
  }, [isRolling, resetToValue, value]);

  const handlePointerDown = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (disabled || isRolling) return;
    onToggleLock(index);
  };

  return (
    <group
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={handlePointerDown}
    >
      <DiceGeometry />
      {locked && (
        <Html center position={[0, DICE_SIZE / 2 + 0.5, 0]}>
          <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full shadow">
            Locked
          </div>
        </Html>
      )}
    </group>
  );
};

const Ground = () => {
  usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <shadowMaterial opacity={0.2} />
    </mesh>
  );
};

export const Dice3DScene = ({
  values,
  locked,
  onToggleLock,
  disabled = false,
  isRolling,
  rollIteration,
}: Dice3DSceneProps) => {
  const [webglSupported] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  });

  const dicePositions = useMemo(() => {
    const spacing = 1.3;
    const offset = ((values.length - 1) * spacing) / 2;
    return values.map((_, idx) => {
      const x = idx * spacing - offset;
      return [x, BASE_HEIGHT, 0] as Vector3Tuple;
    });
  }, [values]);

  if (!webglSupported) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border bg-muted text-center text-sm text-muted-foreground">
        Your browser does not support WebGL. Dice animation is unavailable.
      </div>
    );
  }

  return (
    <div className="relative h-72 w-full">
      <Canvas
        shadows
        camera={{ position: [0, 4, 7], fov: 40 }}
        className="rounded-xl"
      >
        <color attach="background" args={["#f8fafc"]} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            castShadow
            position={[6, 10, 5]}
            intensity={1.1}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Physics gravity={[0, -25, 0]}>
            <Ground />
            {values.map((value, index) => (
              <DiceBody
                key={index}
                index={index}
                value={value}
                locked={locked.includes(index)}
                disabled={disabled}
                isRolling={isRolling}
                rollIteration={rollIteration}
                onToggleLock={onToggleLock}
                position={dicePositions[index]}
              />
            ))}
          </Physics>
          <Environment preset="sunset" />
          <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={8} blur={2.5} far={8} />
        </Suspense>
      </Canvas>
    </div>
  );
};

