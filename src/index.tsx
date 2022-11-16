import { createRoot } from 'react-dom/client'
import React from 'react'
import { Canvas } from '@react-three/fiber'
import Floor from './Floor';
import Multiplayer from './Multiplayer';

const root = document.getElementById('root');
if (root) (
  createRoot(root).render(
    <Canvas>
      <Floor />
      <Multiplayer />
    </Canvas>,
  )
)