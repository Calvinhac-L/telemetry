import { useRef, useState } from 'react'
import { Group } from "three"

export interface DieProps {
    position: [number, number, number];
    rotation: [number, number, number];
    onClick?: (value: number) => void;
}

interface Dot {
    position: [number, number, number];
}

export const Die = ({
    position,
    rotation,
    onClick
 }: DieProps) => {
  const mesh = useRef<Group>(null)
  const [diceValue, setDiceValue] = useState(1)

  const dotPositions: Record<number, Dot[]> = {
    1: [{ position: [0, 0, 0] }],
    2: [{ position: [-0.2, 0, 0] }, { position: [0.2, 0, 0] }],
    3: [
      { position: [-0.2, 0.2, 0] },
      { position: [0, 0, 0] },
      { position: [0.2, -0.2, 0] },
    ],
    4: [
      { position: [-0.2, 0.2, 0] },
      { position: [0.2, 0.2, 0] },
      { position: [-0.2, -0.2, 0] },
      { position: [0.2, -0.2, 0] },
    ],
    5: [
      { position: [-0.2, 0.2, 0] },
      { position: [0.2, 0.2, 0] },
      { position: [0, 0, 0] },
      { position: [-0.2, -0.2, 0] },
      { position: [0.2, -0.2, 0] },
    ],
    6: [
      { position: [-0.2, 0.3, 0] },
      { position: [0.2, 0.3, 0] },
      { position: [-0.2, 0, 0] },
      { position: [0.2, 0, 0] },
      { position: [-0.2, -0.3, 0] },
      { position: [0.2, -0.3, 0] },
    ],
  }

  const rollDice = () => {
    if (!mesh.current) return;

    const newRotation = {
      x: Math.random() * 2 * Math.PI,
      y: Math.random() * 2 * Math.PI,
      z: Math.random() * 2 * Math.PI,
    }
    mesh.current.rotation.set(newRotation.x, newRotation.y, newRotation.z)
    const newValue = Math.floor(Math.random() * 6) + 1
    setDiceValue(newValue)
    if (onClick) onClick(newValue)
  }

  return (
    <group ref={mesh} position={position} rotation={rotation} onClick={rollDice}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Affiche les points selon la valeur du dé */}
      {dotPositions[diceValue].map((dot, i) => (
        <mesh key={i} position={dot.position}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
      ))}
    </group>
  )
}

