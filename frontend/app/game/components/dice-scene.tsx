"use client"

import { useState } from "react"
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/cannon'
import { OrbitControls } from "@react-three/drei"
import { Die } from "./die"

export default function DiceScene() {
  const [value, setValue] = useState(1)

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} castShadow />
        <Physics>
          <Die position={[0, 0, 0]} rotation={[0, 0, 0]} onClick={setValue} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
        </Physics>
        <OrbitControls />
      </Canvas>
      <p style={{ textAlign: 'center', fontSize: '24px' }}>Valeur : {value}</p>
    </div>
  )
}