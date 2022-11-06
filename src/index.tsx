import { createRoot } from 'react-dom/client'
import React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const root = document.getElementById('root');
if (root) (
  createRoot(root).render(
    <Canvas>
      <mesh>
        <boxBufferGeometry />
        <meshBasicMaterial color="hotpink" />
      </mesh>
    </Canvas>,
  )
)
