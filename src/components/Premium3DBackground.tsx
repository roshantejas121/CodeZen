"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, MeshDistortMaterial, MeshWobbleMaterial, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// Individual interactive ice shard
function IceShard({ position, scale = 1, index }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * (hovered ? 1.5 : 0.2);
    meshRef.current.rotation.x += delta * (hovered ? 0.8 : 0.1);
    
    const targetScale = hovered ? scale * 1.4 : scale;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
      >
        <dodecahedronGeometry args={[1, 0]} />
        <MeshWobbleMaterial
          factor={hovered ? 0.4 : 0.1}
          speed={2}
          color={hovered ? "#f0f9ff" : "#7dd3fc"}
          emissive={hovered ? "#38bdf8" : "#0c4a6e"}
          emissiveIntensity={hovered ? 1.5 : 0.5}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

// A large, addictive "Ice Heart" core that distorts on hover
function AddictiveIceCore() {
  const coreRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const { viewport } = useThree();
  const [hovered, setHover] = useState(false);
  const mousePos = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    const targetX = (mousePos.current.x * viewport.width) / 2.5;
    const targetY = (mousePos.current.y * viewport.height) / 2.5;
    
    coreRef.current.position.x = THREE.MathUtils.lerp(coreRef.current.position.x, targetX, delta * 2);
    coreRef.current.position.y = THREE.MathUtils.lerp(coreRef.current.position.y, targetY, delta * 2);
    
    lightRef.current.position.copy(coreRef.current.position);
    lightRef.current.position.z += 3;
    
    coreRef.current.rotation.z += delta * (hovered ? 2 : 0.5);
    
    const baseScale = hovered ? 3.5 : 2.5;
    const pulse = Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
    coreRef.current.scale.lerp(new THREE.Vector3(baseScale + pulse, baseScale + pulse, baseScale + pulse), delta * 4);
  });

  return (
    <>
      <pointLight ref={lightRef} distance={20} intensity={6} color="#7dd3fc" />
      <Float speed={4} rotationIntensity={1} floatIntensity={0.5}>
        <mesh 
          ref={coreRef} 
          position={[0, 0, -3]}
          onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHover(false); }}
        >
          <octahedronGeometry args={[1, 2]} />
          <MeshDistortMaterial
            distort={hovered ? 0.6 : 0.3}
            speed={hovered ? 4 : 1.5}
            color={hovered ? "#ffffff" : "#bae6fd"}
            emissive={hovered ? "#0ea5e9" : "#0369a1"}
            emissiveIntensity={hovered ? 2 : 0.8}
            metalness={0.9}
            roughness={0.05}
          />
          <Sparkles count={hovered ? 120 : 40} scale={4} size={6} speed={1} color="#ffffff" />
        </mesh>
      </Float>
    </>
  );
}

function SnowFall({ count = 1000 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = (Math.random() - 0.5) * 50;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null!);
  useFrame((state, delta) => {
    pointsRef.current.position.y -= delta * 1.5;
    if (pointsRef.current.position.y < -15) pointsRef.current.position.y = 15;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export function Premium3DBackground() {
  const shards = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      position: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 25, (Math.random() - 0.5) * 10 - 8] as [number, number, number],
      scale: Math.random() * 0.5 + 0.2,
      index: i,
    }));
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, left: 0, width: '100vw', height: '100vh', 
      zIndex: 0, pointerEvents: 'auto',
      background: '#020617' 
    }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <fog attach="fog" args={["#020617", 10, 45]} />
        <ambientLight intensity={0.5} color="#ffffff" />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-15, -15, -10]} intensity={2} color="#0ea5e9" />

        <group>
          {shards.map((s, i) => <IceShard key={i} {...s} />)}
        </group>
        <AddictiveIceCore />
        <SnowFall count={800} />
        
        <ContactShadows position={[0, -10, 0]} opacity={0.4} scale={40} blur={2} far={15} />
      </Canvas>
    </div>
  );
}
