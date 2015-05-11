import React from 'react';
import bonzo from 'bonzo';

class ReorderItem extends React.Component {
    onDragStart(event) {
        event.stopPropagation();
        event.dataTransfer.effectAllowed = 'move';

        this.props.setIsDragging();
    }

    onDragOver(event) {
        event.preventDefault();

        const over = event.currentTarget;
        const overIndex = parseInt(bonzo(over).attr('data-index'));
        const relY = event.clientY - over.getBoundingClientRect().top;
        const height = over.offsetHeight / 2;
        const placementIndex = relY > height ? overIndex : Math.max(0, overIndex - 1);
        this.props.moveDragged(placementIndex);
    }

    onDragEnd() {
        this.props.setIsNotDragging();
    }

    render() {
        const question = this.props.question;
        const style = {
            backgroundColor: this.props.isBeingDragged ? "#eeeeee" : "#ffffff"
        };

        return (
            <li draggable="true"
                data-index={this.props.index}
                className="list-group-item"
                onDragStart={this.onDragStart.bind(this)}
                onDragOver={this.onDragOver.bind(this)}
                onDragEnd={this.onDragEnd.bind(this)}
                style={style}
                >{question.get('question')}</li>
        );
    }
}

export default class Reorder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            draggedIndex: null
        }
    }

    setDraggedIndex(n) {
        this.setState({
            draggedIndex: n
        });
    }

    moveDragged(n) {
        if (this.state.draggedIndex !== n) {
            this.props.reorderQuestions(this.state.draggedIndex, n);
            this.setDraggedIndex(n);
        }
    }

    render() {
        const {quiz} = this.props;

        const questions = quiz.get('questions').map((question, i) =>
            <ReorderItem key={i}
                         question={question}
                         isBeingDragged={this.state.draggedIndex === i}
                         index={i}
                         setIsDragging={this.setDraggedIndex.bind(this, i)}
                         setIsNotDragging={this.setDraggedIndex.bind(this, null)}
                         moveDragged={this.moveDragged.bind(this)}
                />
        ).toJS();

        return (
            <div>
                <p>Drag and drop the questions below to rearrange their order:</p>
                <ul className="list-group">
                    {questions}
                </ul>
            </div>
        );
    }
}