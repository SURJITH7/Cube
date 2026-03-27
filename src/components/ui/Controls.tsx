import React from 'react';
import { useCubeStore } from '@/store/useCubeStore';
import { Shuffle, RotateCcw, Play } from 'lucide-react';

export const Controls: React.FC = () => {
    const reset = useCubeStore((state) => state.reset);
    const queueMove = useCubeStore((state) => state.queueMove);
    const isAnimating = useCubeStore((state) => state.isAnimating);
    const solve = useCubeStore((state) => state.solve);

    const handleShuffle = () => {
        const moves = ['R', "R'", 'L', "L'", 'U', "U'", 'D', "D'", 'F', "F'", 'B', "B'"];
        for (let i = 0; i < 20; i++) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            queueMove(randomMove);
        }
    };

    const handleSolve = async () => {
        solve();
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 p-4 rounded-2xl backdrop-blur-md text-white">
            <button onClick={handleShuffle} disabled={isAnimating} className="flex flex-col items-center gap-1 hover:text-blue-400 transition disabled:opacity-50">
                <Shuffle size={24} />
                <span className="text-xs">Shuffle</span>
            </button>

            <button onClick={reset} disabled={isAnimating} className="flex flex-col items-center gap-1 hover:text-red-400 transition disabled:opacity-50">
                <RotateCcw size={24} />
                <span className="text-xs">Reset</span>
            </button>

            <button onClick={handleSolve} disabled={isAnimating} className="flex flex-col items-center gap-1 hover:text-green-400 transition disabled:opacity-50">
                <Play size={24} />
                <span className="text-xs">Solve</span>
            </button>
        </div>
    );
};
