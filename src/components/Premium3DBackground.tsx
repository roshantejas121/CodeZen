"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

function StarField({ count = 1000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 100;
      p[i * 3 + 1] = (Math.random() - 0.5) * 100;
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
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function AuroraRibbon({ color, position, speed }: { color: string, position: [number, number, number], speed: number }) {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    mesh.current.rotation.z = Math.sin(t * 0.1) * 0.2;
    mesh.current.position.y = position[1] + Math.sin(t * 0.3) * 1.5;
    mesh.current.position.x = position[0] + Math.cos(t * 0.2) * 2;
  });

  return (
    <mesh ref={mesh} position={position} rotation={[-Math.PI / 3, 0, 0]}>
      <planeGeometry args={[50, 15, 64, 64]} />
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={0.5}
        radius={1}
        transparent
        opacity={0.12}
        emissive={color}
        emissiveIntensity={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Particles({ count = 150 }) {
  const mesh = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const temp: number[] = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(50);
      const y = THREE.MathUtils.randFloatSpread(50);
      const z = THREE.MathUtils.randFloatSpread(50);
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  useFrame((state) => {
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    mesh.current.rotation.x = state.clock.getElapsedTime() * 0.01;
  });

  return (
    <>
      {/* @ts-ignore */}
      <points ref={mesh}>
        {/* @ts-ignore */}
        <bufferGeometry>
          {/* @ts-ignore */}
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        {/* @ts-ignore */}
        </bufferGeometry>
        {/* @ts-ignore */}
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.2}
          sizeAttenuation
        />
      </points>
    </>
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
      background: 'linear-gradient(to bottom, #020617, #0a1128)' 
    }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
        <ambientLight intensity={0.5} />
        
        <StarField count={2000} />
        
        <AuroraRibbon color="#3b82f6" position={[0, 8, -20]} speed={0.5} />
        <AuroraRibbon color="#8b5cf6" position={[-5, -5, -25]} speed={0.3} />
        <AuroraRibbon color="#0ea5e9" position={[5, 0, -15]} speed={0.7} />

        <Particles count={300} />
      </Canvas>
    </div>
  );
}
