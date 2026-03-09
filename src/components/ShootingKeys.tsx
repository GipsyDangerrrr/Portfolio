import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text, Environment, Trail } from "@react-three/drei";
import * as THREE from "three";
import { SKILLS } from "./SkillKeyboard3D";

const KEY_SIZE = 0.58;
const KEY_HEIGHT = 0.22;

function ShootingStarKey({
    skill,
    index,
    showcase,
    t
}: {
    skill: typeof SKILLS[0];
    index: number;
    showcase: boolean;
    t: number;
}) {
    const ref = useRef<THREE.Group>(null!);
    const { viewport } = useThree();

    // Randomize initial position for shooting star mode
    const data = useMemo(() => {
        const side = index % 2 === 0 ? 1 : -1;
        const x = side * (viewport.width + 5); // Start far off-screen
        const y = (Math.random() - 0.5) * viewport.height * 2;
        const z = -2 - Math.random() * 3;
        const speed = 0.01 + Math.random() * 0.015;

        // Mostly horizontal movement
        const vx = -side * speed;
        const vy = (Math.random() - 0.5) * 0.01;

        return { x, y, z, vx, vy };
    }, [viewport, index]);

    // Calculate the showcase position surrounding the monitor
    const showcasePos = useMemo(() => {
        // Estimate monitor bounds on screen
        const monitorW = viewport.width * 0.72 * 0.7; // 72vw * monitorScale
        const monitorH = viewport.width * 0.38 * 0.7; // 16:9 aspect roughly

        const count = SKILLS.length;
        const region = index % 3; // 0: Left, 1: Right, 2: Top

        let x = 0, y = 0, z = 2.5;

        if (region === 0) { // Left side
            x = -monitorW / 2 - 1.2;
            y = (index / 3 - 2) * 1.5 - 0.5;
        } else if (region === 1) { // Right side
            x = monitorW / 2 + 1.2;
            y = (index / 3 - 2) * 1.5 - 0.5;
        } else { // Top side
            const topIndex = Math.floor(index / 3);
            x = (topIndex - 2) * 2.2;
            y = monitorH / 2 + 1.2;
        }

        return new THREE.Vector3(x, y, z);
    }, [index, viewport]);

    useFrame((state) => {
        if (!ref.current) return;

        // Determine effective showcase: either forced by prop or by scroll progress
        const isShowcase = showcase || t > 0.6;
        const rushFactor = Math.min(1, Math.max(0, (t - 0.3) / 0.4)); // 0.3 to 0.7 scroll range

        if (!isShowcase) {
            // SHOOTING STAR MODE
            ref.current.position.x += data.vx;
            ref.current.position.y += data.vy;

            // Constrain rotation: Always face camera but with a slight wobble
            const baseRotX = -Math.PI / 2;
            ref.current.rotation.x = baseRotX + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.2;
            ref.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.4 + index) * 0.2;
            ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.1;

            // Simple wrap-around
            const margin = 10;
            if (Math.abs(ref.current.position.x) > viewport.width + margin) {
                ref.current.position.x = -Math.sign(data.vx) * (viewport.width + margin);
            }
        } else {
            // SHOWCASE MODE - Surround Monitor
            // Use 't' to influence the lerp speed or position
            const lerpSpeed = showcase ? 0.08 : rushFactor * 0.1;
            ref.current.position.lerp(showcasePos, lerpSpeed);

            // Text facing AWAY from monitor:
            // If on left, look left. If on right, look right. If on top, look up.
            const targetRotY = showcasePos.x < -1 ? -0.8 : showcasePos.x > 1 ? 0.8 : 0;
            const targetRotX = showcasePos.y > 2 ? -Math.PI / 2 - 0.5 : -Math.PI / 2;

            ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotX, 0.1);
            ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.1);
            ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, 0, 0.1);
        }

        // Freeze if scrolled past completely
        if (t > 0.95) {
            // static
        }
    });

    // Cosmic colors: Cyan teal gradient feel
    const brandColor = new THREE.Color(skill.color);
    const cosmicEmissive = new THREE.Color("#00f5ff").lerp(brandColor, 0.3);

    return (
        <group ref={ref} position={[data.x, data.y, data.z]} scale={1.8}>
            <Trail
                width={3}  // Larger trails
                length={12}
                color={cosmicEmissive}
                attenuation={(t) => t * t}
            >
                <RoundedBox args={[KEY_SIZE, KEY_HEIGHT, KEY_SIZE]} radius={0.04} smoothness={4}>
                    <meshPhysicalMaterial
                        color="#050515"
                        metalness={0.9}
                        roughness={0.1}
                        emissive={cosmicEmissive}
                        emissiveIntensity={t > 0.8 ? 1.0 : 3.0} // Thimmer when in showcase
                    />
                </RoundedBox>
            </Trail>

            <Text
                position={[0, KEY_HEIGHT / 2 + 0.01, -0.04]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.2}
                fontWeight={700}
                color={cosmicEmissive}
                anchorX="center"
                anchorY="middle"
            >
                {skill.short}
            </Text>
            <Text
                position={[0, KEY_HEIGHT / 2 + 0.01, 0.12]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.08}
                color="#fff"
                anchorX="center"
                anchorY="middle"
            >
                {skill.label}
            </Text>
        </group>
    );
}

export default function ShootingKeys({
    showcase = false,
    t = 0
}: {
    showcase?: boolean;
    t?: number;
}) {
    return (
        <group>
            {SKILLS.map((skill, i) => (
                <ShootingStarKey
                    key={skill.label}
                    skill={skill}
                    index={i}
                    showcase={showcase}
                    t={t}
                />
            ))}
            <Environment preset="night" />
        </group>
    );
}
