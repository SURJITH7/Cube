import { CubieData, COLORS, Color, Face } from './types';

export const getInitialCubies = (): CubieData[] => {
    const cubies: CubieData[] = [];
    let id = 0;

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                const faces: CubieData['faces'] = {};

                if (y === 1) faces.U = COLORS.U;
                if (y === -1) faces.D = COLORS.D;
                if (z === 1) faces.F = COLORS.F;
                if (z === -1) faces.B = COLORS.B;
                if (x === 1) faces.R = COLORS.R;
                if (x === -1) faces.L = COLORS.L;

                cubies.push({
                    id: id++,
                    position: [x, y, z],
                    faces,
                });
            }
        }
    }

    return cubies;
};

const AXIS_MAP = {
    x: 0,
    y: 1,
    z: 2,
};

export const rotateCubies = (
    cubies: CubieData[],
    axis: 'x' | 'y' | 'z',
    slice: number, // -1, 0, 1
    clockwise: boolean
): CubieData[] => {
    return cubies.map((cubie) => {
        if (Math.round(cubie.position[AXIS_MAP[axis]]) !== slice) {
            return cubie;
        }

        const [x, y, z] = cubie.position;
        let newPos: [number, number, number] = [x, y, z];
        const newFaces = { ...cubie.faces };

        // 90 degree rotation logic
        if (axis === 'x') {
            if (clockwise) {
                newPos = [x, -z, y];
                const old = { ...newFaces };
                newFaces.U = old.F;
                newFaces.F = old.D;
                newFaces.D = old.B;
                newFaces.B = old.U;
            } else {
                newPos = [x, z, -y];
                const old = { ...newFaces };
                newFaces.U = old.B;
                newFaces.B = old.D;
                newFaces.D = old.F;
                newFaces.F = old.U;
            }
        } else if (axis === 'y') {
            if (clockwise) {
                newPos = [z, y, -x];
                const old = { ...newFaces };
                newFaces.F = old.R;
                newFaces.R = old.B;
                newFaces.B = old.L;
                newFaces.L = old.F;
            } else {
                newPos = [-z, y, x];
                const old = { ...newFaces };
                newFaces.F = old.L;
                newFaces.L = old.B;
                newFaces.B = old.R;
                newFaces.R = old.F;
            }
        } else if (axis === 'z') {
            if (clockwise) {
                newPos = [-y, x, z];
                const old = { ...newFaces };
                newFaces.U = old.L;
                newFaces.L = old.D;
                newFaces.D = old.R;
                newFaces.R = old.U;
            } else {
                newPos = [y, -x, z];
                const old = { ...newFaces };
                newFaces.U = old.R;
                newFaces.R = old.D;
                newFaces.D = old.L;
                newFaces.L = old.U;
            }
        }

        return {
            ...cubie,
            position: newPos,
            faces: newFaces,
        };
    });
};

const colorToFace = (color: Color | undefined): string => {
    if (!color) return 'U';
    switch (color) {
        case 'white': return 'U';
        case 'yellow': return 'D';
        case 'green': return 'F';
        case 'blue': return 'B';
        case 'red': return 'R';
        case 'orange': return 'L';
        default: return 'U';
    }
};

export const getCubeStateString = (cubies: CubieData[]): string => {
    // Order: U, R, F, D, L, B
    let state = '';

    // Helper to find cubie at pos
    const getCubie = (x: number, y: number, z: number) =>
        cubies.find(c => Math.round(c.position[0]) === x && Math.round(c.position[1]) === y && Math.round(c.position[2]) === z);

    // U Face (y=1). Rows z=-1, z=0, z=1. Cols x=-1, x=0, x=1.
    for (let z = -1; z <= 1; z++) {
        for (let x = -1; x <= 1; x++) {
            const c = getCubie(x, 1, z);
            state += colorToFace(c?.faces.U);
        }
    }

    // R Face (x=1). Rows y=1, y=0, y=-1. Cols z=1, z=0, z=-1.
    for (let y = 1; y >= -1; y--) {
        for (let z = 1; z >= -1; z--) {
            const c = getCubie(1, y, z);
            state += colorToFace(c?.faces.R);
        }
    }

    // F Face (z=1). Rows y=1, y=0, y=-1. Cols x=-1, x=0, x=1.
    for (let y = 1; y >= -1; y--) {
        for (let x = -1; x <= 1; x++) {
            const c = getCubie(x, y, 1);
            state += colorToFace(c?.faces.F);
        }
    }

    // D Face (y=-1). Rows z=1, z=0, z=-1. Cols x=-1, x=0, x=1.
    for (let z = 1; z >= -1; z--) {
        for (let x = -1; x <= 1; x++) {
            const c = getCubie(x, -1, z);
            state += colorToFace(c?.faces.D);
        }
    }

    // L Face (x=-1). Rows y=1, y=0, y=-1. Cols z=-1, z=0, z=1.
    for (let y = 1; y >= -1; y--) {
        for (let z = -1; z <= 1; z++) {
            const c = getCubie(-1, y, z);
            state += colorToFace(c?.faces.L);
        }
    }

    // B Face (z=-1). Rows y=1, y=0, y=-1. Cols x=1, x=0, x=-1.
    for (let y = 1; y >= -1; y--) {
        for (let x = 1; x >= -1; x--) {
            const c = getCubie(x, y, -1);
            state += colorToFace(c?.faces.B);
        }
    }

    return state;
};
