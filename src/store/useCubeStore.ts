import { create } from 'zustand';
import { CubieData } from '@/lib/cube/types';
import { getInitialCubies, rotateCubies, getCubeStateString } from '@/lib/cube/utils';
import { solveCube } from '@/lib/cube/solver';

interface CubeState {
    cubies: CubieData[];
    isAnimating: boolean;
    animationQueue: Move[]; // Queue of moves to execute
    currentMove: Move | null;
    history: string[];

    // Actions
    reset: () => void;
    queueMove: (move: string) => void;
    finishMove: () => void;
    solve: () => void;
}

interface Move {
    axis: 'x' | 'y' | 'z';
    slice: number; // -1, 0, 1
    clockwise: boolean;
    notation: string;
}

const NOTATION_MAP: Record<string, Omit<Move, 'notation'>> = {
    R: { axis: 'x', slice: 1, clockwise: true },
    "R'": { axis: 'x', slice: 1, clockwise: false },
    L: { axis: 'x', slice: -1, clockwise: false },
    "L'": { axis: 'x', slice: -1, clockwise: true },

    U: { axis: 'y', slice: 1, clockwise: true },
    "U'": { axis: 'y', slice: 1, clockwise: false },
    D: { axis: 'y', slice: -1, clockwise: false },
    "D'": { axis: 'y', slice: -1, clockwise: true },

    F: { axis: 'z', slice: 1, clockwise: true },
    "F'": { axis: 'z', slice: 1, clockwise: false },
    B: { axis: 'z', slice: -1, clockwise: false },
    "B'": { axis: 'z', slice: -1, clockwise: true },
};

export const useCubeStore = create<CubeState>((set, get) => ({
    cubies: getInitialCubies(),
    isAnimating: false,
    animationQueue: [],
    currentMove: null,
    history: [],

    reset: () => {
        set({
            cubies: getInitialCubies(),
            isAnimating: false,
            animationQueue: [],
            currentMove: null,
            history: [],
        });
    },

    solve: () => {
        const { cubies } = get();
        const stateString = getCubeStateString(cubies);
        console.log("Solving state:", stateString);
        const solution = solveCube(stateString);
        console.log("Solution:", solution);

        if (solution.length > 0) {
            // Queue all moves
            solution.forEach(move => get().queueMove(move));
        } else {
            alert("Could not find solution or cube is already solved/invalid.");
        }
    },

    queueMove: (notation: string) => {
        const moveData = NOTATION_MAP[notation];
        if (!moveData) return;

        const move: Move = { ...moveData, notation };

        set((state) => {
            const newQueue = [...state.animationQueue, move];
            // If not animating, start immediately
            if (!state.isAnimating && !state.currentMove) {
                return {
                    animationQueue: newQueue.slice(1),
                    currentMove: newQueue[0],
                    isAnimating: true,
                };
            }
            return { animationQueue: newQueue };
        });
    },

    finishMove: () => {
        const { currentMove, cubies, animationQueue, history } = get();
        if (!currentMove) return;

        // Apply logical rotation
        const newCubies = rotateCubies(
            cubies,
            currentMove.axis,
            currentMove.slice,
            currentMove.clockwise
        );

        // Check if there are more moves
        const nextMove = animationQueue.length > 0 ? animationQueue[0] : null;
        const remainingQueue = animationQueue.length > 0 ? animationQueue.slice(1) : [];

        set({
            cubies: newCubies,
            history: [...history, currentMove.notation],
            currentMove: nextMove,
            animationQueue: remainingQueue,
            isAnimating: !!nextMove,
        });
    },
}));
