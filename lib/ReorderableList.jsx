import React from 'react';
import bonzo from 'bonzo';
import flatten from 'lodash-node/modern/array/flatten';
import drop from 'lodash-node/modern/array/drop';
import map from 'lodash-node/modern/collection/map';
import take from 'lodash-node/modern/array/take';
import {setDraggedElement, unsetDraggedElement, draggedElementContext} from './draggedElement';

class ReorderableItem extends React.Component {
    onDragStart(event) {
        event.stopPropagation();
        setDraggedElement(this);
        event.dataTransfer.effectAllowed = 'move';
        this.props.setIsDragging(true);
        this.props.setDragIndex(this.props.index);
    }

    onDragEnd(event) {
        event.stopPropagation();
        unsetDraggedElement();
        this.props.setIsDragging(false);
    }

    onDragOver(event) {
        if (draggedElementContext() === this.props.context) {
            const $node = bonzo(React.findDOMNode(this));
            const offset = $node.offset();
            const relY = bonzo(document.body).scrollTop() + event.clientY - offset.top;
            const dropPosition = this.props.index + (relY >= offset.height / 2 ? 1 : 0)
            this.props.setDropIndex(dropPosition);
        }
    }
    
    render() {
        return <div draggable="true"
                    data-drag-context={this.props.context}
                    onDragStart={this.onDragStart.bind(this)}
                    onDragEnd={this.onDragEnd.bind(this)}
                    onDragOver={this.onDragOver.bind(this)}>
            {this.props.component}
        </div>;
    }
}

export default class ReorderableList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dragIndex: null,
            dropIndex: null,
            isDragging: false
        };
    }

    setDragIndex(i) {
        this.state.dragIndex = i;
        this.forceUpdate();
    }
    
    setDropIndex(i) {
        this.state.dropIndex = i;
        this.forceUpdate();
    }

    setIsDragging(isDragging) {
        if (this.state.isDragging && !isDragging) {
            this.props.onReorder(this.state.dragIndex, this.state.dropIndex);
        }
        this.state.isDragging = isDragging;
        if (!isDragging) {
            this.state.dragIndex = null;
            this.state.dropIndex = null;
        }
        this.forceUpdate();
    }

    render() {
        let items = map(this.props.components, (component, i) => {
            return <ReorderableItem index={i}
                                    key={`reorderable_item_${i}`}
                                    context={this.props.context}
                                    setDropIndex={this.setDropIndex.bind(this)}
                                    setDragIndex={this.setDragIndex.bind(this)}
                                    setIsDragging={this.setIsDragging.bind(this)}
                                    component={component} />
        });

        if (items.length > 1 && this.state.isDragging && this.state.dropIndex !== null) {
            const {dragIndex, dropIndex} = this.state;

            if (dragIndex !== dropIndex && dragIndex + 1 !== dropIndex) {
                items = flatten([
                    take(items, dropIndex),
                    <div key="placeholder" className="quiz-builder__drop-placeholder"></div>,
                    drop(items, dropIndex)
                ]);
            }
        }

        return <div>{items}</div>;
    }
}
