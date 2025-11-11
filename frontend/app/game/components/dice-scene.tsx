"use client"

import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from "@react-three/drei"
import { Die } from "./die"

interface DiceSceneProps {
  diceValues: number[];
  rolling: boolean[];
}

export const DiceScene = ({
  diceValues,
  rolling,
}: DiceSceneProps) => {
  return (
    <Canvas
      camera={{ position: [0, 5, 8], fov: 50 }}
      style={{ width: "100%", height: "100%", background: "#e5e7eb" }}
      shadows
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <Environment preset='sunset'/>
      <OrbitControls />

      {diceValues.map((value, i) => (
        <Die
          key={i}
          value={value}
          rolling={rolling[i]}
          position={[i * 1.5 - 3, 0, 0]}
          size={1}
        />
      ))}
    </Canvas>
  )
}