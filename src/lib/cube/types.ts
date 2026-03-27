export type Color = 'white' | 'yellow' | 'green' | 'blue' | 'red' | 'orange';
export type Face = 'U' | 'D' | 'F' | 'B' | 'L' | 'R';

export const COLORS: Record<Face, Color> = {
    U: 'white',
    D: 'yellow',
    F: 'green',
    B: 'blue',
    L: 'orange',
    R: 'red',
};

export const HEX_COLORS: Record<Color, string> = {
    white: '#ffffff',
    yellow: '#ffd500',
    green: '#009e60',
    blue: '#0051ba',
    red: '#c41e3a',
    orange: '#ff5800',
};

// Standard orientation:
// U: y=1, D: y=-1
// F: z=1, B: z=-1
// R: x=1, L: x=-1

export interface CubieData {
    id: number;
    position: [number, number, number]; // x, y, z coordinates (-1, 0, 1)
    // Colors for each face of the cubie. Null if that face is internal.
    faces: {
        U?: Color;
        D?: Color;
        F?: Color;
        B?: Color;
        L?: Color;
        R?: Color;
    };
}

export const SOLVED_STATE_STRING = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';
