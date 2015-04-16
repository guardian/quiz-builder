import React from 'react';
import classnames from 'classnames';
import Immutable from 'immutable';

class Answer extends React.Component {
    render() {
        return <p>Answer</p>;
    }
}

class Question extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false
        };
    }
    
    render() {
        const classes = classnames({
            'quiz-builder__question': true,
            'quiz-builder__question--expanded': this.state.isExpanded
        });
        const question = this.props.question;
        let answersData = question.get('multiChoiceAnswers');
        let answers;

        if (this.props.isExpanded && answersData.size > 0) {
            answers = <div className="quiz-builder__answers">
                {answersData.map(answer => <Answer answer={answer} />).toJS()}
            </div>
        }
            
        return <div className={classes}>
            <div className="quiz-builder__question-text">
                <span className="quiz-builder__question-number">{this.props.index}</span>
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

    updateState(f) {
        const nextState = f(this.state);

        if (nextState !== this.state) {
            this.state = nextState;
            this.forceUpdate();
        }
    }

    addQuestion() {
        this.updateState(state => state.update(
            'questions', 
            questions => questions.push(Immutable.fromJS({
                question: "",
                more: "",
                multiChoiceAnswers: []
            }))
        ));
    }
    
    render() {
        const questions = this.state.get('questions')
            .map((question, i) => <Question question={question} key={`question_${i + 1}`} index={i + 1} />)
            .toJS()
        
        return <div className="quiz-builder">
            <div className="quiz-builder__questions">
                {questions}
            </div>

            <button className="quiz-builder__new-question" onClick={this.addQuestion.bind(this)}>New question</button>
        </div>;
    }
}
