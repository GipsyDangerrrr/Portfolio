import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ── Skill data ── */
interface SkillKey {
    label: string;
    short: string;     // abbreviation shown on keycap
    color: string;     // brand color
    row: number;
    col: number;
    width?: number;    // keycap width multiplier (1 = standard)
}

export const SKILLS: SkillKey[] = [
    // Row 0 — top
    { label: "Figma", short: "Fi", color: "#A259FF", row: 0, col: 0 },
    { label: "Canva", short: "Cv", color: "#00C4CC", row: 0, col: 1 },
    { label: "Webflow", short: "Wf", color: "#4353FF", row: 0, col: 2 },
    { label: "Wix", short: "Wx", color: "#0C6EFC", row: 0, col: 3 },
    // Row 1 — middle
    { label: "Filmora", short: "Fm", color: "#00E5FF", row: 1, col: 0 },
    { label: "CapCut", short: "Cc", color: "#FFFFFF", row: 1, col: 1 },
    { label: "Lightroom", short: "Lr", color: "#31A8FF", row: 1, col: 2 },
    { label: "React", short: "Re", color: "#61DAFB", row: 1, col: 3 },
    // Row 2 — bottom-ish
    { label: "Aisensy", short: "Ai", color: "#25D366", row: 2, col: 0 },
    { label: "Marketing", short: "Mk", color: "#FF6B6B", row: 2, col: 1, width: 2.15 },
    { label: "Analytics", short: "An", color: "#FBBF24", row: 2, col: 3 },
    // Row 3 — bottom
    { label: "R Studio", short: "Rs", color: "#75AADB", row: 3, col: 1 },
    { label: "Orange", short: "Og", color: "#F48120", row: 3, col: 2 },
];

const KEY_SIZE = 0.58;
const KEY_HEIGHT = 0.22;
const GAP = 0.08;
const ROWS = 4;

/* ── Single Key ── */
function KeyCap({ skill, hovered, onHover, onLeave }: {
    skill: SkillKey;
    hovered: boolean;
    onHover: () => void;
    onLeave: () => void;
}) {
    const ref = useRef<THREE.Mesh>(null!);
    const [pressed, setPressed] = useState(false);

    const width = (skill.width ?? 1) * KEY_SIZE + (skill.width ? (skill.width - 1) * GAP : 0);

    // Smooth press/hover animation
    useFrame(() => {
        if (!ref.current) return;
        const targetY = pressed ? -0.04 : hovered ? 0.06 : 0;
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.15);
    });

    // Position based on row/col
    const x = skill.col * (KEY_SIZE + GAP) + (width - KEY_SIZE) / 2;
    const z = skill.row * (KEY_SIZE + GAP);

    const brandColor = new THREE.Color(skill.color);
    const isLight = brandColor.getHSL({ h: 0, s: 0, l: 0 }).l > 0.7;

    return (
        <group position={[x, 0, z]}>
            <mesh
                ref={ref}
                onPointerEnter={(e) => { e.stopPropagation(); onHover(); }}
                onPointerLeave={(e) => { e.stopPropagation(); onLeave(); }}
                onPointerDown={() => setPressed(true)}
                onPointerUp={() => setPressed(false)}
            >
                <RoundedBox args={[width, KEY_HEIGHT, KEY_SIZE]} radius={0.04} smoothness={4}>
                    <meshPhysicalMaterial
                        color={hovered ? skill.color : "#1a1a2e"}
                        metalness={0.3}
                        roughness={0.25}
                        clearcoat={0.8}
                        clearcoatRoughness={0.15}
                        envMapIntensity={1.2}
                    />
                </RoundedBox>

                {/* Keycap top inset (darker depression) */}
                <mesh position={[0, KEY_HEIGHT / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[width - 0.08, KEY_SIZE - 0.08]} />
                    <meshPhysicalMaterial
                        color={hovered ? new THREE.Color(skill.color).multiplyScalar(0.85) : "#111122"}
                        metalness={0.1}
                        roughness={0.4}
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                {/* Abbreviation text */}
                <Text
                    position={[0, KEY_HEIGHT / 2 + 0.01, -0.04]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.15}
                    fontWeight={700}
                    color={hovered ? (isLight ? "#111" : "#fff") : skill.color}
                    anchorX="center"
                    anchorY="middle"
                >
                    {skill.short}
                </Text>

                {/* Skill name (small, bottom of key) */}
                <Text
                    position={[0, KEY_HEIGHT / 2 + 0.01, 0.12]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.06}
                    color={hovered ? (isLight ? "#333" : "#ddd") : "#555"}
                    anchorX="center"
                    anchorY="middle"
                >
                    {skill.label}
                </Text>
            </mesh>

            {/* Glow on hover */}
            {hovered && (
                <pointLight
                    position={[0, 0.3, 0]}
                    color={skill.color}
                    intensity={2}
                    distance={1.5}
                    decay={2}
                />
            )}
        </group>
    );
}

