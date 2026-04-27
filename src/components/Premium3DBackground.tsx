"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingOrbs() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1.5, 64, 64]} position={[-5, 2, -10]}>
          <MeshDistortMaterial
            color="#3b82f6"
            speed={3}
            distort={0.4}
            radius={1}
            emissive="#1e3a8a"
            emissiveIntensity={0.5}
            roughness={0}
            metalness={1}
          />
        </Sphere>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <Sphere args={[1, 64, 64]} position={[6, -3, -8]}>
          <MeshWobbleMaterial
            color="#8b5cf6"
            speed={2}
            factor={0.5}
            emissive="#4c1d95"
            emissiveIntensity={0.3}
            roughness={0.1}
          />
        </Sphere>
      </Float>

      <Float speed={3} rotationIntensity={0.5} floatIntensity={3}>
        <Sphere args={[0.8, 64, 64]} position={[0, 4, -12]}>
          <MeshDistortMaterial
            color="#0ea5e9"
            speed={5}
            distort={0.6}
            radius={1}
            emissive="#0c4a6e"
            emissiveIntensity={0.4}
          />
        </Sphere>
      </Float>
    </>
  );
}

function Particles({ count = 100 }) {
  const mesh = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const temp: number[] = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(40);
      const y = THREE.MathUtils.randFloatSpread(40);
      const z = THREE.MathUtils.randFloatSpread(40);
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  useFrame((state) => {
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    mesh.current.rotation.x = state.clock.getElapsedTime() * 0.03;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
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
      background: 'linear-gradient(to bottom, #020617, #0f172a)' 
    }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        <FloatingOrbs />
        <Particles count={200} />
      </Canvas>
    </div>
  );
}
