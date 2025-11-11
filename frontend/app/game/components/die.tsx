"use client"

import { a, useSpring } from '@react-spring/three';
import { RoundedBoxGeometry } from '@react-three/drei';
import { useEffect, useRef } from 'react'
import { Group } from "three"

export interface DieProps {
    position: [number, number, number];
    size?: number;
    value: number;
    rolling?: boolean;
}

const HALF_SIZE = 0.5;
const EPSILON = -0.02;
type FaceName = "+X" | "+Y" | "+Z" | "-X" | "-Y" | "-Z"

const valueToFace: [number, FaceName][] = [
  [1, "+Y"],
  [2, "+Z"],
  [3, "-X"],
  [4, "+X"],
  [5, "-Z"],
  [6, "-Y"],
];

const facePatterns: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-0.25, 0.25], [0.25, -0.25]],
  3: [[-0.25, 0.25], [0, 0], [0.25, -0.25]],
  4: [[-0.25, 0.25], [0.25, 0.25], [-0.25, -0.25], [0.25, -0.25]],
  5: [[-0.25, 0.25], [0.25, 0.25], [0, 0], [-0.25, -0.25], [0.25, -0.25]],
  6: [[-0.25, 0.3], [0.25, 0.3], [-0.25, 0], [0.25, 0], [-0.25, -0.3], [0.25, -0.3]],
};

const finalRotations: Record<number, [number, number, number]> = {
  1: [0, 0, 0],
  2: [-Math.PI / 2, 0, 0],
  3: [0, 0, -Math.PI / 2],
  4: [0, 0, Math.PI / 2],
  5: [Math.PI / 2, 0, 0],
  6: [Math.PI, 0, 0],
}

const uvToxyz = (u: number, v: number, face: FaceName, half = HALF_SIZE, eps = EPSILON) => {
  switch (face) {
    case "+Z": return [u, v, half + eps];
    case "-Z": return [u, v, -half - eps];
    case "+X": return [half + eps, v, -u];
    case "-X": return [-half - eps, v , u];
    case "+Y": return [u, half + eps, v];
    case "-Y": return [u, -half - eps, v];
  };
};

export const Die = ({
    position,
    size = 1,
    value,
    rolling = false
 }: DieProps) => {

  const mesh = useRef<Group | null>(null)
  const half = size / 2;

  const [spring, api] = useSpring(() => ({
    rotation: finalRotations[value],
    config: { mass: 2, tension: 200, friction: 30 },
  }));

  useEffect(() => {
    if (rolling) {
      const randomSpin = () => [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ] as [number, number, number]

      api.start({
        rotation: randomSpin(),
        loop: { reverse: false },
        config: { mass: 1, tension: 30, friction: 5 },
      })
    }
  }, [api, rolling])

  useEffect(() => {
    if (!rolling) {
      api.start({
        rotation: finalRotations[value],
        loop: { reverse: false },
        config: { mass: 2, tension: 90, friction: 25 },
      })
    }
  }, [api, value, rolling])

  return (
    <a.group ref={mesh} position={position} rotation={spring.rotation} scale={[size, size, size]}>
      <mesh castShadow>
        <RoundedBoxGeometry args={[1, 1, 1]} radius={.08} />
        <meshStandardMaterial color="#FF0000" roughness={0.2} metalness={0.1} envMapIntensity={0.8} />
      </mesh>
      {valueToFace.map(([value, face]) =>
        facePatterns[value].map((uv, i) => {
          const [u, v] = uv;
          const [x, y, z] = uvToxyz(u, v, face, half);

          return (
            <mesh key={`${face}-${i}`} position={[x, y ,z]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#111827"/>
            </mesh>
          )
        })
      )}
    </a.group>
  )
}

