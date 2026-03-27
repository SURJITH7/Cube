import React, { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { CubieData, HEX_COLORS } from '@/lib/cube/types';
import * as THREE from 'three';

interface CubieProps {
    data: CubieData;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
}

const BLACK = '#111111';
const INNER_COLOR = '#222222';

export const Cubie = React.forwardRef<THREE.Group, CubieProps>(({ data, position, rotation, scale = 0.95 }, ref) => {
    const materials = useMemo(() => {
        // Order: +x (R), -x (L), +y (U), -y (D), +z (F), -z (B)
        const order = ['R', 'L', 'U', 'D', 'F', 'B'] as const;

        return order.map((face) => {
            const colorName = data.faces[face];
            const color = colorName ? HEX_COLORS[colorName] : BLACK;

            // Use a slightly different material for stickers vs plastic
            return new THREE.MeshStandardMaterial({
                color: color,
                roughness: 0.1,
                metalness: 0.1,
                // If it's a sticker, maybe add some polish
            });
        });
    }, [data.faces]);

    return (
        <group ref={ref} position={position ? new THREE.Vector3(...position) : undefined} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            <RoundedBox args={[1, 1, 1]} radius={0.1} smoothness={4} scale={[scale, scale, scale]}>
                {materials.map((mat, idx) => (
                    <primitive key={idx} object={mat} attach={`material-${idx}`} />
                ))}
            </RoundedBox>
        </group>
    );
});

Cubie.displayName = 'Cubie';
