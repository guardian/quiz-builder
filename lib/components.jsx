import React from 'react';

class Question extends React.Component {
    render() {
        if (this.props.isExpanded) {
            return <div className="quiz-builder__question">
                
            </div>;
        } else {

        }
    }
}

export class QuizBuilder extends React.Component {
    render() {
        return <div className="quiz-builder">
            Hello world!
        </div>;
    }
}
