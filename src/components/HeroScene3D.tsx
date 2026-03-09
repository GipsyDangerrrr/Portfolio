import { useRef, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { KeyboardMesh } from "./SkillKeyboard3D";

// ── Desk ───────────────────────────────────────────────────────────────────
function Desk() {
    return (
        <group position={[0, -0.55, 0]}>
            <RoundedBox args={[7, 0.06, 3.5]} radius={0.03} smoothness={4}>
                <meshPhysicalMaterial
                    color="#060611"
                    metalness={0.65}
                    roughness={0.2}
                    clearcoat={0.9}
                    clearcoatRoughness={0.1}
                />
            </RoundedBox>
            {/* Neon front edge */}
            <mesh position={[0, 0.04, 1.75]}>
                <boxGeometry args={[7, 0.018, 0.01]} />
                <meshBasicMaterial color="#00f5ff" transparent opacity={0.75} />
            </mesh>
            {/* Side edges */}
            <mesh position={[-3.5, 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[3.5, 0.018, 0.01]} />
                <meshBasicMaterial color="#00f5ff" transparent opacity={0.4} />
            </mesh>
            <mesh position={[3.5, 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[3.5, 0.018, 0.01]} />
                <meshBasicMaterial color="#00f5ff" transparent opacity={0.4} />
            </mesh>
            {/* Underglow */}
            <pointLight position={[0, -0.22, 0]} color="#1a3fff" intensity={1.4} distance={5} decay={2} />
        </group>
    );
}

// ── Monitor (body only — screen is the Spline CSS layer) ───────────────────
function MonitorBody() {
    const BEZEL_W = 3.6;
    const BEZEL_H = 2.1;
    const BEZEL_D = 0.14;

    return (
        <group position={[0, 0.8, 0]}>
            {/* Bezel body */}
            <RoundedBox args={[BEZEL_W, BEZEL_H, BEZEL_D]} radius={0.06} smoothness={4}>
                <meshPhysicalMaterial
                    color="#090912"
                    metalness={0.85}
                    roughness={0.12}
                    clearcoat={1}
                    clearcoatRoughness={0.04}
                />
            </RoundedBox>
            {/* Dark screen plane */}
            <mesh position={[0, 0, BEZEL_D / 2 + 0.002]}>
                <planeGeometry args={[BEZEL_W - 0.18, BEZEL_H - 0.18]} />
                <meshBasicMaterial color="#020210" />
            </mesh>
            {/* Screen glow */}
            <pointLight position={[0, 0, 0.8]} color="#3a5fff" intensity={1.5} distance={5} decay={2} />
            {/* Neon bezel edges */}
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(BEZEL_W + 0.02, BEZEL_H + 0.02, BEZEL_D + 0.01)]} />
                <lineBasicMaterial color="#00f5ff" transparent opacity={0.28} />
            </lineSegments>
            {/* Stand neck */}
            <mesh position={[0, -BEZEL_H / 2 - 0.3, -0.1]}>
                <cylinderGeometry args={[0.06, 0.09, 0.6, 12]} />
                <meshPhysicalMaterial color="#0e0e1e" metalness={0.9} roughness={0.1} clearcoat={1} />
            </mesh>
            {/* Stand base */}
            <mesh position={[0, -BEZEL_H / 2 - 0.63, -0.15]}>
                <RoundedBox args={[0.9, 0.06, 0.5]} radius={0.03} smoothness={4}>
                    <meshPhysicalMaterial color="#0e0e1e" metalness={0.9} roughness={0.1} clearcoat={1} />
                </RoundedBox>
            </mesh>
        </group>
    );
}

// ── Cyber grid floor ───────────────────────────────────────────────────────
function CyberGrid() {
    const gridRef = useRef<THREE.Group>(null!);
    const geo = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        const size = 14, div = 22, step = size / div;
        for (let i = 0; i <= div; i++) {
            const p = -size / 2 + i * step;
            pts.push(new THREE.Vector3(p, 0, -size / 2), new THREE.Vector3(p, 0, size / 2));
            pts.push(new THREE.Vector3(-size / 2, 0, p), new THREE.Vector3(size / 2, 0, p));
        }
        const g = new THREE.BufferGeometry();
        g.setFromPoints(pts);
        return g;
    }, []);

    useFrame(({ clock }) => {
        if (gridRef.current) gridRef.current.position.z = (clock.getElapsedTime() * 0.35) % 0.65;
    });

    return (
        <group ref={gridRef} position={[0, -2.9, -2]}>
            <lineSegments geometry={geo}>
                <lineBasicMaterial color="#002299" transparent opacity={0.28} />
            </lineSegments>
        </group>
    );
}

// ── Floating particles ─────────────────────────────────────────────────────
function Particles() {
    const count = 200;
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const data = useMemo(() => ({
        positions: Array.from({ length: count }, () => [
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 12 - 2,
        ] as [number, number, number]),
        speeds: Array.from({ length: count }, () => Math.random() * 0.35 + 0.08),
    }), []);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        const mat = new THREE.Matrix4();
        for (let i = 0; i < count; i++) {
            const y = ((data.positions[i][1] + t * data.speeds[i] * 0.3 + 5) % 10) - 5;
            mat.setPosition(data.positions[i][0], y, data.positions[i][2]);
            meshRef.current.setMatrixAt(i, mat);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.022, 4, 4]} />
            <meshBasicMaterial color="#00aaff" transparent opacity={0.55} />
        </instancedMesh>
    );
}

// ── Keyboard stand ─────────────────────────────────────────────────────────
function KeyboardStand() {
    return (
        <group position={[1.55, -0.28, 1.0]}>
            <mesh rotation={[0.22, 0, 0]}>
                <RoundedBox args={[1.6, 0.07, 0.28]} radius={0.03} smoothness={4}>
                    <meshPhysicalMaterial color="#090918" metalness={0.92} roughness={0.08} clearcoat={1} />
                </RoundedBox>
            </mesh>
            <mesh position={[0, 0.045, 0.15]} rotation={[0.22, 0, 0]}>
                <boxGeometry args={[1.6, 0.01, 0.005]} />
                <meshBasicMaterial color="#7c3fff" transparent opacity={0.95} />
            </mesh>
        </group>
    );
}

// ── Main scene ─────────────────────────────────────────────────────────────
export default function HeroScene3D() {
    return (
        <>
            <ambientLight intensity={0.2} />
            <directionalLight position={[4, 6, 4]} intensity={0.7} color="#c8d4ff" />
            <directionalLight position={[-4, 3, -2]} intensity={0.3} color="#7070ff" />
            <Environment preset="night" />

            <Suspense fallback={null}>
                <MonitorBody />
                <Desk />
                <CyberGrid />
                <Particles />
                <KeyboardStand />
                <KeyboardMesh
                    position={[1.45, -0.06, 1.05]}
                    scale={0.58}
                    rotation={[Math.PI / 2 - 0.32, 0.18, 0.08]}
                />
            </Suspense>
        </>
    );
}
