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

        console.log("Creating question", props);

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

        console.log("Hi in a question");

        if (this.props.isExpanded && answersData.size > 0) {
            answers = <div className="quiz-builder__answers">
                {answersData.map(answer => <Answer answer={answer} />).toJS()}
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
        console.log("hi", this.state.toJS());

        const questions = this.state.get('questions')
              .map(question => <Question question={question} />)
            .toJS()

        console.log("Questions", questions);
        
        return <div className="quiz-builder">
            <div className="quiz-builder__questions">
                {questions}
            </div>

            <button className="quiz-builder__new-question" onClick={this.addQuestion.bind(this)}>New question</button>
        </div>;
    }
}
