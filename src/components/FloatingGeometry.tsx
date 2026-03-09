import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape({
    geometry,
    position,
    scale,
    speed,
    color,
}: {
    geometry: "octahedron" | "dodecahedron" | "sphere" | "icosahedron";
    position: [number, number, number];
    scale: number;
    speed: number;
    color: string;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
            meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
        }
    });

    const geo = useMemo(() => {
        switch (geometry) {
            case "octahedron":
                return <octahedronGeometry args={[1, 0]} />;
            case "dodecahedron":
                return <dodecahedronGeometry args={[1, 0]} />;
            case "sphere":
                return <sphereGeometry args={[1, 16, 16]} />;
            case "icosahedron":
                return <icosahedronGeometry args={[1, 0]} />;
        }
    }, [geometry]);

    return (
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.8}>
            <mesh ref={meshRef} position={position} scale={scale}>
                {geo}
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={0.12}
                    wireframe
                    depthWrite={false}
                />
            </mesh>
        </Float>
    );
}

function SubtleParticles() {
    const count = 80;
    const ref = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 16;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.elapsedTime * 0.008;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#5b8def"
                transparent
                opacity={0.3}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

interface FloatingGeometryProps {
    className?: string;
}

export default function FloatingGeometry({ className = "" }: FloatingGeometryProps) {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mq.matches);
        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    if (reducedMotion) return null;

    return (
        <div className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 40 }}
                dpr={[1, 1]}
                gl={{ antialias: false, alpha: true }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.2} />
                <directionalLight position={[3, 3, 5]} intensity={0.3} color="#5b8def" />

                <FloatingShape
                    geometry="octahedron"
                    position={[-4, 2, -3]}
                    scale={0.8}
                    speed={0.3}
                    color="#5b8def"
                />
                <FloatingShape
                    geometry="dodecahedron"
                    position={[4, -1, -4]}
                    scale={0.6}
                    speed={0.25}
                    color="#8b5cf6"
                />
                <FloatingShape
                    geometry="icosahedron"
                    position={[-2, -3, -2]}
                    scale={0.5}
                    speed={0.35}
                    color="#6d9efc"
                />
                <FloatingShape
                    geometry="sphere"
                    position={[3, 3, -5]}
                    scale={0.4}
                    speed={0.2}
                    color="#5b8def"
                />

                <SubtleParticles />
            </Canvas>
        </div>
    );
}
