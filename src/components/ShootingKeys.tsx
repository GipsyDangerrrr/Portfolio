import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Environment, Trail } from "@react-three/drei";
import * as THREE from "three";
import { SKILLS } from "./SkillKeyboard3D";

const KEY_SIZE = 0.58;
const KEY_HEIGHT = 0.22;

interface ShootingKeysProps {
    showSkillset?: boolean;
    progress?: number;
    monitorScale?: number;
    monitorTranslateY?: number;
}

/**
 * SculptedKeycapGeometry:
 * Creates a tapered truncated pyramid shape resembling a mechanical keycap.
 */
function useKeycapGeometry() {
    return useMemo(() => {
        const geometry = new THREE.BoxGeometry(KEY_SIZE, KEY_HEIGHT, KEY_SIZE, 1, 1, 1);
        const position = geometry.attributes.position;
        const taper = 0.82; // Shrink the top face

        for (let i = 0; i < position.count; i++) {
            const y = position.getY(i);
            if (y > 0) { // Top vertices
                position.setX(i, position.getX(i) * taper);
                position.setZ(i, position.getZ(i) * taper);
            }
        }
        geometry.computeVertexNormals();
        return geometry;
    }, []);
}

/**
 * OrbitalRing:
 * Renders a thin, glowing elliptical path for an "electron" skill.
 */
function OrbitalRing({ radius, tiltX, tiltY, color, opacity }: { radius: number; tiltX: number; tiltY: number; color: string; opacity: number }) {
    const geoRef = useRef<THREE.BufferGeometry>(null!);
    const points = useMemo(() => {
        const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.7, 0, 2 * Math.PI, false, 0);
        return curve.getPoints(100).map(p => new THREE.Vector3(p.x, p.y, 0));
    }, [radius]);

    useEffect(() => {
        if (geoRef.current) {
            geoRef.current.setFromPoints(points);
        }
    }, [points]);

    return (
        <group rotation={[tiltX, tiltY, 0]}>
            <line>
                <bufferGeometry ref={geoRef} attach="geometry" />
                <lineBasicMaterial attach="material" color={color} transparent opacity={opacity * 0.1} linewidth={1} />
            </line>
        </group>
    );
}

/**
 * AtomicSkillKey:
 * Renders a single 3D key that orbits the monitor like an electron.
 */
