"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { RubiksCube } from '@/components/cube/RubiksCube';
import { Controls } from '@/components/ui/Controls';
import { History } from '@/components/ui/History';

export default function Home() {
  return (
    <main className="w-full h-screen bg-neutral-900 overflow-hidden relative">
      <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <group position={[0, 0, 0]}>
            <RubiksCube />
          </group>

          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          <Environment preset="city" />
          <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={10} />
        </Suspense>
      </Canvas>

      <History />
      <Controls />

      <div className="absolute top-4 right-4 text-white/30 text-xs font-mono">
        Rubik's Cube Solver v1.0
      </div>
    </main>
  );
}