/* ── Keyboard body ── */
function Keyboard({ tilt = Math.PI / 2 }: { tilt?: number }) {
    const groupRef = useRef<THREE.Group>(null!);
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);
    const { pointer } = useThree();

    // Center the keyboard
    const totalWidth = 4 * KEY_SIZE + 3 * GAP;
    const totalDepth = ROWS * KEY_SIZE + (ROWS - 1) * GAP;

    // Slow auto-rotation + mouse tilt
    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const t = clock.getElapsedTime();
        // Gentle idle sway
        const idleY = Math.sin(t * 0.3) * 0.03;
        const idleX = Math.cos(t * 0.2) * 0.02;
        // Mouse tilt (very subtle)
        const mouseX = pointer.y * 0.06;
        const mouseY = -pointer.x * 0.06;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, tilt + mouseX + idleX, 0.05);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0 + mouseY + idleY, 0.05);
    });

    return (
        <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3} floatingRange={[-0.05, 0.05]}>
            <group ref={groupRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.45}>
                {/* Keyboard base plate */}
                <mesh position={[totalWidth / 2 - KEY_SIZE / 2, -KEY_HEIGHT / 2 - 0.06, totalDepth / 2 - KEY_SIZE / 2]}>
                    <RoundedBox args={[totalWidth + 0.3, 0.1, totalDepth + 0.3]} radius={0.08} smoothness={4}>
                        <meshPhysicalMaterial
                            color="#0d0d1a"
                            metalness={0.6}
                            roughness={0.2}
                            clearcoat={1}
                            clearcoatRoughness={0.1}
                        />
                    </RoundedBox>
                </mesh>

                {/* Keycaps */}
                {SKILLS.map((skill) => (
                    <KeyCap
                        key={skill.label}
                        skill={skill}
                        hovered={hoveredKey === skill.label}
                        onHover={() => setHoveredKey(skill.label)}
                        onLeave={() => setHoveredKey(null)}
                    />
                ))}

                {/* Ambient underglow */}
                <pointLight position={[1, -0.5, 1]} color="#4353FF" intensity={0.5} distance={3} />
                <pointLight position={[-0.5, -0.5, 0.5]} color="#A259FF" intensity={0.3} distance={3} />
            </group>
        </Float>
    );
}

/* ── Named export for embedding in another R3F Canvas ── */
export function KeyboardMesh({
    position = [0, 0, 0] as [number, number, number],
    scale = 0.45,
    rotation = [0, 0, 0] as [number, number, number],
    tilt = Math.PI / 2,
}) {
    return (
        <group position={position} rotation={rotation} scale={scale}>
            <Keyboard tilt={tilt} />
        </group>
    );
}

/* ── Standalone component (own Canvas) ── */
export default function SkillKeyboard3D() {
    return (
        <div className="w-full h-full" style={{ minHeight: 400 }}>
            <Canvas
                camera={{ position: [0, 0.1, 3.8], fov: 36 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} color="#e8e8ff" />
                <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#a0a0ff" />
                <Environment preset="city" />
                <Keyboard />
            </Canvas>
        </div>
    );
}
