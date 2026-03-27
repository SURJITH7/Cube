// @ts-ignore
import solver from 'rubiks-cube-solver';

export const solveCube = (stateString: string): string[] => {
    try {
        // The solver library usually expects the state string in a specific order.
        // U, R, F, D, L, B
        // My getCubeStateString generates exactly this order.

        // Note: Some solvers expect 'URFDLB' as face names.
        // My state string contains 'U', 'R', 'F', 'D', 'L', 'B'.

        const solution = solver(stateString);

        // If solution is a string, split it. If array, return it.
        if (typeof solution === 'string') {
            return solution.split(' ').filter(m => m.length > 0);
        }
        return solution; // Assuming it returns array of moves
    } catch (e) {
        console.error("Solver error:", e);
        return [];
    }
};
