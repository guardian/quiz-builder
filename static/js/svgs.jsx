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

export const tick = <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path className="quiz-builder__tick-path" d="M23.895 3.215L10.643 16.467 5.235 11.06 1.7 14.594l5.407 5.407 3.182 3.183.353.353L27.43 6.75z"/></svg>;

export const cross = <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path className="quiz-builder__cross-path" d="M24.247 7.633l-3.535-3.535-6.626 6.626L7.46 4.098 3.925 7.633l6.626 6.626-6.624 6.624L7.46 24.42l6.626-6.626 6.626 6.626 3.535-3.535-6.626-6.626z"/></svg>;

export const down = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M7.41 7.84l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z"/>
        <path d="M0-.75h24v24h-24z" fill="none"/>
    </svg>

export const up = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M7.41 15.41l4.59-4.58 4.59 4.58 1.41-1.41-6-6-6 6z"/>
        <path d="M0 0h24v24h-24z" fill="none"/>
    </svg>