function AtomicSkillKey({
    skill,
    index,
    showSkillset,
    globalOpacity,
    monitorScale = 1,
    monitorTranslateY = 0
}: {
    skill: typeof SKILLS[0];
    index: number;
    showSkillset: boolean;
    globalOpacity: number;
    monitorScale?: number;
    monitorTranslateY?: number;
}) {
    const ref = useRef<THREE.Group>(null!);
    const meshRef = useRef<THREE.Mesh>(null!);
    const geometry = useKeycapGeometry();
    const isMobile = window.innerWidth < 768;

    // Extracted Cosmic Color Pairs from User Image
    const cosmicGradientPairs = useMemo(() => [
        ["#0001fd", "#33a1ff"], // Intense Blue/Cyan
        ["#9d2aff", "#ff2ae2"], // Deep Purple/Pink
        ["#4101ff", "#ffcc00"], // Blue/Orange
        ["#01c4ff", "#ff017c"], // Cyan/Magenta
        ["#b401ff", "#ff8a00"], // Purple/Golden
        ["#2401ff", "#00f6ff"], // Deep Blue/Teal
        ["#ff0101", "#01ffec"]  // Red/Aqua
    ], []);

    const [colorA, colorB] = useMemo(() => {
        const pair = cosmicGradientPairs[index % cosmicGradientPairs.length];
        return [new THREE.Color(pair[0]), new THREE.Color(pair[1])];
    }, [index, cosmicGradientPairs]);

    // STABLE ORBIT INITIALIZATION
    const orbitData = useMemo(() => {
        const radius = isMobile
            ? 4 + Math.random() * 6  // Smaller orbit for mobile
            : 8 + Math.random() * 8;
        const tiltX = (Math.random() - 0.5) * Math.PI * 0.7;
        const tiltY = (Math.random() - 0.5) * Math.PI * 0.7;
        const speed = 0.15 + Math.random() * 0.3;
        const phase = Math.random() * Math.PI * 2;

        return { radius, tiltX, tiltY, speed, phase };
    }, [isMobile]);

    const currentOrbitPos = useRef(new THREE.Vector3());

    useFrame((state) => {
        if (!ref.current) return;

        // 1. Orbital position (Slow-spawn: grow radius from 0 based on opacity)
        const spawnMultiplier = THREE.MathUtils.smoothstep(globalOpacity, 0, 0.8);
        const currentRadius = orbitData.radius * spawnMultiplier;

        const t = state.clock.elapsedTime * orbitData.speed + orbitData.phase;
        const localX = Math.cos(t) * currentRadius;
        const localY = Math.sin(t) * currentRadius * 0.7;
        const pos = new THREE.Vector3(localX, localY, 0);
        pos.applyEuler(new THREE.Euler(orbitData.tiltX, orbitData.tiltY, 0));
        currentOrbitPos.current.copy(pos);

        // 2. Showcase position (locked to monitor screen)
        const monitorYOffset = -(monitorTranslateY / 100) * (isMobile ? 12 : 20);

        const cols = isMobile ? 4 : 7;
        const col = index % cols;
        const row = Math.floor(index / cols);
        const spacingX = (isMobile ? 1.0 : 1.7) * monitorScale;
        const spacingY = (isMobile ? 1.2 : 1.9) * monitorScale;

        const targetX = (col - (cols - 1) / 2) * spacingX;
        const targetY = monitorYOffset + ((isMobile ? 1.2 : 1.6) * monitorScale - row * spacingY);
        const targetZ = 4; // Stay in front

        const targetPos = new THREE.Vector3(targetX, targetY, targetZ);

        if (showSkillset) {
            ref.current.position.lerp(targetPos, 0.1);
            const targetScaleSize = (isMobile ? 1.4 : 2.2) * monitorScale;
            ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScaleSize, 0.1));
            ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, Math.PI / 2, 0.1);
            ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, 0, 0.1);
            ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, 0, 0.1);
        } else {
            ref.current.position.lerp(currentOrbitPos.current, 0.05);
            const targetScaleSize = isMobile ? 1.2 : 2.2;
            ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, targetScaleSize, 0.1));
            ref.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.08;
            ref.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.4 + index) * 0.08;
            ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.04;
        }

        if (meshRef.current) {
            const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
            if (material.userData.shader) {
                material.userData.shader.uniforms.uTime.value = state.clock.elapsedTime;
            }
        }
    });

    const bodyColor = "#050510";
    const trailColor = colorA.clone().lerp(new THREE.Color("#000"), 0.5);

    const material = useMemo(() => {
        const mat = new THREE.MeshPhysicalMaterial({
            color: bodyColor,
            metalness: 0.2,
            roughness: 0.4,
            transmission: 0.6,
            thickness: 0.4,
            ior: 1.4,
            emissive: colorA,
            emissiveIntensity: 0.25,
            transparent: true,
            opacity: 0.7,
        });

        mat.onBeforeCompile = (shader) => {
            shader.uniforms.uColorA = { value: colorA };
            shader.uniforms.uColorB = { value: colorB };
            shader.uniforms.uTime = { value: 0 };

            shader.vertexShader = `
                varying vec3 vLocalPos;
                ${shader.vertexShader}
            `.replace(
                `#include <begin_vertex>`,
                `#include <begin_vertex>
                vLocalPos = position;`
            );

            shader.fragmentShader = `
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                uniform float uTime;
                varying vec3 vLocalPos;
                ${shader.fragmentShader}
            `.replace(
                `#include <color_fragment>`,
                `#include <color_fragment>
                float blend = clamp((vLocalPos.x / ${KEY_SIZE.toFixed(2)}) + 0.5, 0.0, 1.0);
                blend += sin(vLocalPos.y * 5.0 + uTime * 1.5) * 0.08;
                blend = clamp(blend, 0.0, 1.0);
                vec3 finalCosmic = mix(uColorA, uColorB, blend);
                diffuseColor.rgb = mix(diffuseColor.rgb, finalCosmic, 0.6);
                `
            );
            mat.userData.shader = shader;
        };
        return mat;
    }, [colorA, colorB]);

    return (
        <group visible={globalOpacity > 0.001}>
            {!showSkillset && globalOpacity > 0.1 && (
                <OrbitalRing
                    radius={orbitData.radius}
                    tiltX={orbitData.tiltX}
                    tiltY={orbitData.tiltY}
                    color={colorA.getStyle()}
                    opacity={globalOpacity}
                />
            )}

            <group ref={ref} visible={globalOpacity > 0.001}>
                {globalOpacity > 0.7 ? (
                    <Trail
                        width={showSkillset ? 0 : 2.5}
                        length={6}
                        color={trailColor}
                        attenuation={(t) => t * t}
                    >
                        <mesh ref={meshRef} geometry={geometry} material={material} />
                    </Trail>
                ) : (
                    <mesh ref={meshRef} geometry={geometry} material={material} />
                )}

                <Text
                    position={[0, KEY_HEIGHT / 2 + 0.011, -0.05]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.24}
                    fontWeight={900}
                    color="#fff"
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={globalOpacity * 0.8}
                >
                    {skill.short}
                </Text>

                <Text
                    position={[0, KEY_HEIGHT / 2 + 0.011, 0.14]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.09}
                    color="#fff"
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={globalOpacity * 0.6}
                >
                    {skill.label}
                </Text>
            </group>
        </group>
    );
}

export default function ShootingKeys({
    showSkillset = false,
    progress = 0,
    monitorScale = 1,
    monitorTranslateY = 0
}: ShootingKeysProps) {
    const globalOpacity = useMemo(() => {
        // Only show stars AFTER monitor zoom-out is basically complete (95%)
        if (progress < 0.95) return 0;
        return Math.min(0.8, (progress - 0.95) / 0.05);
    }, [progress]);

    return (
        <group>
            {SKILLS.map((skill, i) => (
                <AtomicSkillKey
                    key={skill.label}
                    skill={skill}
                    index={i}
                    showSkillset={showSkillset}
                    globalOpacity={globalOpacity}
                    monitorScale={monitorScale}
                    monitorTranslateY={monitorTranslateY}
                />
            ))}
            <Environment preset="night" />
        </group>
    );
}
