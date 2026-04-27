"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function CyberGrid() {
  const gridRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    gridRef.current.position.z = (t * 2) % 10; // Endless scroll effect
  });

  return (
    <group ref={gridRef}>
      {/* Floor Grid */}
      <gridHelper args={[100, 50, "#38bdf8", "#0f172a"]} position={[0, -10, 0]} rotation={[0, 0, 0]} />
      {/* Ceiling Grid */}
      <gridHelper args={[100, 50, "#38bdf8", "#0f172a"]} position={[0, 15, 0]} rotation={[0, 0, 0]} />
    </group>
  );
}

function DataStream({ count = 40 }) {
  const lines = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 20 - 10,
      yStart: 20,
      speed: Math.random() * 0.2 + 0.1,
      length: Math.random() * 5 + 2,
      opacity: Math.random() * 0.3 + 0.1
    }));
  }, [count]);

  return (
    <group>
      {lines.map((line, i) => (
        <DataLine key={i} {...line} />
      ))}
    </group>
  );
}

function DataLine({ x, z, yStart, speed, length, opacity }: any) {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    mesh.current.position.y = yStart - ((t * 20) % 40);
  });

  return (
    <mesh ref={mesh} position={[x, yStart, z]}>
      <boxGeometry args={[0.02, length, 0.02]} />
      <meshBasicMaterial color="#38bdf8" transparent opacity={opacity} />
    </mesh>
  );
}

function StarField({ count = 1500 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 100;
      p[i * 3 + 1] = (Math.random() - 0.5) * 60;
      p[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return p;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}

export function Premium3DBackground() {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: -1, 
      pointerEvents: 'none',
      background: '#020617' 
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.05) 0%, transparent 80%)',
        zIndex: 1
      }} />
      
      <Canvas camera={{ position: [0, 2, 15], fov: 45 }}>
        <fog attach="fog" args={["#020617", 5, 35]} />
        <ambientLight intensity={0.5} />
        
        <CyberGrid />
        <DataStream count={60} />
        <StarField count={1000} />
      </Canvas>
    </div>
  );
}
