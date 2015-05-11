import React from 'react';

export const tick = (color) => <svg className="quiz__answer-icon-svg" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path fill={color || '#fff'} d="M23.895 3.215L10.643 16.467 5.235 11.06 1.7 14.594l5.407 5.407 3.182 3.183.353.353L27.43 6.75z"/></svg>;

export const cross = (color) => <svg className="quiz__answer-icon-svg" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><path fill={color || '#fff'} d="M24.247 7.633l-3.535-3.535-6.626 6.626L7.46 4.098 3.925 7.633l6.626 6.626-6.624 6.624L7.46 24.42l6.626-6.626 6.626 6.626 3.535-3.535-6.626-6.626z"/></svg>;
