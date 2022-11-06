import { createRoot } from 'react-dom/client'
import React from 'react'
import { Canvas } from '@react-three/fiber'
import VRM from './VRM';

const root = document.getElementById('root');
if (root) (
  createRoot(root).render(
    <Canvas>
      <VRM />
    </Canvas>,
  )
)
