import React, { useEffect, useRef } from 'react';
import { useCubeStore } from '@/store/useCubeStore';

export const History: React.FC = () => {
    const history = useCubeStore((state) => state.history);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [history]);

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto bg-black/30 p-2 rounded-lg backdrop-blur-sm scrollbar-hide"
            >
                {history.length === 0 && <span className="text-white/50 text-sm">No moves yet</span>}
                {history.map((move, i) => (
                    <span key={i} className="text-white font-mono bg-white/10 px-2 py-1 rounded text-sm whitespace-nowrap">
                        {move}
                    </span>
                ))}
            </div>
        </div>
    );
};
