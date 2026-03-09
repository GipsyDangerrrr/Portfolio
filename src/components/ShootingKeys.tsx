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
        const speed = 0.008 + Math.random() * 0.012;

        // Mostly horizontal movement
        const vx = -side * speed;
        const vy = (Math.random() - 0.5) * 0.01;

        return { x, y, z, vx, vy };
    }, [viewport, index]);

    // Calculate the showcase position sitting on the table
    const showcasePos = useMemo(() => {
        const cols = 5;
        const col = index % cols;
        const row = Math.floor(index / cols);

        // Arrange in a neat grid on the desk surface area
        const x = (col - (cols - 1) / 2) * 1.6;
        const y = -4.5 - row * 1.3;
        const z = 3;

        return new THREE.Vector3(x, y, z);
    }, [index, viewport]);

    useFrame((state) => {
        if (!ref.current) return;

        // Determine effective showcase: forced by prop OR scroll progress
        // We want them to fully move to the table as we scroll out
        const isShowcase = showcase || t > 0.45;
        const rushFactor = Math.min(1, Math.max(0, (t - 0.3) / 0.4));

        if (!isShowcase) {
            // SHOOTING STAR MODE
            ref.current.position.x += data.vx;
            ref.current.position.y += data.vy;

            // Constrain rotation: Face camera but with "shooting" wobble
            const baseRotX = -Math.PI / 2;
            ref.current.rotation.x = baseRotX + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.2;
            ref.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.4 + index) * 0.2;
            ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.1;

            // Boundary wrap-around
            const margin = 10;
            if (Math.abs(ref.current.position.x) > viewport.width + margin) {
                ref.current.position.x = -Math.sign(data.vx) * (viewport.width + margin);
            }
        } else {
            // SHOWCASE MODE - Sit on table facing user
            const lerpSpeed = showcase ? 0.08 : rushFactor * 0.1;
            ref.current.position.lerp(showcasePos, lerpSpeed);

            // FACE THE USER: Tilt slightly back so text is very visible on the table
            const targetRotX = -Math.PI / 2 - 0.2;
            const targetRotY = 0;
            const targetRotZ = 0;

            ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotX, 0.1);
            ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.1);
            ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, targetRotZ, 0.1);
        }

        // Freeze when scroll is deep to avoid distracting movement
        if (t > 0.98) {
            // stop all local drift
        }
    });

    // Intense cosmic colors: Vibrant Cyan/Purple mix
    const brandColor = new THREE.Color(skill.color);
    const cosmicEmissive = new THREE.Color("#00f5ff").lerp(new THREE.Color("#ff00ff"), 0.2).lerp(brandColor, 0.4);

    return (
        <group ref={ref} position={[data.x, data.y, data.z]} scale={1.8}>
            <Trail
                width={3.5}
                length={15}
                color={cosmicEmissive}
                attenuation={(t) => t * t}
            >
                <RoundedBox args={[KEY_SIZE, KEY_HEIGHT, KEY_SIZE]} radius={0.04} smoothness={4}>
                    <meshPhysicalMaterial
                        color="#050515"
                        metalness={0.9}
                        roughness={0.1}
                        emissive={cosmicEmissive}
                        emissiveIntensity={t > 0.8 ? 1.5 : 4.0}
                    />
                </RoundedBox>
            </Trail>

            {/* The Text components are mapped to the top face (Y+) */}
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
