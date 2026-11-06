'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface CoasterProps {
  status?: 'preparing' | 'ready';
  ticketNumber?: string;
}

function CoasterModel({ status = 'preparing', ticketNumber = '#A-108' }: CoasterProps) {
  const meshGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const isReady = status === 'ready';
  const beaconColor = isReady ? '#10B981' : '#F59E0B'; // Emerald vs Amber

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useFrame((_, delta) => {
    if (!meshGroupRef.current) return;

    // Ambient gentle rocking
    meshGroupRef.current.rotation.z += delta * 0.15;

    // Smooth lerp mouse parallax response
    meshGroupRef.current.rotation.y = THREE.MathUtils.lerp(
      meshGroupRef.current.rotation.y,
      mousePos.x * 0.45,
      0.06
    );
    meshGroupRef.current.rotation.x = THREE.MathUtils.lerp(
      meshGroupRef.current.rotation.x,
      -mousePos.y * 0.45,
      0.06
    );

    // Radar ring pulse
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.5;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.4}>
      <group ref={meshGroupRef} scale={1.35}>
        {/* 1. Base Coaster Disc (Precision Matte Black Tech Plastic) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.2, 2.2, 0.35, 64]} />
          <meshStandardMaterial
            color="#18181B"
            roughness={0.35}
            metalness={0.7}
          />
        </mesh>

        {/* 2. Outer Chamfer Rim (Anodized Orange Bezel) */}
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[2.18, 0.08, 16, 64]} />
          <meshStandardMaterial
            color="#EA580C"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>

        {/* 3. Outer LED Concentric Radar Indicators (6 Perimeter Beads) */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * Math.PI) / 3;
          const radius = 1.85;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, 0.19, Math.sin(angle) * radius]}
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color={beaconColor}
                emissive={beaconColor}
                emissiveIntensity={isReady ? 2.8 : 0.8}
              />
            </mesh>
          );
        })}

        {/* 4. Glowing Radar Beacon Ring */}
        <mesh ref={ringRef} position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.35, 32]} />
          <meshBasicMaterial
            color={beaconColor}
            transparent
            opacity={isReady ? 0.85 : 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 5. Center Acrylic Protective Display Lens (Physical Glass Material) */}
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[1.6, 1.6, 0.05, 48]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            resolution={256}
            transmission={0.88}
            roughness={0.15}
            thickness={0.6}
            ior={1.48}
            color="#FFFFFF"
          />
        </mesh>

        {/* 6. Digital Monospace Ticket Number Text */}
        <Text
          position={[0, 0.24, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.42}
          color="#FAFAFA"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          {ticketNumber}
        </Text>

        <Text
          position={[0, 0.24, 0.55]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.14}
          color={beaconColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          {isReady ? 'PESANAN SIAP' : 'SEDANG DIPROSES'}
        </Text>
      </group>
    </Float>
  );
}

interface Hero3DCoasterProps {
  status?: 'preparing' | 'ready';
  ticketNumber?: string;
  className?: string;
}

export function Hero3DCoaster({
  status = 'preparing',
  ticketNumber = '#A-108',
  className = '',
}: Hero3DCoasterProps) {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className={`relative flex h-[380px] w-full items-center justify-center ${className}`}>
        <div className="relative flex h-56 w-56 items-center justify-center rounded-full border-4 border-orange-500/40 bg-zinc-950 p-6 shadow-2xl">
          <div className="text-center font-mono">
            <span className="text-2xl font-black text-white">{ticketNumber}</span>
            <p className="mt-1 text-xs text-orange-400">PANGGIL 3D</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-[380px] w-full select-none cursor-grab active:cursor-grabbing ${className}`}>
      <Canvas
        camera={{ position: [0, 3.2, 4.5], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />
        {/* Studio 3-Point Light Rig */}
        <directionalLight position={[6, 8, 4]} intensity={2.2} color="#FFF" />
        <directionalLight position={[-6, -4, -4]} intensity={0.9} color="#38BDF8" />
        <pointLight
          position={[0, 1.5, 0]}
          intensity={status === 'ready' ? 3.5 : 1.5}
          color={status === 'ready' ? '#10B981' : '#F59E0B'}
        />

        <CoasterModel status={status} ticketNumber={ticketNumber} />
      </Canvas>
    </div>
  );
}
