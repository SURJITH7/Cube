import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCubeStore } from '@/store/useCubeStore';
import { Cubie } from './Cubie';
import { CubieData } from '@/lib/cube/types';

const ANIMATION_SPEED = 0.15; // Speed factor per frame (approx 6-7 frames for 90 deg? No, this is added to progress)
// Let's use time-based animation for consistency.

export const RubiksCube: React.FC = () => {
    const cubies = useCubeStore((state) => state.cubies);
    const isAnimating = useCubeStore((state) => state.isAnimating);
    const currentMove = useCubeStore((state) => state.currentMove);
    const finishMove = useCubeStore((state) => state.finishMove);

    const progressRef = useRef(0);
    const groupRef = useRef<THREE.Group>(null);
    const cubieRefs = useRef<Record<number, THREE.Group | null>>({});

    // Reset refs when cubies change (e.g. reset)
    useEffect(() => {
        cubieRefs.current = {};
    }, [cubies]);

    useFrame((state, delta) => {
        if (isAnimating && currentMove) {
            // Increment progress
            const duration = 0.3;
            progressRef.current += delta / duration;

            if (progressRef.current >= 1) {
                progressRef.current = 0;
                finishMove();
                // Reset temporary rotations/positions after move finishes
                // The state update in finishMove will trigger a re-render with new static positions
                return;
            }

            // Animate
            const { axis, slice, clockwise } = currentMove;
            const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
            const angle = (Math.PI / 2) * progressRef.current * (clockwise ? -1 : 1);

            const axisVector = new THREE.Vector3(
                axis === 'x' ? 1 : 0,
                axis === 'y' ? 1 : 0,
                axis === 'z' ? 1 : 0
            );

            cubies.forEach(cubie => {
                const ref = cubieRefs.current[cubie.id];
                if (!ref) return;

                // Only animate if in the slice
                if (Math.round(cubie.position[axisIndex]) === slice) {
                    // Start from original position/rotation
                    const startPos = new THREE.Vector3(...cubie.position);
                    const startRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)); // Assuming 0,0,0 is base rotation for now as we don't track per-cubie rotation state separately in store yet, or do we?
                    // Wait, the store only tracks position and face colors. It doesn't track rotation.
                    // The rotation is implicit in the face colors being swapped.
                    // So, physically, the cubie is always at "0,0,0" rotation relative to its slot, but the slot moves.
                    // Actually, my logic in `rotateCubies` swaps faces. So the cubie *data* changes, but its physical rotation is reset to 0.
                    // So when animating, we rotate FROM 0.

                    // Rotate position
                    startPos.applyAxisAngle(axisVector, angle);
                    ref.position.copy(startPos);

                    // Rotate orientation
                    const qRot = new THREE.Quaternion().setFromAxisAngle(axisVector, angle);
                    ref.quaternion.copy(startRot.premultiply(qRot));
                } else {
                    // Ensure static cubies stay in place (might not be needed if we don't touch them, but good for safety)
                    ref.position.set(...cubie.position);
                    ref.rotation.set(0, 0, 0);
                }
            });
        } else {
            // Not animating, ensure everything is in sync with state
            cubies.forEach(cubie => {
                const ref = cubieRefs.current[cubie.id];
                if (ref) {
                    ref.position.set(...cubie.position);
                    ref.rotation.set(0, 0, 0);
                }
            });
        }
    });

    return (
        <group ref={groupRef}>
            {cubies.map((cubie) => (
                <Cubie
                    key={cubie.id}
                    ref={(el) => { cubieRefs.current[cubie.id] = el; }}
                    data={cubie}
                    position={cubie.position}
                    rotation={[0, 0, 0]} // Always 0 because state change handles the "rotation" by swapping faces
                />
            ))}
        </group>
    );
};
