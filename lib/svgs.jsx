import React from 'react';

export function close(size, strokeWidth) {
    if (!strokeWidth) strokeWidth = 2;
    
    const start = strokeWidth / 2;
    const end = size - strokeWidth / 2;

    const lineStyle = {
        stroke: 'black',
        strokeWidth: strokeWidth
    };
    
    return <svg width={size} height={size}>
        <line x1={start} x2={end} y1={start} y2={end} style={lineStyle} />
        <line x1={end} x2={start} y1={start} y2={end} style={lineStyle} />
    </svg>
}
