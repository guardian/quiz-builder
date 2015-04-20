import React from 'react';
import bonzo from 'bonzo';

let draggedElement = null;

export function setDraggedElement(component) {
    const element = React.findDOMNode(component);
    draggedElement = element;
}

export function unsetDraggedElement() {
    draggedElement = null;
}

export function draggedElementContext() {
    const context = bonzo(draggedElement).attr('data-drag-context');
    return context;
}
