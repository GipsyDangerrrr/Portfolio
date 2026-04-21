import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CosmicWaves() {
    const groupRef = useRef<THREE.Group>(null!);

    // We create multiple lines (the "fibers" or "ribbons")
    const numLines = 350; // Ultra high density to fuse into a solid curtain
    const pointsPerLine = 150; // High resolution horizontal curves

    // Create base geometry and materials
    const lines = useMemo(() => {
        const arr = [];
        const colors = [
            new THREE.Color("#00f5ff"), // Cyan
            new THREE.Color("#b401ff"), // Purple
            new THREE.Color("#ff007c"), // Pink
            new THREE.Color("#0001fd"), // Deep Blue
        ];

        const getClothColor = (t: number) => {
            const normalizedT = ((t % 1) + 1) % 1;
            const c0 = colors[0];
            const c1 = colors[1];
            const c2 = colors[2];
            const c3 = colors[3];

            if (normalizedT < 0.33) return c0.clone().lerp(c1, normalizedT / 0.33);
            if (normalizedT < 0.66) return c1.clone().lerp(c2, (normalizedT - 0.33) / 0.33);
            return c2.clone().lerp(c3, (normalizedT - 0.66) / 0.34);
        };

        for (let i = 0; i < numLines; i++) {
            const positions = new Float32Array(pointsPerLine * 3);
            const colorsArray = new Float32Array(pointsPerLine * 3);
            const geometry = new THREE.BufferGeometry();

            const normalizedCoord = i / (numLines - 1);

            // Build horizontal gradients per-vertex for each line!
            for (let j = 0; j < pointsPerLine; j++) {
                const xNormalized = j / (pointsPerLine - 1);

                // Color the cloth horizontally by offsetting through the palette
                const pointColor = getClothColor((normalizedCoord * 0.5) + (xNormalized * 1.5));

                // Brighten the core glow so even wide parts stay luminous
                pointColor.lerp(new THREE.Color("#ffffff"), 0.15);

                colorsArray[j * 3] = pointColor.r;
                colorsArray[j * 3 + 1] = pointColor.g;
                colorsArray[j * 3 + 2] = pointColor.b;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

            // Boosted base opacity to eliminate dull sections and create a "solid" silk feel
            const opacity = 0.12 + Math.sin(normalizedCoord * Math.PI) * 0.18;

            const material = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: opacity,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                linewidth: 1
            });

            const lineObj = new THREE.Line(geometry, material);
            lineObj.frustumCulled = false;

            arr.push({
                lineObj,
                speedY: 0.15,
                speedX: 0.28,
                phase: 0,
                amplitude: 1.0,
                // Tighter spread for a denser curtain
                spreadY: (normalizedCoord - 0.5) * 1.2,
                spreadZ: (normalizedCoord - 0.5) * 0.8
            });
        }
        return arr;
    }, []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        lines.forEach((line) => {
            const positions = line.lineObj.geometry.attributes.position.array as Float32Array;

            for (let j = 0; j < pointsPerLine; j++) {
                const x = (j / (pointsPerLine - 1)) * 40 - 20;

                const wave1 = Math.sin(x * 0.12 + time * line.speedX + line.phase);
                const wave2 = Math.sin(x * 0.2 - time * line.speedY + line.phase);

                let y = wave1 * line.amplitude + wave2 * (line.amplitude * 0.5);
                let z = Math.cos(x * 0.15 + time * 0.8 + line.phase) * 1.5;

                const pinch = Math.exp(-Math.pow(x * 0.08, 2));
                y *= pinch;
                z *= pinch;

                // Increased mathematical frequency (0.15 instead of 0.07) for twice as many bright folds!
                const twist = Math.sin(x * 0.15 + time * 0.4) * 2.8;
                const surfaceY = line.spreadY * Math.cos(twist) - line.spreadZ * Math.sin(twist);
                const surfaceZ = line.spreadY * Math.sin(twist) + line.spreadZ * Math.cos(twist);

                const edgeFlap = Math.sin(time * 2.0 + x * 0.3) * (Math.abs(line.spreadY) * 0.08);

                positions[j * 3] = x;
                positions[j * 3 + 1] = y + surfaceY * pinch - 1.0 + edgeFlap;
                positions[j * 3 + 2] = z + surfaceZ * pinch;
            }
            line.lineObj.geometry.attributes.position.needsUpdate = true;
        });

        if (groupRef.current) {
            // Dynamic 3D tilt applied to the entire curtain for enhanced perspective
            groupRef.current.rotation.x = Math.PI * 0.08 + Math.sin(time * 0.15) * 0.05; // Pitch forward/back slightly
            groupRef.current.rotation.z = Math.PI * 0.03 + Math.cos(time * 0.1) * 0.02;  // Beautiful diagonal bank
            groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.15; // Gentle left/right pan
        }
    });

    return (
        <group ref={groupRef}>
            {lines.map((line, i) => (
                <primitive key={i} object={line.lineObj} />
            ))}
        </group>
    );
}
