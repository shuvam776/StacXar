import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Point {
    x: number;
    y: number;
}

interface RoadmapConnectorProps {
    start: Point;
    end: Point;
    color: string;
}

const RoadmapConnector: React.FC<RoadmapConnectorProps> = ({ start, end, color }) => {
    // Memoize path calculations to prevent layout thrashing and expensive string ops
    const pathData = useMemo(() => {
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        // Curvature factor - higher means wider "swing"
        const curvature = Math.min(Math.abs(dx) * 0.5, 150);
        const verticalBias = Math.abs(dy) * 0.2;

        const cp1 = { x: start.x + (dx > 0 ? curvature : -curvature), y: start.y + verticalBias };
        const cp2 = { x: end.x - (dx > 0 ? curvature : -curvature), y: end.y - verticalBias };

        return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
    }, [start, end]);

    return (
        <motion.svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }} // Reduced duration for snappier feel
        >
            {/* Glow Effect Path */}
            <motion.path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeOpacity="0.3"
                strokeLinecap="round"
                animate={{ stroke: color }}
                transition={{ duration: 0.3 }}
                className="blur-md"
            />

            {/* Main Line Path */}
            <motion.path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="3" // Slightly thinner line for cleaner look
                strokeLinecap="round"
                animate={{ stroke: color }}
                transition={{ duration: 0.3 }}
            />

            {/* Animated Dash (Flow) - Optional: reduce complexity if still slow */}
            <motion.path
                d={pathData}
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="4 16"
                strokeOpacity="0.4"
                animate={{ strokeDashoffset: [0, -20] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
        </motion.svg>
    );
};

export default React.memo(RoadmapConnector);
