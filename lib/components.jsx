import React from 'react';
import classnames from 'classnames';
import Immutable from 'immutable';

class Answer extends React.Component {
    render() {
        return <p>Answer</p>;
    }
}

class Question extends React.Component {
    render() {
        const classes = classNames({
            'quiz-builder__question': true,
            'quiz-builder__question--expanded': this.props.isExpanded
        });
        const question = this.props.question;
        let answers;

        if (this.props.isExpanded && question.multiChoiceAnswers.length > 0) {
            answers = <div className="quiz-builder__answers">
                {question.multiChoiceAnswers.map(answer => new Answer(answer))}
            </div>
        }
            
        return <div className={classes}>
            <div className="quiz-builder__question-text">
                {question.question}
            </div>
            {answers}
        </div>;
    }
}

export class QuizBuilder extends React.Component {
    constructor(props) {
        super(props);

        this.state = Immutable.fromJS({
            questions: []
        });
    }

    addQuestion() {
        
    }
    
    render() {
        return <div className="quiz-builder">
            <div className="quiz-builder__questions">
                {this.state.get("questions").map(question => new Question(question))}
            </div>

            <button className="quiz-builder__new-question" onClick={this.addQuestion.bind(this)}>New question</button>
        </div>;
    }
}
